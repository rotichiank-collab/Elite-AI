import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import AccountPage from "./pages/AccountPage";
import GigsPage from "./pages/GigsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PayoutsPage from "./pages/PayoutsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

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
        element={
          user ? <Navigate to="/home" replace /> : <LoginPage setUser={setUser} />
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/home" replace />
          ) : (
            <RegisterPage setUser={setUser} />
          )
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute user={user}>
            <HomePage user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute user={user}>
            <AccountPage user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <ProfilePage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gigs"
        element={
          <ProtectedRoute user={user}>
            <GigsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payouts"
        element={
          <ProtectedRoute user={user}>
            <PayoutsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
    </Routes>
  );
}

export default App;