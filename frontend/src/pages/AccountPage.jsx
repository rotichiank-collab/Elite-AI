import { Link } from "react-router-dom";
import { logoutUser } from "../api/auth";

function AccountPage({ user, setUser }) {
    async function handleLogout() {
        await logoutUser();
        setUser(null);
    }

    return (
        <main className="app-shell">
            <section className="home-panel">
                <p className="eyebrow">Account</p>
                <h1>Your Account</h1>
                <p className="intro">Manage login and account settings for {user.email}.</p>

                <div className="settings-list">
                    <button type="button">Change password</button>
                    <button onClick={handleLogout} type="button">
                        Log out
                    </button>
                    <button className="danger-button" type="button">
                        Delete account
                    </button>
                </div>

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default AccountPage;