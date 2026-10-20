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
    summary: 'Continual learning for CascadedViT, the lab’s efficient vision transformer.',
    bullets: [
      'Exploring continual learning methods for parameter-efficient vision transformers, building on the lab’s CascadedViT architecture.',
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
      'Lead weekly tutorials for a first-year engineering mathematics course, explaining concepts to students with a wide range of mathematical preparation.',
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
    summary: 'Co-organize the club’s annual 250+ participant hackathon.',
    bullets: [
      'Co-organize the club’s annual hackathon with 250+ participants, leading logistics, sponsor relations, and event-day operations.',
      'Organize smaller student events of 20–30 participants focused on collaboration and peer networking.',
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
      'Built and deployed automated booking workflows with Power Apps and Power Automate, eliminating recurring double-booking errors and saving staff an estimated 5+ hours of manual scheduling per week.',
      'Validated workflow outputs and data accuracy through structured testing before deployment.',
      'Managed employee data and company files in SharePoint, and consolidated staff records into Excel workbooks with lookup formulas and pivot tables for manager reporting.',
      'Modernized legacy internal tools, gathering requirements from non-technical staff and documenting the handoff for ongoing IT support.',
      'Maintained servers and resolved tier-1/tier-2 IT issues for 100+ staff, keeping clinical software available for client services.',
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
      'Mentored 20 first-year students through their academic transition and coordinated logistics for orientation events.',
      'Led an orientation-week team that won 1st place in the Faculty of Science “Wild Goose Chase” challenge.',
    ],
    skills: ['Mentoring'],
  },
  {
    id: 'swb-experience',
    kind: 'volunteer',
    role: 'Data Engineer (Volunteer)',
    org: 'Statistics Without Borders',
    orgDetail: 'Project #279 for IPÊ, Institute for Ecological Research',
    location: 'Remote',
    start: '2024-02',
    end: '2024-02',
    summary: 'Designed Azure data pipelines for a biodiversity research organization.',
    bullets: [
      'Reviewed how IPÊ stored large environmental datasets across consumer file-sharing tools and documented the problems this caused for querying and scaling.',
      'Designed sample Azure data pipelines to organize large-scale biodiversity datasets for a cross-disciplinary team of statisticians and scientists.',
      'Audited cloud storage practices and designed a data-organization strategy to reduce query times and storage costs.',
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
