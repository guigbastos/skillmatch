import {
	createJobs,
	validateCandidate,
	analyseJobs,
	createAnalysisCounter,
} from "./engine.js";
import { loadJobs, loadProfile, saveProfile } from "./data.js";
import {
	showStatus,
	setCatalogState,
	onRetry,
	onProfileSubmit,
	onProfileEdit,
	showValidationErrors,
	activateCustomValidation,
	onSkillsChange,
	readSelectedSkills,
	readSkillExperienceFields,
	renderSkillExperienceFields,
	renderResults,
	clearResults,
	fillProfileForm,
	renderProfile,
	showAnalysisCount,
	showStorageNotice,
	areaLabels,
} from "./ui.js";

let isLoading = false;
let jobs = [];
let currentSummary = null;
const nextAnalysisCount = createAnalysisCounter();

function updateSkillExperienceFields() {
	const previousValues = readSkillExperienceFields();
	const selectedSkills = readSelectedSkills();
	renderSkillExperienceFields(selectedSkills, previousValues);
}

function restoreProfile() {
	const stored = loadProfile();
	if (stored.status === "empty") {
		return;
	}
	if (stored.status === "error") {
		showStorageNotice(
			"Não foi possível recuperar o perfil salvo. Preencha os campos novamente.",
		);
		return;
	}

	const validation = validateCandidate(stored.profile);
	if (!validation.isValid) {
		showStorageNotice(
			"O perfil salvo está inválido. Preencha os campos novamente.",
		);
		return;
	}

	fillProfileForm(validation.candidate);
}

function handleProfileSubmit(rawCandidate) {
	if (isLoading || jobs.length === 0) {
		showStatus(
			isLoading
				? "Aguarde o carregamento das vagas."
				: "Carregue as vagas antes de analisar.",
		);
		return;
	}

	const validation = validateCandidate(rawCandidate);
	showValidationErrors(validation.errors);
	if (!validation.isValid) {
		currentSummary = null;
		clearResults();
		showStatus("Revise os campos indicados antes de analisar.");
		return;
	}

	analyseJobs(validation.candidate, jobs, (summary) => {
		currentSummary = summary;
		renderResults(summary);
		renderProfile(validation.candidate);
		showAnalysisCount(nextAnalysisCount());
		const persistence = saveProfile(validation.candidate);
		const warning =
			persistence.status === "error"
				? "O perfil não pôde ser salvo neste navegador."
				: "";
		showStorageNotice(warning);
		const resultMessage =
			summary.status === "no-area-jobs"
				? `Não há vagas cadastradas para ${areaLabels[validation.candidate.areaOfInterest]}.`
				: `Análise concluída: ${summary.results.length} vagas de ${areaLabels[validation.candidate.areaOfInterest]}.`;
		showStatus(resultMessage);
	});
}

function handleProfileEdit() {
	if (currentSummary === null) {
		return;
	}
	currentSummary = null;
	clearResults();
	showStatus(
		"Perfil alterado. Analise novamente para atualizar os resultados.",
	);
}

async function refreshCatalog() {
	if (isLoading) {
		return;
	}
	isLoading = true;
	jobs = [];
	currentSummary = null;
	clearResults();
	setCatalogState({ isLoading: true, canAnalyse: false, canRetry: false });
	showStatus("Carregando vagas...");
	try {
		const records = await loadJobs();
		const catalog = createJobs(records);
		if (!catalog.isValid) {
			showStatus(catalog.error);
		} else {
			jobs = catalog.jobs;
			showStatus(
				jobs.length
					? `${jobs.length} vagas carregadas. Preencha ou revise seu perfil.`
					: "O catálogo está vazio. Não há vagas cadastradas.",
			);
		}
	} catch (error) {
		console.error(
			"Falha de rede ou parsing JSON ao carregar o catálogo.",
			error,
		);
		showStatus("Falha de rede ou leitura do JSON. Tente novamente.");
	}
	isLoading = false;
	setCatalogState({
		isLoading: false,
		canAnalyse: jobs.length > 0,
		canRetry: jobs.length === 0,
	});
}

activateCustomValidation();
onProfileSubmit(handleProfileSubmit);
onProfileEdit(handleProfileEdit);
onSkillsChange(updateSkillExperienceFields);
onRetry(refreshCatalog);
restoreProfile();
refreshCatalog();