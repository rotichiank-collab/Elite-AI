import { Link } from "react-router-dom";

const payoutMethods = [
    "Stripe connected account",
    "PayPal",
    "Sendwave",
    "Bank or debit payout option",
];

function PayoutsPage() {
    return (
        <main className="app-shell">
            <section className="home-panel">
                <p className="eyebrow">Pay-outs</p>
                <h1>Withdrawal Options</h1>
                <p className="intro">
                    Pay-out integrations will be added later. Elite AI will not store full
                    card or bank details directly in this app.
                </p>

                <ul className="option-list">
                    {payoutMethods.map((method) => (
                        <li key={method}>{method}</li>
                    ))}
                </ul>

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default PayoutsPage;