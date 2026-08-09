class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	introduce() {
		console.log(
			`Candidate data: \n Name: ${this.name} \n Age: ${this.age}`,
		);
	}
}

class Candidate extends Person {
	constructor(name, age, areaOfInterest, experience, skills) {
		super(name, age);
		this.experience = experience;
		this.skills = skills;
		this.areaOfInterest = areaOfInterest;
	}

	getMissingSkills(job) {
		return job.requirements.filter(
			(requirement) => !this.skills.includes(requirement),
		);
	}

	getMatchPercentage(job) {
		let matchPercentage =
			((job.requirements.length - this.getMissingSkills(job).length) /
				job.requirements.length) *
			100;
		return matchPercentage.toFixed(2);
	}

	classifyCompatibility(job) {
		let compatibility = this.getMatchPercentage(job);
		if (compatibility >= 80) {
			return "High";
		} else if (compatibility >= 50) {
			return "Medium";
		} else {
			return "Low";
		}
	}

	perfectMatch(jobs) {
		return jobs.reduce((bestJob, currentJob) => {
			if (
				parseFloat(this.getMatchPercentage(currentJob)) >
				parseFloat(this.getMatchPercentage(bestJob))
			) {
				return currentJob;
			} else {
				return bestJob;
			}
		});
	}

	studyRecommendations(job) {
		let missingSkills = this.getMissingSkills(job);
		if (missingSkills.length === 0) {
			return `You already have all the skills`;
		} else {
			let prioritySkill = missingSkills[0];
			return `To get this job, you should learn: ${missingSkills.join(", ")} and focus on ${prioritySkill}`;
		}
	}

	generateReport(job, callback) {
		let percentage = this.getMatchPercentage(job);
		let compatibility = this.classifyCompatibility(job);
		let recommendations = this.studyRecommendations(job);
		let report = `You have ${percentage}% chance of getting the job at ${job.company}. Your classification is ${compatibility}. ${recommendations}`;
		callback(report);
	}
}

class Job {
	constructor(company, role, requirements) {
		this.company = company;
		this.role = role;
		this.requirements = requirements;
	}
	getSummary() {
		console.log(`-------------------------------------`);
		console.log(
			`Company name: ${this.company} \nRole: ${this.role} \nRequirements: ${this.requirements.join(", ")}`,
		);
	}
}

function offerCount() {
	let total = 0;
	return {
		sum: function () {
			return total++;
		},
		totalOffer: function () {
			return total;
		},
	};
}

function countCompatibility() {
	let high = 0;
	let medium = 0;
	let low = 0;

	return {
		count: function (job) {
			let compatibility = candidate.classifyCompatibility(job);
			if (compatibility === "High") {
				high++;
			} else if (compatibility === "Medium") {
				medium++;
			} else {
				low++;
			}
		},
		report: function () {
			console.log(`-------------------------------------`);
			console.log(`High compatibility: ${high}`);
			console.log(`Medium compatibility: ${medium}`);
			console.log(`Low compatibility: ${low}`);
		},
	};
}

function fetchJobsFromServer() {
	return new Promise((resolve, reject) => {
		let isServerUp = Math.random();
		if (isServerUp >= 0.2) {
			setTimeout(() => {
				const jobs = [
					new Job("TechCorp Inc.", "Senior Frontend Engineer", [
						"React.js",
						"TypeScript",
						"GraphQL",
						"Jest",
						"AWS",
						"UI/UX Design Principles",
					]),
					new Job(
						"Innovate Labs",
						"Staff Software Engineer (Backend)",
						[
							"Python",
							"Django",
							"PostgreSQL",
							"Docker",
							"Kubernetes",
							"RESTful APIs",
							"System Design",
						],
					),
					new Job("Global Solutions", "Lead Fullstack Developer", [
						"Angular",
						"Node.js",
						"Express.js",
						"MongoDB",
						"Azure",
						"Microservices",
						"CI/CD",
					]),
					new Job("WebCrafters", "Junior Frontend Developer", [
						"HTML",
						"CSS",
						"JavaScript",
						"React",
						"Node.js",
						"Vue.js",
						"SASS",
					]),
					new Job("DataMinds", "Backend Developer", [
						"JavaScript",
						"Python",
						"Flask",
						"SQL",
						"Node.js",
						"Docker",
					]),
					new Job(
						"Enterprise Solutions",
						"Senior Software Engineer",
						[
							"C#",
							".NET",
							"Azure DevOps",
							"Angular",
							"TypeScript",
							"Microservices",
						],
					),
					new Job("Frontend Pros", "Senior Frontend Developer", [
						"HTML",
						"CSS",
						"JavaScript",
						"React",
						"Node.js",
						"Java",
						"Python",
						"Vue.js",
					]),
				];
				resolve(jobs);
			}, 0);
		} else {
			reject("Server is down");
		}
	});
}

const candidate = new Candidate("Guilherme", 27, "Frontend Development", 2, [
	"HTML",
	"CSS",
	"JavaScript",
	"React",
	"Node.js",
	"Java",
	"Python",
]);

async function main() {
	try {
		const jobs = await fetchJobsFromServer();
		let count = offerCount();
		let bestJob = candidate.perfectMatch(jobs);
		candidate.introduce();
		let companyNames = jobs.map((job) => job.company);
		console.log(`-------------------------------------`);
		console.log(`Empresas analisadas: ${companyNames.join(", ")}`);
		jobs.forEach((job) => {
			job.getSummary();
			count.sum();
			candidate.generateReport(job, console.log);
		});
		console.log(`-------------------------------------`);
		console.log(`${count.totalOffer()} offers loaded.`);
		let compatibility = countCompatibility();
		for (let i = 0; i < jobs.length; i++) {
			compatibility.count(jobs[i]);
		}
		compatibility.report();
		console.log(`-------------------------------------`);
		console.log(
			`Your best match is: ${bestJob.role} at ${bestJob.company} where you fit ${candidate.getMatchPercentage(
				bestJob,
			)}% of the requirements.`,
		);
		console.log(`-------------------------------------`);
	} catch (error) {
		console.log("Error: ", error);
	}
}

main();
