import { logoutUser } from "../api/auth";

const careers = [
    "AI data annotation",
    "Prompt response rating",
    "Search result evaluation",
    "Image and video labeling",
    "Speech transcription review",
    "AI safety evaluation",
];

function HomePage({ user, setUser }) {
    async function handleLogout() {
        await logoutUser();
        setUser(null);
    }

    return (
        <main className="app-shell">
            <section className="home-panel">
                <header className="home-header">
                    <div>
                        <p className="eyebrow">Elite AI</p>
                        <h1>AI Training Jobs</h1>
                        <p className="intro">
                            Welcome, {user.name}. Elite AI connects verified workers with AI
                            training gigs provided directly by the company.
                        </p>
                    </div>

                    <button className="small-button" onClick={handleLogout} type="button">
                        Log out
                    </button>
                </header>

                <nav className="home-actions" aria-label="Main navigation">
                    <button type="button">Account</button>
                    <button type="button">Profile</button>
                    <button type="button">Gigs</button>
                    <button type="button">Pay-outs</button>
                </nav>

                <section className="career-list" aria-labelledby="careers-heading">
                    <h2 id="careers-heading">Career areas</h2>
                    <ul>
                        {careers.map((career) => (
                            <li key={career}>{career}</li>
                        ))}
                    </ul>
                </section>
            </section>
        </main>
    );
}

export default HomePage;