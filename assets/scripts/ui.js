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
			experienceYears: document.getElementById("experience-years").value,
		};

		handler(rawCandidate)
	});
};

export const onProfileEdit = (handler) => {
	const form = document.getElementById("profile-form")

	form.addEventListener("input", () => handler())
}