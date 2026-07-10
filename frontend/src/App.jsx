import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  if (isCheckingSession) {
    return (
      <main className="app-shell">
        <section className="auth-panel">
          <p>Checking session...</p>
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <HomePage user={user} setUser={setUser} /> : <LoginPage setUser={setUser} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage setUser={setUser} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;