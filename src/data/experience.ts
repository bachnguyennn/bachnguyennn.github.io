// Single source for roles shown on the homepage and /experience.
// Keep in sync with the resume.
// `id` matches the Cosmos DB document id; the live API version of an entry replaces this one on page load.
export const experience = [
  {
    id: 'vcl-research-experience',
    role: 'Undergraduate Thesis Researcher',
    org: 'Visual Computing Lab, Ontario Tech University · supervised by Dr. Faisal Qureshi',
    date: 'Sep 2026 – present',
    bullets: [
      "Researching continual learning for CascadedViT, the lab's lightweight vision transformer, to reduce catastrophic forgetting while keeping the model efficient.",
    ],
  },
  {
    id: 'math-ta-experience',
    role: 'Teaching Assistant, Prep. Math for Engineers (MATH-0900U)',
    org: 'Ontario Tech University',
    date: 'Sep 2026 – present',
    bullets: [
      'Lead weekly tutorials for a first-year engineering mathematics course, invigilate exams, and grade tutorial work, midterms, and finals.',
    ],
  },
  {
    id: 'cmha-experience',
    role: 'IT Intern',
    org: 'Canadian Mental Health Association · Oshawa, ON',
    date: 'May – Aug 2025',
    bullets: [
      'Built and deployed booking workflows with Power Apps and Power Automate, eliminating recurring double-booking errors and saving staff an estimated 5+ hours of scheduling per week.',
      'Managed employee data and files in SharePoint, and consolidated staff records into Excel workbooks with lookups and pivot tables for manager reporting.',
      'Modernized legacy internal tools, gathering requirements from non-technical staff and documenting the handoff for ongoing IT support.',
      'Maintained servers and resolved tier-1/tier-2 IT issues for 100+ staff, keeping clinical software available for client services.',
    ],
  },
  {
    id: 'cs-club-experience',
    role: 'Events Coordinator',
    org: 'Ontario Tech Computer Science Club',
    date: 'Sep 2025 – present',
    bullets: [
      'Co-organize an annual hackathon with 250+ participants: logistics, sponsor relations, and event-day operations.',
    ],
  },
  {
    id: 'swb-experience',
    role: 'Data Engineer (Volunteer)',
    org: 'Statistics Without Borders · Project #279 (IPÊ, Institute for Ecological Research)',
    date: 'Feb 2024',
    bullets: [
      'Designed Azure data pipelines to organize large-scale biodiversity datasets for a team of statisticians and scientists.',
      'Audited cloud storage practices and designed a data-organization strategy to reduce query times and storage costs.',
    ],
  },
];
