const seniorityLabels = {
	junior: "Junior",
	"mid-level": "Pleno",
	senior: "Senior",
};

export const normalizeSkills = (skills) => {
  if (
    !skills
    || typeof skills !== "object"
    || typeof skills.every !== "function"
    || typeof skills.map !== "function"
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
  if (!records || typeof records !== "object" || typeof records.map !== "function") {
    return { isValid: false, jobs: [], error: "O catálogo deve ser uma lista de vagas." };
  }

  try {
    const jobs = records.map((record) => {
      if (record !== null && typeof record === "object" && record.area === "front-end") {
        return new FrontEndJob(record);
      }

      return new Job(record);
    });

    return { isValid: true, jobs, error: "" };
  } catch (error) {
    return { isValid: false, jobs: [], error: error.message };
  }
};