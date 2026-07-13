import { Link } from "react-router-dom";

function ProfilePage({ user }) {
    return (
        <main className="app-shell">
            <section className="home-panel">
                <p className="eyebrow">Profile</p>
                <h1>Your Profile</h1>
                <p className="intro">
                    Add your standard information, upload your CV, and start the
                    verification process.
                </p>

                <div className="notice-box">
                    CV forgery is prohibited. Elite AI charges 100 USD for CV verification
                    through a partnered identity and CV checking company.
                </div>

                <div className="profile-preview">
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>

                <button type="button">Verify CV</button>

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default ProfilePage;