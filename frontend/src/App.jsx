import { useEffect, useState } from "react";
import "./App.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [healthStatus, setHealthStatus] = useState("Checking backend...");
  const [healthMessage, setHealthMessage] = useState("");

  useEffect(() => {
    async function checkBackendHealth() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`);

        if (!response.ok) {
          throw new Error("Backend returned an error");
        }

        const data = await response.json();

        setHealthStatus(data.status);
        setHealthMessage(data.message);
      } catch (error) {
        setHealthStatus("error");
        setHealthMessage("Could not connect to the Flask backend.");
      }
    }

    checkBackendHealth();
  }, []);

  return (
    <main className="app-shell">
      <section className="status-panel">
        <p className="eyebrow">Elite AI</p>
        <h1>AI Training Jobs</h1>
        <p className="intro">
          Frontend foundation is running. This page checks whether React can
          connect to the Flask backend.
        </p>

        <div className="health-card">
          <span className={`status-dot ${healthStatus}`} />
          <div>
            <strong>Backend status: {healthStatus}</strong>
            <p>{healthMessage}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;