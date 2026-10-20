// Labels for project categories and statuses, shared by the content schema and the UI.

export const projectCategories = {
  ai: 'Applied AI & LLM systems',
  ml: 'Machine learning',
  cv: 'Computer vision',
  data: 'Data engineering',
  research: 'Research & experiments',
} as const;

export const projectStatuses = {
  deployed: 'Deployed',
  complete: 'Complete',
  research: 'Research',
  experimental: 'Experimental',
} as const;

export type ProjectCategory = keyof typeof projectCategories;
export type ProjectStatus = keyof typeof projectStatuses;
