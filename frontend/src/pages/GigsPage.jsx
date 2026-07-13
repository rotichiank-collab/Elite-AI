import { Link } from "react-router-dom";

function GigsPage() {
    return (
        <main className="app-shell">
            <section className="home-panel">
                <p className="eyebrow">Gigs</p>
                <h1>Available Gigs</h1>
                <p className="intro">
                    You need an approved CV to access gigs. Once your CV is approved,
                    eligible AI training jobs will appear here.
                </p>

                <div className="notice-box">
                    Your CV must be verified and approved before you can access paid gigs.
                </div>

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default GigsPage;