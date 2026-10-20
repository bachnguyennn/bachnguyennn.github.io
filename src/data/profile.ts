// Contact details and positioning shared by the header, footer, homepage, resume and SEO tags.
// Source: public/Resume.pdf (Sep 2026) and the existing site.

export const profile = {
  name: 'Bach Nguyen',
  headline: 'Machine Learning, Applied AI & Software Engineering',
  shortBio:
    "Mathematics and Computer Science student at Ontario Tech University. I research continual learning for efficient vision transformers and build software that connects machine learning, data infrastructure, and the cloud.",
  location: 'Oshawa / Toronto, Ontario',
  graduation: 'April 2027',
  availability:
    'Open to new-graduate Machine Learning, Applied AI, and Software Engineering roles starting after April 2027.',
  email: 'vubach.nguyen@ontariotechu.net',
  // Only rendered on /resume/, matching the public PDF.
  phone: '(416) 806-2537',
  phoneHref: 'tel:+14168062537',
  github: 'https://github.com/bachnguyennn',
  githubHandle: 'bachnguyennn',
  linkedin: 'https://www.linkedin.com/in/bach-nguyen-vu',
  linkedinHandle: 'bach-nguyen-vu',
  site: 'https://bachnguyennn.github.io',
  resumePdf: '/Resume.pdf',
  // Date printed on the PDF's metadata; update when the PDF is regenerated.
  resumePdfUpdated: 'September 2026',
} as const;
