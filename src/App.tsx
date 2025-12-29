import { useState } from "react";
import LandingPage from "./components/landingpage";
import StoryMode from "./components/storymode";
import OutputPage from "./components/output";

type Page = "landing" | "story" | "output";

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [userData, setUserData] = useState<any>(null);

  const fetchUserData = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/github/${username}`);
      const data = await response.json();
      setUserData(data);
      setPage("story");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStoryFinish = () => {
    setPage("output");
  };

  const handleBackToStart = () => {
    setPage("landing");
    setUserData(null);
  };

  return (
    <>
      {page === "landing" && <LandingPage onGenerate={fetchUserData} />}
      {page === "story" && userData && <StoryMode data={userData} onFinish={handleStoryFinish} />}
      {page === "output" && userData && <OutputPage data={userData} onBack={handleBackToStart} />}
    </>
  );
}

export default App;
