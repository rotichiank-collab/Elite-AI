import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage({ setUser }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
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

        if (!acceptedTerms) {
            setError("You must accept the terms and conditions.");
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await registerUser(formData);
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
                <h1>Create Account</h1>
                <p className="intro">Register to begin your CV verification process.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            autoComplete="name"
                            name="name"
                            onChange={handleChange}
                            required
                            type="text"
                            value={formData.name}
                        />
                    </label>

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
                            autoComplete="new-password"
                            minLength="8"
                            name="password"
                            onChange={handleChange}
                            required
                            type="password"
                            value={formData.password}
                        />
                    </label>

                    <label>
                        Confirm Password
                        <input
                            autoComplete="new-password"
                            minLength="8"
                            name="confirm_password"
                            onChange={handleChange}
                            required
                            type="password"
                            value={formData.confirm_password}
                        />
                    </label>

                    <label className="terms-row">
                        <input
                            checked={acceptedTerms}
                            onChange={(event) => setAcceptedTerms(event.target.checked)}
                            type="checkbox"
                        />
                        <span>
                            I accept the{" "}
                            <a href="/terms-and-conditions.txt" download>
                                terms and conditions
                            </a>
                        </span>
                    </label>

                    {error && <p className="form-error">{error}</p>}

                    <button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <Link className="secondary-link" to="/">
                    Back to login
                </Link>
            </section>
        </main>
    );
}

export default RegisterPage;