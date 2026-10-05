export const showStatus = (message) => {
	document.getElementById("page-status").textContent = message;
};

export const setCatalogState = ({ isLoading, canAnalyse, canRetry }) => {
	document.getElementById("analyse-button").disabled =
		isLoading || !canAnalyse;
	document.getElementById("retry-button").hidden = !canRetry;
	document.getElementById("retry-button").disabled = isLoading;
};

export const onRetry = (handler) => {
	document.getElementById("retry-button").addEventListener("click", handler);
};

export const onProfileSubmit = (handler) => {
	const form = document.getElementById("profile-form");

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const skills = [];
		const skillsOptions = document.getElementById("skills-options");
		const skillCheckboxes = skillsOptions.querySelectorAll("input");

		skillCheckboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				skills.push(checkbox.value);
			}
		});

		const rawCandidate = {
			name: document.getElementById("candidate-name").value,
			areaOfInterest: document.getElementById("area-of-interest").value,
			skills,
			experienceBySkill: readSkillExperienceFields(),
		};

		handler(rawCandidate);
	});
};

export const onProfileEdit = (handler) => {
	const form = document.getElementById("profile-form");

	form.addEventListener("input", () => handler());
};

const skillLabels = {
	html: "HTML",
	css: "CSS",
	javascript: "JavaScript",
	typescript: "TypeScript",
	java: "Java",
	python: "Python",
	tailwind: "Tailwind",
	vue: "Vue.js",
	nodejs: "Node.js",
	nextjs: "Next.js",
	php: "PHP",
	"c-sharp": "C#",
	"rest-api": "APIs REST",
};

export const renderJobCards = (results, bestMatch) => {
	const jobList = document.getElementById("job-list");
	const workModeLabels = {
		remote: "Remoto",
		hybrid: "Híbrido",
		onsite: "Presencial",
	};

	jobList.innerHTML = "";

	results.forEach((result) => {
		const job = result.job;
		const card = document.createElement("article");
		card.classList.add("job-card");

		let bestMatchBadge = "";

		if (bestMatch && bestMatch.job.id === job.id) {
			card.classList.add("job-card-best");
			bestMatchBadge =
				'<p class="job-card-badge">Melhor compatibilidade</p>';
		}

		let matchedSkillsHTML = "";
		result.matchedSkills.forEach((skill) => {
			matchedSkillsHTML += `<li>${skillLabels[skill]}</li>`;
		});

		if (matchedSkillsHTML === "") {
			matchedSkillsHTML = "<li>Nenhuma habilidade encontrada.</li>";
		}

		let missingSkillsHTML = "";
		result.missingSkills.forEach((skill) => {
			missingSkillsHTML += `<li>${skillLabels[skill]}</li>`;
		});

		if (missingSkillsHTML === "") {
			missingSkillsHTML = "<li>Nenhuma habilidade faltante.</li>";
		}

		card.innerHTML = `
      <h3 class="job-card__title"></h3>
      ${bestMatchBadge}
      <p class="job-card__description"></p>
      <p class="job-card__company"></p>
      <p class="job-card__salary"></p>
      <p class="job-card__work-mode"></p>
      <p class="job-card__compatibility"></p>
      <p class="job-card__classification"></p>
      <h4>Habilidades encontradas</h4>
      <ul class="job-card__matched-skills">${matchedSkillsHTML}</ul>
      <h4>Habilidades faltantes</h4>
      <ul class="job-card__missing-skills">${missingSkillsHTML}</ul>
    `;

		card.querySelector(".job-card__title").textContent =
			job.getDisplayTitle();
		card.querySelector(".job-card__description").textContent =
			job.description;
		card.querySelector(".job-card__company").textContent =
			`Empresa: ${job.company}`;
		card.querySelector(".job-card__salary").textContent =
			`Salário: R$ ${job.salary} por mês`;
		card.querySelector(".job-card__work-mode").textContent =
			`Modalidade: ${workModeLabels[job.workMode]}`;
		card.querySelector(".job-card__compatibility").textContent =
			`Compatibilidade: ${Math.floor(result.percentage)}%`;
		card.querySelector(".job-card__classification").textContent =
			`Classificação: ${result.classification}`;

		jobList.appendChild(card);
	});
};

export const renderSkillExperienceFields = (skills, previousValues = {}) => {
	const container = document.getElementById("skill-experience-fields");
	let fieldsHTML = "";

	skills.forEach((skill) => {
		const inputId = `experience-${skill}-years`;

		fieldsHTML += `
			<div class="field">
        	  <label class="skill-experience-label" for="${inputId}">${skillLabels[skill]} (anos de experiência)</label>
				<input
				id="${inputId}"
				name="${skill}"
				type="number"
				min="0"
				max="50"
				step="1"
				required
				class="form-control"
				>
				<span id="skill-experience-error-${skill}" class="field-error skill-experience-error"></span>
			</div>
		`;
	});

	container.innerHTML = fieldsHTML;

	skills.forEach((skill) => {
		const input = document.getElementById(`experience-${skill}-years`);
		if (previousValues[skill] !== undefined) {
			input.value = previousValues[skill];
		}
	});
};

