import { useState } from "react";
import LandingPage from "./components/landingpage";
import StoryMode from "./components/storymode";
import Output from "./components/output";

type Page = "landing" | "story" | "output";

function App() {
  const [page] = useState<Page>("landing");

  return (
    <>
      {page === "landing" && <LandingPage />}
      {page === "story" && <StoryMode />}
      {page === "output" && <Output />}
    </>
  );
}

export default App;
