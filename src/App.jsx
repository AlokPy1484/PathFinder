import { useEffect, useState, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import HomeOptions from "./components/HomeOptions";
import ClipboardPage from "./components/ClipboardPage";
import OnlineSearchPage from "./components/OnlineSearchPage";
import OpenFilePage from "./components/OpenFilePage";
import GuidePage from "./components/guidePages/GuidePage";


/**
 * Root React component that renders the search UI and navigates between app pages.
 *
 * Manages search query state, first-launch behavior (shows the guide on first run),
 * Escape-key navigation (hides the window or returns to home), and input focus.
 * Renders different pages based on internal navigation state: home, clipboard,
 * online-search, open-app, and open-guide.
 *
 * @returns {JSX.Element} The root UI element for the application.
 */
function App() {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [firstLaunchChecked, setFirstLaunchChecked] = useState(false);

  
  useEffect(() => {

    if(firstLaunchChecked === false){
      localStorage.setItem("hasLaunched", "true");
      setCurrentPage("open-guide")
      console.log()
    }
    else{
      setCurrentPage("home")
    }
    setFirstLaunchChecked(true)

  },[])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (currentPage === "home") {
          getCurrentWindow().hide();
        } else {
          setCurrentPage("home");
          setQuery("");
          inputRef.current?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="raycast-overlay">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`search-input ${currentPage === "open-guide" ? "hidden" : "block"}`}
        />
      </div>
      <div className="main-container">
        <div className="results">
          {currentPage === "home" && (
            <HomeOptions
              query={query}
              onSelect={setCurrentPage}
              clearQuery={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            />
          )}
          {currentPage === "clipboard" && <ClipboardPage query={query} />}
          {currentPage === "online-search" && (
            <OnlineSearchPage query={query} />
          )}
          {currentPage === "open-app" && <OpenFilePage query={query} />}
          {currentPage === "open-guide" && <GuidePage query={query} />}
        </div>
      </div>
    </div>
  );
}

export default App;