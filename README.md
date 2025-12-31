# WrapYourGit 🎁

**WrapYourGit** is a "Spotify Wrapped" style experience for your GitHub profile. It analyzes your activity over the past year (or recent months) and generates a dynamic, visual summary of your coding journey.

## 🚀 Features

*   **Visual Story Mode**: A slide-by-slide presentation of your stats, similar to social media stories.
*   **Key Metrics**:
    *   Total Commits & Repositories
    *   Top Languages (by usage percentage)
    *   Busiest Day & Time of Day
    *   Longest Streak (based on recent activity)
    *   Monthly Activity Graph
*   **Personality Type**: Assigns a fun "Developer Personality" based on your coding habits (e.g., "The Open Sourcerer", "The Night Owl").
*   **Shareable Summary**: Generates a clean, downloadable image of your stats to share on social media.
*   **Private Repo Support**: Option to include private repositories by providing a Personal Access Token.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion (for animations).
*   **Backend**: Node.js, Express, Axios (Serverless function on Vercel).
*   **Deployment**: Vercel.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js installed.
*   A GitHub Personal Access Token (optional, for higher rate limits or private repos).

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/shouri123/WRAP-YOUR-GIT.git
    cd WRAP-YOUR-GIT
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    cd backend && npm install && cd ..
    ```

3.  **Configure Environment Variables**:
    *   Create a `.env` file in the `backend` folder.
    *   Add your GitHub Token:
        ```env
        GITHUB_TOKEN=your_github_pat_here
        ```

4.  **Run the App**:
    ```bash
    npm run dev
    ```
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:5000` (proxied via `/api`)

## 🚀 Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  **Important**: Add `GITHUB_TOKEN` to the **Environment Variables** in Vercel settings.
4.  Deploy! The `vercel.json` configuration handles the backend serverless function automatically.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by Shouri Chakraborty 
and IDEA Given By Asaad Hussain*