export const readSelectedSkills = () => {
	const selectedSkills = [];
	const skillsOptions = document.getElementById("skills-options");
	const checkboxes = skillsOptions.querySelectorAll("input");

	checkboxes.forEach((checkbox) => {
		if (checkbox.checked) {
			selectedSkills.push(checkbox.value);
		}
	});

	return selectedSkills;
};

export const readSkillExperienceFields = () => {
	const experienceBySkill = {};
	const container = document.getElementById("skill-experience-fields");
	const inputs = container.querySelectorAll("input");

	inputs.forEach((input) => {
		experienceBySkill[input.name] = input.value;
	});

	return experienceBySkill;
};

export const onSkillsChange = (handler) => {
	document
		.getElementById("skills-options")
		.addEventListener("change", handler);
};

const validationsFields = [
	{
		key: "name",
		errorId: "name-error",
	},
	{
		key: "areaOfInterest",
		errorId: "area-error",
	},
	{
		key: "skills",
		errorId: "skills-error",
	},
];

export const showValidationErrors = (errors = {}) => {
	validationsFields.forEach(({ key, errorId }) => {
		document.getElementById(errorId).textContent = errors[key] ?? "";
	});

	const experienceContainer = document.getElementById(
		"skill-experience-fields",
	);
	const experienceInputs = experienceContainer.querySelectorAll("input");

	experienceInputs.forEach((input) => {
		const skill = input.name;
		let message = "";

		if (errors.experienceBySkill && errors.experienceBySkill[skill]) {
			message = errors.experienceBySkill[skill];
		}

		const error = document.getElementById(
			`skill-experience-error-${skill}`,
		);
		error.textContent = message;
	});
};

export const activateCustomValidation = () => {
	const form = document.getElementById("profile-form");
	form.noValidate = true;
	showValidationErrors();
};

export const clearResults = () => {
	document.getElementById("results-section").hidden = true;
	document.getElementById("job-list").innerHTML = "";
	document.getElementById("match-summary").textContent = "";
	document.getElementById("study-recommendation").innerHTML = "";
	document.getElementById("profile-summary").textContent = "";
};

export const renderResults = ({ results, bestMatch, recommendations }) => {
	if (results.length === 0 || !bestMatch) {
		clearResults();
		return;
	}

	renderJobCards(results, bestMatch);

	const bestMatchMessage = `Maior compatibilidade: ${bestMatch.job.getDisplayTitle()}, ${bestMatch.job.company}, com ${Math.floor(bestMatch.percentage)}%.`;

	document.getElementById("match-summary").textContent = bestMatchMessage;

	const recommendationSection = document.getElementById(
		"study-recommendation",
	);

	if (recommendations.length === 0) {
		recommendationSection.innerHTML = `
			<h3>Recomendação de estudo</h3>
			<p>Seu perfil já contempla os requisitos de todas as vagas desta área.</p>
		`;
	} else {
		let recommendationItemHTML = "";

		recommendations.forEach(({ skill, count }) => {
			const jobLabel = count === 1 ? "vaga" : "vagas";
			recommendationItemHTML += `<li>${skillLabels[skill]} <span class="recommendation-count">Exigida em ${count} ${jobLabel}</span></li>`;
		});

		recommendationSection.innerHTML = `
		<h3>Recomendação de estudo</h3>
		<ul>${recommendationItemHTML}</ul>
		`;
	}

	document.getElementById("results-section").hidden = false;
};

export const fillProfileForm = (candidate) => {
	document.getElementById("candidate-name").value = candidate.name;
	document.getElementById("area-of-interest").value =
		candidate.areaOfInterest;

	const skillCheckboxes = document
		.getElementById("skills-options")
		.querySelectorAll("input");

	skillCheckboxes.forEach((input) => {
		let isSelected = false;

		candidate.skills.forEach((skill) => {
			if (skill === input.value) {
				isSelected = true;
			}
		});
		input.checked = isSelected;
	});
	renderSkillExperienceFields(candidate.skills, candidate.experienceBySkill);
};

export const areaLabels = {
	"front-end": "Front-end",
	"back-end": "Back-end",
	"full-stack": "Full Stack",
};

export const renderProfile = (candidate) => {
	let skillExperience = "";

	candidate.skills.forEach((skill) => {
		if (skillExperience !== "") {
			skillExperience += ", ";
		}

		const years = candidate.experienceBySkill[skill];
		const yearLabel = years === 1 ? "ano" : "anos";
		skillExperience += `${skillLabels[skill]}: ${years} ${yearLabel}`;
	});

	document.getElementById("profile-summary").textContent =
		`${candidate.name} - ${areaLabels[candidate.areaOfInterest]} - Experiência profissional por tecnologia: ${skillExperience}`;
};

export const showAnalysisCount = (count) => {
	document.getElementById("session-count").textContent = `Análises nesta sessão: ${count}`
}

export const showStorageNotice = (message) => {
	document.getElementById("storage-notice").textContent = message
}

