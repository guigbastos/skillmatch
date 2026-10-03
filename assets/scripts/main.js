import { createJobs } from "./engine.js";
import { loadJobs } from "./data.js";
import {
	showStatus,
	setCatalogState,
	onRetry,
	onSkillsChange,
	readSelectedSkills,
	readSkillExperienceFields,
	renderSkillExperienceFields,
} from "./ui.js";

function updateSkillExperienceFields() {
	const previousValues = readSkillExperienceFields();
	const selectedSkills = readSelectedSkills();
	renderSkillExperienceFields(selectedSkills, previousValues);
}

let isLoading = false;

async function refreshCatalog() {
	if (isLoading) {
		return;
	}
	isLoading = true;
	setCatalogState({ isLoading: true, canAnalyse: false, canRetry: false });
	showStatus("Carregando vagas...");
	try {
		const records = await loadJobs();
		const catalog = createJobs(records);
		if (!catalog.isValid) {
			showStatus(catalog.error);
			setCatalogState({
				isLoading: false,
				canAnalyse: false,
				canRetry: true,
			});
			return;
		}

		const jobs = catalog.jobs;
		showStatus(
			jobs.length
				? `${jobs.length} vagas carregadas.`
				: "O catálogo está vazio no momento.",
		);
		setCatalogState({
			isLoading: false,
			canAnalyse: false,
			canRetry: jobs.length === 0,
		});
	} catch (error) {
		console.error(
			"Falha de rede ou parsing JSON ao carregar o catálogo.",
			error,
		);
		showStatus("Falha de rede ou leitura do JSON. Tente novamente.");
		setCatalogState({
			isLoading: false,
			canAnalyse: false,
			canRetry: true,
		});
	} finally {
		isLoading = false;
	}
}

onRetry(refreshCatalog);
refreshCatalog();
onSkillsChange(updateSkillExperienceFields);
updateSkillExperienceFields();
