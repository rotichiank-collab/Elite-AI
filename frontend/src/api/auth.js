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
            data.error || data.message || "Something went wrong. Please try again.";

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