// The canonical professional record: rendered into static HTML on the homepage, /experience/
// and /resume/. Keep in sync with public/Resume.pdf.
//
// `id` is stable and matches the Cosmos DB document id served by the Ask Bach API
// (GET /content/experience). See src/lib/experience-merge.ts for how API records are reconciled
// with these entries: the static record always wins for known ids.
import { z } from 'zod';
import { compareRanges, formatRange } from '../lib/dates';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

const entrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(['research', 'teaching', 'industry', 'volunteer', 'leadership']),
  role: z.string().min(1),
  /** Course, project or team the role belongs to, shown after the role. */
  roleDetail: z.string().optional(),
  org: z.string().min(1),
  orgDetail: z.string().optional(),
  location: z.string(),
  start: yearMonth,
  end: z.union([yearMonth, z.literal('present')]),
  /** Overrides the computed date label, e.g. "Fall 2024". */
  dateLabel: z.string().optional(),
  summary: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  skills: z.array(z.string()).default([]),
});

export type ExperienceEntry = z.infer<typeof entrySchema> & { date: string };

const raw: z.input<typeof entrySchema>[] = [
  {
    id: 'vcl-research-experience',
    kind: 'research',
    role: 'Undergraduate Thesis Researcher',
    org: 'Visual Computing Lab, Ontario Tech University',
    orgDetail: 'Supervised by Dr. Faisal Qureshi',
    location: 'Oshawa, ON',
    start: '2026-09',
    end: 'present',
    summary: 'Studying how small vision models can keep learning without forgetting earlier tasks.',
    bullets: [
      'Study continual learning for parameter-efficient vision transformers built on the lab’s CascadedViT architecture.',
      'Implemented a 10M-parameter CascadedViT variant under CPG (Compacting, Picking, and Growing), a mask-based continual learning method.',
      'Collaborating with a CascadedViT co-author on the expert-routing mechanism in SEMA (Self-Expansion with Mixture of Adapters).',
    ],
    skills: ['PyTorch', 'Vision transformers', 'Continual learning'],
  },
  {
    id: 'math-ta-experience',
    kind: 'teaching',
    role: 'Teaching Assistant',
    roleDetail: 'Preparatory Math for Engineers (MATH-0900U)',
    org: 'Ontario Tech University',
    location: 'Oshawa, ON',
    start: '2026-09',
    end: 'present',
    summary: 'Weekly tutorials and grading for a first-year engineering mathematics course.',
    bullets: [
      'Lead weekly first-year engineering math tutorials for students with varied mathematical preparation.',
      'Invigilate exams and grade all tutorial work, midterms, and finals.',
    ],
    skills: ['Teaching', 'Technical communication'],
  },
  {
    id: 'cs-club-experience',
    kind: 'leadership',
    role: 'Events Coordinator',
    org: 'Ontario Tech Computer Science Club',
    location: 'Oshawa, ON',
    start: '2025-09',
    end: 'present',
    summary: 'Co-organize the club’s annual hackathon for 250+ participants.',
    bullets: [
      'Lead logistics, sponsor relations, and event-day operations for the club’s annual hackathon with 250+ participants.',
      'Organize events for 20–30 students to collaborate and meet peers.',
    ],
    skills: ['Event operations', 'Sponsor relations'],
  },
  {
    id: 'cmha-experience',
    kind: 'industry',
    role: 'IT Intern',
    org: 'Canadian Mental Health Association',
    location: 'Oshawa, ON',
    start: '2025-05',
    end: '2025-08',
    summary: 'Automated staff scheduling and supported IT systems used by 100+ staff.',
    bullets: [
      'Saved staff an estimated 5+ hours of manual scheduling per week with Power Apps and Power Automate booking workflows. Built and deployed the workflows, eliminating recurring double-booking errors.',
      'Tested workflow outputs and data accuracy before deployment.',
      'Managed employee data and files in SharePoint. Consolidated staff records in Excel with lookup formulas and pivot tables for manager reporting.',
      'Modernized legacy internal tools from non-technical staff requirements and documented the IT support handoff.',
      'Kept clinical software available for client services by maintaining servers and resolving tier-1/tier-2 IT issues for 100+ staff.',
    ],
    skills: ['Power Apps', 'Power Automate', 'SharePoint', 'Excel', 'Power Query'],
  },
  {
    id: 'orientation-leader-experience',
    kind: 'leadership',
    role: 'Orientation Leader & Peer Mentor',
    org: 'Ontario Tech University',
    location: 'Oshawa, ON',
    start: '2024-09',
    end: '2024-09',
    dateLabel: 'Fall 2024',
    summary: 'Mentored first-year students through orientation.',
    bullets: [
      'Mentored 20 first-year students and coordinated orientation event logistics.',
      'Led an orientation-week team that won 1st place in the Faculty of Science “Wild Goose Chase” challenge.',
    ],
    skills: ['Mentoring'],
  },
  {
    id: 'swb-experience',
    kind: 'volunteer',
    role: 'Data Engineering Volunteer',
    org: 'Statistics Without Borders',
    orgDetail: 'Project #279 for IPÊ, Institute for Ecological Research',
    location: 'Remote',
    start: '2024-02',
    end: '2024-02',
    summary: 'Short volunteer project for IPÊ: reviewed dataset storage and designed sample Azure pipelines.',
    bullets: [
      'Reviewed IPÊ’s environmental datasets in consumer file-sharing tools and documented querying and scaling problems.',
      'Designed sample Azure pipelines to organize large-scale biodiversity datasets for statisticians and scientists.',
      'Audited cloud storage and designed a data-organization strategy aimed at reducing query times and storage costs.',
    ],
    skills: ['Azure', 'Data modelling'],
  },
];

const parsed = z
  .array(entrySchema)
  .superRefine((entries, ctx) => {
    const seen = new Set<string>();
    for (const e of entries) {
      if (seen.has(e.id)) ctx.addIssue({ code: 'custom', message: `Duplicate experience id "${e.id}"` });
      seen.add(e.id);
    }
  })
  .parse(raw);

/** All entries, newest first. Parsing at import makes a malformed entry fail the build. */
export const experience: ExperienceEntry[] = parsed
  .map((e) => ({ ...e, date: e.dateLabel ?? formatRange(e.start, e.end) }))
  .sort(compareRanges);

export const workExperience = experience.filter((e) => e.kind !== 'leadership');
export const leadership = experience.filter((e) => e.kind === 'leadership');
