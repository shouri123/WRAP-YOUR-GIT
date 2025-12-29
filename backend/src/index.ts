import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/api/github/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

        const headers: any = {};
        if (token) {
            headers["Authorization"] = `token ${token}`;
        }

        // Fetch profile, repos, and events in parallel
        // If token is present, use /user/repos to get private repos (assuming token owner == username or has access)
        // Otherwise use public endpoint
        const reposUrl = token
            ? `https://api.github.com/user/repos?per_page=100&sort=updated&type=all`
            : `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

        const [profileResponse, reposResponse, eventsResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}`, { headers }),
            axios.get(reposUrl, { headers }),
            axios.get(`https://api.github.com/users/${username}/events?per_page=100`, { headers })
        ]);

        const githubData = profileResponse.data;
        const repos = reposResponse.data;
        const events = eventsResponse.data;

        // --- CALCULATE STATS ---

        // 1. Languages
        const languageMap: Record<string, number> = {};
        let totalBytes = 0;

        repos.forEach((repo: any) => {
            if (repo.language) {
                languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
                totalBytes += 1;
            }
        });

        const topLanguages = Object.entries(languageMap)
            .map(([name, count]) => ({
                name,
                percent: Math.round((count / totalBytes) * 100),
                color: getColorForLanguage(name)
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 4);

        // 2. Stars & Forks
        const starsReceived = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
        const forks = repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);

        // 3. Top Repos
        const topRepositories = repos
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4)
            .map((repo: any) => ({
                name: repo.name,
                description: repo.description || "No description",
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language || "Unknown",
                languageColor: getColorForLanguage(repo.language || "Unknown")
            }));

        // 4. Activity (Busiest Day & Time) from Events
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts: Record<string, number> = {};
        const hourCounts: Record<number, number> = {};
        let pushEventsCount = 0;

        events.forEach((event: any) => {
            if (event.type === 'PushEvent') pushEventsCount++;

            const date = new Date(event.created_at);
            const day = days[date.getDay()];
            const hour = date.getHours();

            dayCounts[day] = (dayCounts[day] || 0) + 1;
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Monday";

        const busiestHour = parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "12");
        let busiestTime = "Afternoon ☀️";
        if (busiestHour < 6) busiestTime = "Late Night 🌑";
        else if (busiestHour < 12) busiestTime = "Morning 🌅";
        else if (busiestHour > 18) busiestTime = "Evening 🌆";

        // 5. Contribution Breakdown
        const eventTypes: Record<string, number> = {};
        events.forEach((event: any) => {
            eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
        });

        const contributionBreakdown = [
            { label: "Commits", value: Math.round(((eventTypes['PushEvent'] || 0) / events.length) * 100) || 0, color: "#4ade80" },
            { label: "PRs", value: Math.round(((eventTypes['PullRequestEvent'] || 0) / events.length) * 100) || 0, color: "#a78bfa" },
            { label: "Reviews", value: Math.round(((eventTypes['PullRequestReviewEvent'] || 0) / events.length) * 100) || 0, color: "#fbbf24" },
            { label: "Other", value: Math.round(((events.length - (eventTypes['PushEvent'] || 0) - (eventTypes['PullRequestEvent'] || 0) - (eventTypes['PullRequestReviewEvent'] || 0)) / events.length) * 100) || 0, color: "#f87171" }
        ];

        // Transform data to match frontend interfaces
        const transformedData = {
            username: githubData.login,
            avatar: githubData.avatar_url,
            year: 2025,
            profile: {
                bio: githubData.bio || "No bio available.",
                location: githubData.location || "Earth",
                joined: new Date(githubData.created_at).getFullYear().toString(),
                followers: githubData.followers,
                following: githubData.following
            },
            stats: {
                commits: pushEventsCount > 0 ? pushEventsCount * 12 : githubData.public_repos * 10, // Estimate if low events
                repos: githubData.public_repos,
                starsReceived,
                forks,
                topLanguages,
                topRepositories,
                busiestDay,
                busiestTime,
                longestStreak: Math.floor(Math.random() * 20) + 1, // Still mocked as it requires full history
                personality: "The Open Sourcerer 🧙‍♂️",
                personalityDesc: `You're most active on ${busiestDay}s during the ${busiestTime.toLowerCase()}.`,
                monthlyActivity: [ // Mock activity for now
                    { month: 'Jan', value: 45 }, { month: 'Feb', value: 60 }, { month: 'Mar', value: 85 },
                    { month: 'Apr', value: 40 }, { month: 'May', value: 90 }, { month: 'Jun', value: 120 },
                    { month: 'Jul', value: 75 }, { month: 'Aug', value: 30 }, { month: 'Sep', value: 100 },
                    { month: 'Oct', value: 140 }, { month: 'Nov', value: 80 }, { month: 'Dec', value: 55 }
                ],
                contributionBreakdown
            }
        };

        res.json(transformedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "GitHub fetch failed" });
    }
});

// Helper for language colors
function getColorForLanguage(language: string): string {
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Java: "#b07219",
        Go: "#00ADD8",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Vue: "#41b883",
        React: "#61dafb",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#178600",
        PHP: "#4F5D95",
        Ruby: "#701516",
        Swift: "#ffac45",
        Kotlin: "#F18E33",
        Dart: "#00B4AB"
    };
    return colors[language] || "#ccc";
}

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
