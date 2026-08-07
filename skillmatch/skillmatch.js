class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	introduce() {
		console.log(
			`Hello, my name is ${this.name} and I am ${this.age} years old.`,
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

    studyRecomendations(job) {
        let missingSkills = this.getMissingSkills(job);
        if (missingSkills.length === 0) {
            return `You already have all the skills`
        } else {
            let prioritySkill = missingSkills[0];
            return `To get this job, you should learn: ${missingSkills.join(", ")} and focus on ${prioritySkill}`
        }
    }
}

class Job {
	constructor(company, role, requirements) {
		this.company = company;
		this.role = role;
		this.requirements = requirements;
	}

	getSummary() {
		console.log(
			`${this.company} - ${this.role} - Requirements: ${this.requirements.join(", ")}`,
		);
	}
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

const jobs = [
	new Job("TechCorp Inc.", "Senior Frontend Engineer", [
		"React.js",
		"TypeScript",
		"GraphQL",
		"Jest",
		"AWS",
		"UI/UX Design Principles",
	]),
	new Job("Innovate Labs", "Staff Software Engineer (Backend)", [
		"Python",
		"Django",
		"PostgreSQL",
		"Docker",
		"Kubernetes",
		"RESTful APIs",
		"System Design",
	]),
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
	new Job("Enterprise Solutions", "Senior Software Engineer", [
		"C#",
		".NET",
		"Azure DevOps",
		"Angular",
		"TypeScript",
		"Microservices",
	]),
	new Job("Frontend Pros", "Senior Frontend Developer", [
		"HTML",
		"CSS",
		"JavaScript",
		"React",
		"Node.js",
		"Java",
		"Python",
        "Vue.js"
	]),
];

jobs.map((job) => {
	job.getSummary();
});

console.log(candidate.getMatchPercentage(jobs[6]));
console.log(candidate.classifyCompatibility(jobs[6]));
console.log(candidate.perfectMatch(jobs));
console.log(candidate.studyRecomendations(jobs[3]));