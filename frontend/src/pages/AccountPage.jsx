import { useState } from "react";
import { Link } from "react-router-dom";
import { changePassword, deleteAccount, logoutUser } from "../api/auth";

function AccountPage({ user, setUser }) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function handlePasswordChange(event) {
        setPasswordForm({
            ...passwordForm,
            [event.target.name]: event.target.value,
        });
    }

    async function handleLogout() {
        await logoutUser();
        setUser(null);
    }

    async function handleChangePassword(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            const data = await changePassword(passwordForm);
            setMessage(data.message);
            setPasswordForm({
                current_password: "",
                new_password: "",
                confirm_new_password: "",
            });
            setIsChangingPassword(false);
        } catch (caughtError) {
            setError(caughtError.message);
        }
    }

    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "This will permanently delete your Elite AI account. Continue?",
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteAccount();
            setUser(null);
        } catch (caughtError) {
            setError(caughtError.message);
        }
    }

    return (
        <main className="app-shell">
            <section className="home-panel">
                <p className="eyebrow">Account</p>
                <h1>Your Account</h1>
                <p className="intro">Manage login and account settings for {user.email}.</p>

                {message && <p className="form-success">{message}</p>}
                {error && <p className="form-error">{error}</p>}

                <div className="settings-list">
                    <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        type="button"
                    >
                        Change password
                    </button>

                    <button onClick={handleLogout} type="button">
                        Log out
                    </button>

                    <button
                        className="danger-button"
                        onClick={handleDeleteAccount}
                        type="button"
                    >
                        Delete account
                    </button>
                </div>

                {isChangingPassword && (
                    <form className="auth-form account-form" onSubmit={handleChangePassword}>
                        <label>
                            Current password
                            <input
                                autoComplete="current-password"
                                name="current_password"
                                onChange={handlePasswordChange}
                                required
                                type="password"
                                value={passwordForm.current_password}
                            />
                        </label>

                        <label>
                            New password
                            <input
                                autoComplete="new-password"
                                minLength="8"
                                name="new_password"
                                onChange={handlePasswordChange}
                                required
                                type="password"
                                value={passwordForm.new_password}
                            />
                        </label>

                        <label>
                            Confirm new password
                            <input
                                autoComplete="new-password"
                                minLength="8"
                                name="confirm_new_password"
                                onChange={handlePasswordChange}
                                required
                                type="password"
                                value={passwordForm.confirm_new_password}
                            />
                        </label>

                        <button type="submit">Save new password</button>
                    </form>
                )}

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default AccountPage;