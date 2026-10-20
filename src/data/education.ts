// Education, coursework and academic honours. Source: Resume.pdf and transcript-derived course list.
// The PDF lists "Dean's List" without a count; the 2x count comes from the previous site and
// the Ask Bach knowledge base.

export const education = {
  school: 'Ontario Tech University',
  location: 'Oshawa, ON',
  degree: 'BSc (Honours), Integrated Mathematics & Computer Science (Co-op)',
  start: 'Sep 2023',
  end: 'Apr 2027 (Expected)',
  gpa: '3.77 / 4.3',
  honours: ["President's List (3×)", "Dean's List (2×)"],
};

export interface Course {
  name: string;
  /** In progress this term. */
  current?: boolean;
  /** Shown first, as the most relevant to ML engineering. */
  key?: boolean;
}

export const coursework: { label: string; courses: Course[] }[] = [
  {
    label: 'Mathematics & statistics',
    courses: [
      { name: 'Linear Algebra', key: true },
      { name: 'Advanced Linear Algebra & Applications', key: true },
      { name: 'Optimization', key: true },
      { name: 'Statistics & Probability', key: true },
      { name: 'Real Analysis', key: true },
      { name: 'Mathematical Modelling' },
      { name: 'Calculus I–III' },
      { name: 'Differential Equations' },
      { name: 'Complex Analysis' },
      { name: 'Discrete Mathematics' },
    ],
  },
  {
    label: 'Computer science',
    courses: [
      { name: 'Computer Vision', current: true, key: true },
      { name: 'Data Mining', key: true },
      { name: 'Analysis & Design of Algorithms', key: true },
      { name: 'Data Structures', key: true },
      { name: 'Database Systems', key: true },
      { name: 'Scientific Data Analysis' },
      { name: 'Computational Science' },
      { name: 'Simulation & Modelling' },
      { name: 'Software Systems Development & Integration' },
      { name: 'Software Design & Analysis' },
      { name: 'Computer Architecture' },
      { name: 'Quantum Computing', current: true },
    ],
  },
];
