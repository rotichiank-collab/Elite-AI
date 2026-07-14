import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    createProfile,
    deleteProfile,
    getProfile,
    updateProfile,
    uploadCv,
} from "../api/auth";

function ProfilePage({ user }) {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: user.name || "",
        home_address: "",
        country: "",
        phone_number: "",
        email: user.email || "",
        linkedin_url: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [isUploadingCv, setIsUploadingCv] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfile();

                if (data.profile) {
                    setProfile(data.profile);
                    setFormData({
                        full_name: data.profile.full_name || "",
                        home_address: data.profile.home_address || "",
                        country: data.profile.country || "",
                        phone_number: data.profile.phone_number || "",
                        email: data.profile.email || "",
                        linkedin_url: data.profile.linkedin_url || "",
                    });
                }
            } catch (caughtError) {
                setError(caughtError.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                home_address: formData.home_address.trim() || null,
                country: formData.country.trim() || null,
                phone_number: formData.phone_number.trim() || null,
                linkedin_url: formData.linkedin_url.trim() || null,
            };

            const data = profile
                ? await updateProfile(payload)
                : await createProfile(payload);

            setProfile(data.profile);
            setMessage(profile ? "Profile updated successfully." : "Profile created successfully.");
        } catch (caughtError) {
            setError(caughtError.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteProfile() {
        const confirmed = window.confirm(
            "This will delete your profile details. Continue?",
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await deleteProfile();
            setProfile(null);
            setFormData({
                full_name: user.name || "",
                home_address: "",
                country: "",
                phone_number: "",
                email: user.email || "",
                linkedin_url: "",
            });
            setMessage("Profile deleted successfully.");
        } catch (caughtError) {
            setError(caughtError.message);
        }
    }

    async function handleCvUpload() {
        setMessage("");
        setError("");

        if (!profile) {
            setError("Create your profile before uploading a CV.");
            return;
        }

        if (!cvFile) {
            setError("Choose a CV file first.");
            return;
        }

        setIsUploadingCv(true);

        try {
            const data = await uploadCv(cvFile);
            setProfile(data.profile);
            setCvFile(null);
            setMessage("CV uploaded successfully.");
        } catch (caughtError) {
            setError(caughtError.message);
        } finally {
            setIsUploadingCv(false);
        }
    }


    if (isLoading) {
        return (
            <main className="app-shell">
                <section className="home-panel">
                    <p>Loading profile...</p>
                </section>
            </main>
        );
    }


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

                {profile && (
                    <div className="status-box">
                        Verification status:{" "}
                        <strong>{profile.verification_status.replaceAll("_", " ")}</strong>
                    </div>
                )}

                {message && <p className="form-success">{message}</p>}
                {error && <p className="form-error">{error}</p>}

                <form className="auth-form profile-form" onSubmit={handleSubmit}>
                    <label>
                        Full name
                        <input
                            autoComplete="name"
                            name="full_name"
                            onChange={handleChange}
                            required
                            type="text"
                            value={formData.full_name}
                        />
                    </label>

                    <label>
                        Home address
                        <input
                            autoComplete="street-address"
                            name="home_address"
                            onChange={handleChange}
                            type="text"
                            value={formData.home_address}
                        />
                    </label>

                    <label>
                        Country
                        <input
                            autoComplete="country-name"
                            name="country"
                            onChange={handleChange}
                            type="text"
                            value={formData.country}
                        />
                    </label>

                    <label>
                        Phone number
                        <input
                            autoComplete="tel"
                            name="phone_number"
                            onChange={handleChange}
                            type="tel"
                            value={formData.phone_number}
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
                        LinkedIn URL optional
                        <input
                            autoComplete="url"
                            name="linkedin_url"
                            onChange={handleChange}
                            placeholder="https://www.linkedin.com/in/your-profile"
                            type="url"
                            value={formData.linkedin_url}
                        />
                    </label>

                    <div className="cv-upload-box">
                        <h2>CV upload</h2>

                        {profile?.cv_original_filename ? (
                            <p>
                                Current CV: <strong>{profile.cv_original_filename}</strong>
                            </p>
                        ) : (
                            <p>No CV uploaded yet.</p>
                        )}

                        <input
                            accept=".pdf,.doc,.docx"
                            onChange={(event) => setCvFile(event.target.files[0] || null)}
                            type="file"
                        />

                        <button disabled={isUploadingCv} onClick={handleCvUpload} type="button">
                            {isUploadingCv ? "Uploading..." : "Upload CV"}
                        </button>

                        <p className="helper-text">
                            Accepted formats: PDF, DOC, DOCX. Maximum size: 5 MB.
                        </p>
                    </div>

                    <div className="form-actions">
                        <button disabled={isSaving} type="submit">
                            {isSaving ? "Saving..." : profile ? "Update profile" : "Create profile"}
                        </button>

                        {profile && (
                            <button
                                className="danger-button"
                                onClick={handleDeleteProfile}
                                type="button"
                            >
                                Delete profile
                            </button>
                        )}
                    </div>
                </form>

                <Link className="secondary-link" to="/home">
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default ProfilePage;