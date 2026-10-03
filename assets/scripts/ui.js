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
