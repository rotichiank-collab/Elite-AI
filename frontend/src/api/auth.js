const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            data.error ||
            data.message ||
            (data.errors ? JSON.stringify(data.errors) : null) ||
            "Something went wrong. Please try again.";

        throw new Error(message);
    }

    return data;
}

export function registerUser(payload) {
    return request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function loginUser(payload) {
    return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function logoutUser() {
    return request("/api/auth/logout", {
        method: "POST",
    });
}

export function getCurrentUser() {
    return request("/api/auth/me");
}

export function changePassword(payload) {
    return request("/api/account/password", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteAccount() {
    return request("/api/account", {
        method: "DELETE",
    });
}

export function getProfile() {
    return request("/api/profile");
}

export function createProfile(payload) {
    return request("/api/profile", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateProfile(payload) {
    return request("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteProfile() {
    return request("/api/profile", {
        method: "DELETE",
    });
}

export async function uploadCv(file) {
    const formData = new FormData();
    formData.append("cv", file);

    const response = await fetch(`${API_BASE_URL}/api/profile/cv`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        const message =
            data.error ||
            data.message ||
            (data.errors ? JSON.stringify(data.errors) : null) ||
            "Something went wrong. Please try again.";

        throw new Error(message);
    }

    return data;
}