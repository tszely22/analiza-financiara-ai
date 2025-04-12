import { writable } from "svelte/store";
import { browser } from "$app/environment";

function createAuthStore() {
	const { subscribe, set } = writable(false);

	const checkAuth = () => {
		if (!browser) return;
		const cookies = document.cookie.split("; ");
		const token = cookies.find((row) => row.startsWith("token="))?.split("=")[1];
		const expires = cookies.find((row) => row.startsWith("tokenExpires="))?.split("=")[1];
		const isValid = token && expires && Date.now() < Number(expires) * 1000;
		set(isValid);
	};

	return {
		subscribe,
		checkAuth,
		setLoggedIn: () => set(true),
		logout: () => {
			if (browser) {
				document.cookie = "token=; Max-Age=0; path=/";
				document.cookie = "tokenExpires=; Max-Age=0; path=/";
				document.cookie = "userEmail=; Max-Age=0; path=/";
			}
			set(false);
		},
	};
}

export const isLoggedIn = createAuthStore();
