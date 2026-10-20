// Thesis facts shared by /research/, the homepage and /resume/.
// Only work stated on the public resume is listed as done. Results stay off the site until
// they are cleared for publication.

export const thesis = {
  title: 'Continual Learning for Efficient Vision Transformers',
  shortTitle: 'Continual learning for CascadedViT',
  lab: 'Visual Computing Lab, Ontario Tech University',
  supervisor: 'Dr. Faisal Qureshi',
  start: 'Sep 2026',
  status: 'In progress',
  question:
    'How can a compact, efficient vision transformer like CascadedViT learn a sequence of tasks without forgetting earlier ones, while staying small and cheap to run?',
  summary:
    "My undergraduate thesis studies how CascadedViT, a lightweight vision transformer from our lab, can keep learning new tasks without catastrophically forgetting old ones, and what that costs in parameters, compute, and stored data.",
};

export type MilestoneStatus = 'done' | 'in-progress' | 'planned';

export const milestones: { status: MilestoneStatus; title: string; body: string }[] = [
  {
    status: 'done',
    title: 'CascadedViT under CPG',
    body: 'Implemented a 10M-parameter CascadedViT variant under CPG (Compacting, Picking, and Growing), adapting a method designed for convolutional networks to a hybrid vision transformer.',
  },
  {
    status: 'in-progress',
    title: 'Expert routing in SEMA',
    body: 'Working with a CascadedViT co-author on the expert-routing mechanism of SEMA, an adapter-based method that adds capacity only when the data distribution shifts.',
  },
  {
    status: 'planned',
    title: 'Results and write-up',
    body: 'Results are not public yet. I will add them here once they are ready to share.',
  },
];

export const references = [
  {
    authors: 'S. Sivakumar, F. Z. Qureshi',
    title: 'CascadedViT: Cascaded Chunk-FeedForward and Cascaded Group Attention Vision Transformer',
    venue: 'arXiv:2511.14111',
    url: 'https://arxiv.org/abs/2511.14111',
  },
  {
    authors: 'S. C. Y. Hung, C.-H. Tu, C.-E. Wu, C.-H. Chen, Y.-M. Chan, C.-S. Chen',
    title: 'Compacting, Picking and Growing for Unforgetting Continual Learning',
    venue: 'NeurIPS 2019 · arXiv:1910.06562',
    url: 'https://arxiv.org/abs/1910.06562',
  },
  {
    authors: 'H. Wang, H. Lu, L. Yao, D. Gong',
    title: 'Self-Expansion of Pre-trained Models with Mixture of Adapters for Continual Learning',
    venue: 'arXiv:2403.18886',
    url: 'https://arxiv.org/abs/2403.18886',
  },
];
