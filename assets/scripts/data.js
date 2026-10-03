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
