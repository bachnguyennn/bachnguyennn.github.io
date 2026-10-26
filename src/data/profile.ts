// Contact details and positioning shared by the header, footer, homepage, resume and SEO tags.
// Source: public/Resume.pdf (Oct 2026) and the existing site.

export const profile = {
  name: 'Bach Nguyen',
  headline: 'Machine Learning & Data Engineering',
  shortBio:
    "I build machine learning systems and the data pipelines behind them. I'm a Mathematics and Computer Science student at Ontario Tech University researching how small vision models can keep learning new tasks.",
  location: 'Oshawa / Toronto, Ontario',
  graduation: 'April 2027',
  availability:
    'Open to new-graduate machine learning engineering and data engineering roles starting after April 2027.',
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
  resumePdfUpdated: 'October 2026',
} as const;
