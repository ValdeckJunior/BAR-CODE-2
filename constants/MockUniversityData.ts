// Mock university data for faculties, departments, and sample students with registered courses
// This can be used for seeding, testing, or generating realistic student/course data

export const Faculties = [
  {
    name: "Faculty of Arts",
    departments: [
      "Department of English",
      "Department of French",
      "Department of History",
      "Department of Linguistics",
      "Department of Performing and Visual Arts",
    ],
  },
  {
    name: "Faculty of Agriculture and Veterinary Medicine",
    departments: [
      "Department of Agricultural Economics and Agribusiness",
      "Department of Agricultural Extension and Rural Development",
      "Department of Agronomic and Applied Molecular Sciences",
      "Department of Animal Science",
      "Department of Food Science and Technology",
      "Department of Forestry and Wildlife",
      "Department of Veterinary Medicine",
    ],
  },
  {
    name: "Faculty of Education",
    departments: [
      "Department of Curriculum Studies and Teaching",
      "Department of Educational Foundations and Administration",
      "Department of Educational Psychology",
    ],
  },
  {
    name: "Faculty of Engineering and Technology",
    departments: [
      "Department of Computer Engineering",
      "Department of Electrical and Electronic Engineering",
      "Department of Civil Engineering",
    ],
  },
  {
    name: "Faculty of Health Sciences",
    departments: [
      "Department of Biomedical Sciences",
      "Department of Nursing",
      "Department of Medical Laboratory Sciences",
      "Department of Public Health and Hygiene",
    ],
  },
  {
    name: "Faculty of Science",
    departments: [
      "Department of Animal Biology",
      "Department of Biochemistry and Molecular Biology",
      "Department of Chemistry",
      "Department of Computer Science",
      "Department of Environmental Science",
      "Department of Geology",
      "Department of Mathematics",
      "Department of Microbiology and Parasitology",
      "Department of Physics",
      "Department of Plant Science",
    ],
  },
  {
    name: "Faculty of Social and Management Sciences",
    departments: [
      "Department of Economics and Management",
      "Department of Journalism and Mass Communication",
      "Department of Sociology and Anthropology",
      "Department of Management",
      "Department of Law",
      "Department of Geography",
      "Department of Political Science",
      "Department of Banking and Finance",
      "Department of Women and Gender Studies",
    ],
  },
  {
    name: "Faculty of Laws and Political Science",
    departments: [], // Details not provided
  },
  {
    name: "College of Technology (COT)",
    departments: [
      "Software Engineering",
      "Network and Security",
      "Electrical and Electronic Engineering",
      "Mechanical and Industrial Engineering",
    ],
  },
  {
    name: "Advanced School of Translators and Interpreters (ASTI)",
    departments: [
      "Translation",
      "Translation (English ↔ French)",
      "Translation (French ↔ Spanish)",
      "Interpretation",
      "Interpretation (French ↔ English)",
      "Interpretation (Simultaneous & Consecutive)",
    ],
  },
];

// Example: Sample students with registered courses
export const SampleStudents = [
  {
    matricule: "FE20A001",
    name: "Alice N. Fomum",
    department: "Department of Computer Science",
    faculty: "Faculty of Science",
    level: "LEVEL 300",
    semester: "SEMESTER 2",
    academicYear: "2024/2025",
    courses: [
      {
        code: "CSC301",
        title: "Algorithms & Data Structures",
        isRegistered: true,
      },
      { code: "CSC305", title: "Operating Systems", isRegistered: true },
      { code: "MAT201", title: "Linear Algebra", isRegistered: false },
    ],
  },
  {
    matricule: "FE20A002",
    name: "Benoit T. Mbah",
    department: "Department of English",
    faculty: "Faculty of Arts",
    level: "LEVEL 200",
    semester: "SEMESTER 1",
    academicYear: "2024/2025",
    courses: [
      { code: "ENG201", title: "English Literature", isRegistered: true },
      { code: "ENG205", title: "Advanced Grammar", isRegistered: true },
      { code: "HIS101", title: "World History", isRegistered: false },
    ],
  },
  {
    matricule: "FE20A003",
    name: "Chantal E. Ngu",
    department: "Software Engineering",
    faculty: "College of Technology (COT)",
    level: "LEVEL 400",
    semester: "SEMESTER 2",
    academicYear: "2024/2025",
    courses: [
      {
        code: "SWE401",
        title: "Software Project Management",
        isRegistered: true,
      },
      { code: "SWE405", title: "Mobile App Development", isRegistered: true },
      { code: "EEE201", title: "Digital Electronics", isRegistered: false },
    ],
  },
];
