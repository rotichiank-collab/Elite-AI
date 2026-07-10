import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

function LoginPage({ setUser }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const data = await loginUser(formData);
            setUser(data.user);
        } catch (caughtError) {
            setError(caughtError.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="app-shell">
            <section className="auth-panel">
                <p className="eyebrow">Elite AI</p>
                <h1>Login</h1>
                <p className="intro">Sign in to access your AI training jobs account.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            autoComplete="email"
                            name="email"
                            onChange={handleChange}
                            required
                            type="email"
                            value={formData.email}
                        />
                    </label>

                    <label>
                        Password
                        <input
                            autoComplete="current-password"
                            name="password"
                            onChange={handleChange}
                            required
                            type="password"
                            value={formData.password}
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}

                    <button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <Link className="secondary-link" to="/register">
                    Register
                </Link>
            </section>
        </main>
    );
}

export default LoginPage;