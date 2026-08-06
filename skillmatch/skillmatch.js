class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

class Candidate extends Person {
    constructor(name, age, areaOfInterest, experience, skills) {
        super(name, age);
        this.experience = experience;
        this.skills = skills;
        this.areaOfInterest = areaOfInterest;
    }

    getMissingSkills(job){
        let missingSkills = [];
    }
}

class Job {
    constructor(company, role, requirements) {
        this.company = company;
        this.role = role;
        this.requirements = requirements;
    }
    
    getSummary(){
        console.log(`${this.company} - ${this.role} - Requirements: ${this.requirements}`)
    }
}

const candidate = new Candidate("Guilherme", 27, "Frontend Development", 2, ["HTML", "CSS", "JavaScript", "React", "Node.js", "Java", "Python"])

const jobs = [
    new Job("TechCorp Inc.", "Senior Frontend Engineer", ["React.js", "TypeScript", "GraphQL", "Jest", "AWS", "UI/UX Design Principles"]),
    new Job("Innovate Labs", "Staff Software Engineer (Backend)", ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes", "RESTful APIs", "System Design"]),
    new Job("Global Solutions", "Lead Fullstack Developer", ["Angular", "Node.js", "Express.js", "MongoDB", "Azure", "Microservices", "CI/CD"]),
    new Job("WebCrafters", "Junior Frontend Developer", ["HTML", "CSS", "JavaScript", "React", "Node.js", "Vue.js", "SASS"]),
    new Job("DataMinds", "Backend Developer", ["JavaScript", "Python", "Flask", "SQL", "Node.js", "Docker"]),
    new Job("Enterprise Solutions", "Senior Software Engineer", ["C#", ".NET", "Azure DevOps", "Angular", "TypeScript", "Microservices"])
]