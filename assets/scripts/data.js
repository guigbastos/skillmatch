export async function loadJobs() {
	const response = await fetch("./assets/data/jobs.json");

	if (!response.ok) {
		throw new Error(
			`Não foi possível carregar o catálogo: HTTP ${response.status}.`,
		);
	}

	const records = await response.json();
	return records;
}

const profileKey = "skillmatch-profile";

export function loadProfile() {
	try {
		const storedProfile = localStorage.getItem(profileKey);
		if (storedProfile === null) {
			return { status: "empty", profile: null };
		}
		return { status: "success", profile: JSON.parse(storedProfile) };
	} catch (error) {
		return { status: "error", profile: null };
	}
}

export function saveProfile(candidate) {
	try {
		localStorage.setItem(profileKey, JSON.stringify(candidate));
		return { status: "success" };
	} catch (error) {
		return { status: "error" };
	}
}
