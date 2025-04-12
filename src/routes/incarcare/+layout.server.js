import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url }) {
	const token = cookies.get("token");
	const tokenExpires = cookies.get("tokenExpires");

	const isExpired = !tokenExpires || Date.now() > Number(tokenExpires) * 1000;

	if (!token || isExpired) {
		// Redirect if not already on login page
		if (!url.pathname.startsWith("/login")) {
			throw redirect(302, "/login");
		}
	}

	return {
		token,
		userEmail: cookies.get("userEmail") || null
	};
}
