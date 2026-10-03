const jobAreas = ["front-end", "back-end", "full-stack"]

const seniorityLabels = {
	junior: "Junior",
	"mid-level": "Pleno",
	senior: "Senior",
};

export const normalizeSkills = (skills) => {
	if (
		!skills ||
		typeof skills !== "object" ||
		typeof skills.every !== "function" ||
		typeof skills.map !== "function"
	) {
		throw new Error("As habilidades devem ser uma lista de textos.");
	}

	if (!skills.every((skill) => typeof skill === "string")) {
		throw new Error("As habilidades devem ser uma lista de textos.");
	}

	const normalizedSkills = skills
		.map((skill) => skill.trim().toLowerCase())
		.filter((skill) => skill !== "");

	return normalizedSkills.reduce((uniqueSkills, skill) => {
		if (!uniqueSkills.includes(skill)) {
			uniqueSkills.push(skill);
		}

		return uniqueSkills;
	}, []);
};

const validateJobRecord = (record) => {
	if (record === null || typeof record !== "object") {
		throw new Error("Cada vaga deve ser um objeto.");
	}

	const requirements = normalizeSkills(record.requirements);
	if (requirements.length === 0) {
		throw new Error("Cada vaga deve ter pelo menos um requisito válido.");
	}

	return requirements;
};

export class Job {
	constructor(record) {
		const requirements = validateJobRecord(record);

		this.id = record.id;
		this.company = record.company.trim();
		this.role = record.role.trim();
		this.description = record.description.trim();
		this.area = record.area;
		this.requirements = requirements;
		this.salary = record.salary;
		this.workMode = record.workMode;
		this.seniority = record.seniority;
		this.seniorityLabel = seniorityLabels[record.seniority];
	}

	getDisplayTitle() {
		return `${this.role} — ${this.seniorityLabel}`;
	}
	analyse(candidate) {
		const candidateSkills = normalizeSkills(candidate.skills);
		const matchedSkills = this.requirements.filter((skill) =>
			candidateSkills.includes(skill),
		);
		const missingSkills = this.requirements.filter(
			(skill) => !candidateSkills.includes(skill),
		);
		const percentage =
			(matchedSkills.length * 100) / this.requirements.length;

		return {
			job: this,
			percentage,
			matchedSkills,
			missingSkills,
			classification: classifyCompatibility(percentage),
		};
	}
}

export class FrontEndJob extends Job {
	constructor(record) {
		super(record);
		this.areaLabel = "Front-End";
	}

	getDisplayTitle() {
		return `${super.getDisplayTitle()} · ${this.areaLabel}`;
	}
}

export const createJobs = (records) => {
	if (
		!records ||
		typeof records !== "object" ||
		typeof records.map !== "function"
	) {
		return {
			isValid: false,
			jobs: [],
			error: "O catálogo deve ser uma lista de vagas.",
		};
	}

	try {
		const jobs = records.map((record) => {
			if (
				record !== null &&
				typeof record === "object" &&
				record.area === "front-end"
			) {
				return new FrontEndJob(record);
			}

			return new Job(record);
		});

		return { isValid: true, jobs, error: "" };
	} catch (error) {
		return { isValid: false, jobs: [], error: error.message };
	}
};

const highCompatibilityPercentage = 80;
const mediumCompatibilityPercentage = 50;

export const classifyCompatibility = (percentage) => {
	if (percentage >= highCompatibilityPercentage) {
		return "Alta";
	} else if (percentage >= mediumCompatibilityPercentage) {
		return "Média";
	} else {
		return "Baixa";
	}
};

export const findBestMatch = (result) =>
	result.reduce((best, current) => {
		if (best === null || current.percentage > best.percentage) {
			return current;
		}

		const isTie = current.percentage === best.percentage;
		if (isTie && current.job.id < best.job.id) {
			return current;
		}

		return best;
	}, null);

export const buildStudyRecommendation = (results) => {
	const frequencies = [];

	for (const result of results) {
		for (const skill of result.missingSkills) {
			const existing = frequencies.find((item) => item.skill === skill);
			if (existing) {
				existing.count += 1;
			} else {
				frequencies.push({ skill, count: 1 });
			}
		}
	}
	const highestCount = frequencies.reduce(
		(highest, item) => Math.max(highest, item.count),
		0,
	);

	return frequencies.filter((item) => item.count === highestCount);
};

export const analyseJobs = (candidate, jobs, onComplete) => {
	if (!Array.isArray(jobs)) {
		return {
			status: "invalid-catalog",
			message: "O catálogo precisa ser uma lista de vagas.",
		};
	}

	if (jobs.length === 0) {
		return {
			status: "empty-catalog",
			message: "Não há vagas disponíveis para analisar.",
		};
	}

	if (typeof onComplete !== "function") {
		return {
			status: "invalid-callback",
			message: "Informe uma função para receber a análise.",
		};
	}

	const matchingJobs = jobs.filter(
		(job) => job.area === candidate.areaOfInterest,
	);
	const results = matchingJobs.map((job) => job.analyse(candidate));
	const bestMatch = findBestMatch(results);
	const recommendations = buildStudyRecommendation(results);
	const status = results.length === 0 ? "no-area-jobs" : "success";

	const summary = {
		status,
		areaOfInterest: candidate.areaOfInterest,
		results,
		bestMatch,
		recommendations,
	};
	onComplete(summary);

	return summary;
};

export const createAnalysisCounter = () => {
	let count = 0;

	return function nextCount() {
		count += 1;
		return count;
	};
};

const availableSkills = [
	"html",
	"css",
	"javascript",
	"typescript",
	"java",
	"python",
	"tailwind",
	"vue",
	"nodejs",
	"nextjs",
	"php",
	"c-sharp",
	"rest-api",
];

export const validateCandidate = (rawCandidate) => {
	const errors = {};
	const source =
		rawCandidate !== null && typeof rawCandidate === "object"
			? rawCandidate
			: {};

	const name = typeof source.name === "string" ? source.name.trim() : "";
	const areaOfInterest = source.areaOfInterest;
	const rawSkills = source.skills;

	let skills = [];

	try {
		skills = normalizeSkills(rawSkills);

		if (skills.length === 0) {
			errors.skills = "Selecione pelo menos uma habilidade.";
		} else if (!skills.every((skill) => availableSkills.includes(skill))) {
			errors.skills =
				"Selecione apenas as habilidades disponíveis no formulário.";
		}
	} catch (error) {
		errors.skills = error.message;
	}

	const rawExperience = source.experienceYears;
	const hasExperienceValue =
		typeof rawExperience === "number" ||
		(typeof rawExperience === "string" && rawExperience.trim() !== "");
	const experienceYears = hasExperienceValue ? Number(rawExperience) : null;

	if (name === "") {
		errors.name = "Informe seu nome.";
	}

	if (!jobAreas.includes(areaOfInterest)) {
		errors.areaOfInterest = "Selecione sua área de interesse.";
	}

	if (
		experienceYears === null ||
		experienceYears % 1 !== 0 ||
		experienceYears < 0 ||
		experienceYears > 50
	) {
		errors.experienceYears =
			"Informe um valor de 0 a 50 anos de experiência profissional.";
	}

	const isValid =
		errors.name === undefined &&
		errors.areaOfInterest === undefined &&
		errors.skills === undefined &&
		errors.experienceYears === undefined;

	return {
		isValid,
		errors,
		candidate: isValid
			? { name, areaOfInterest, skills, experienceYears }
			: null,
	};
};
