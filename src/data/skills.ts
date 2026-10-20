// Technical skills, limited to tools used in the resume, roles, or project repositories.
// Within each group, items are ordered by how much I have actually used them.
// No self-rated percentages: the `expertise` list below ties each area to the work that shows it.

export const skillGroups: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['Python', 'SQL', 'Java', 'C++', 'Bash'] },
  {
    label: 'Machine learning & scientific computing',
    items: ['PyTorch', 'scikit-learn', 'XGBoost', 'LightGBM', 'pandas', 'NumPy', 'SciPy', 'SHAP', 'Optuna', 'Matplotlib', 'Jupyter'],
  },
  {
    label: 'Applied AI & backend',
    items: ['Retrieval-augmented generation', 'Hybrid retrieval (BM25 + dense, RRF)', 'Sentence Transformers', 'FastAPI', 'REST APIs', 'Structured LLM output', 'Streamlit'],
  },
  {
    label: 'Data engineering',
    items: ['ETL pipelines', 'Apache Spark (PySpark)', 'Delta Lake', 'Apache Kafka', 'BeautifulSoup', 'Apache Airflow'],
  },
  {
    label: 'Cloud & infrastructure',
    items: ['Azure Container Apps', 'Azure Container Registry', 'Azure Blob Storage', 'Docker', 'GitHub Actions', 'Git'],
  },
  { label: 'Databases', items: ['Azure Cosmos DB (vector search)', 'SQLite', 'MySQL', 'IBM DB2'] },
  { label: 'Business systems', items: ['Power Apps', 'Power Automate', 'SharePoint', 'Excel', 'Power Query'] },
];

export interface ExpertiseArea {
  title: string;
  body: string;
  tools: string[];
  evidence: { label: string; href: string }[];
}

export const expertise: ExpertiseArea[] = [
  {
    title: 'Machine learning & deep learning',
    body: 'Training and evaluating models with the metric the problem needs: recall for screening, AUPRC for rare events, walk-forward splits for time series, bootstrap intervals before claiming an effect.',
    tools: ['PyTorch', 'scikit-learn', 'XGBoost', 'LightGBM', 'SHAP'],
    evidence: [
      { label: 'Thesis research', href: '/research/' },
      { label: 'Chest X-ray', href: '/projects/chest-xray-pneumonia/' },
      { label: 'Load forecasting', href: '/projects/energy-demand-forecasting/' },
    ],
  },
  {
    title: 'Applied AI & retrieval',
    body: 'LLM applications where retrieval is measured on its own, the model returns structured output, and citations are resolved by code rather than generated.',
    tools: ['RAG', 'BM25', 'Embeddings', 'RRF', 'FastAPI'],
    evidence: [{ label: 'Ask Bach', href: '/projects/ask-bach/' }],
  },
  {
    title: 'Data engineering',
    body: 'Pipelines that are safe to replay: idempotent writes, Decimal arithmetic for money, gap-aware windows, and snapshots that fail closed.',
    tools: ['Spark', 'Delta Lake', 'Kafka', 'ETL', 'SQL'],
    evidence: [
      { label: 'MarketGuard', href: '/projects/market-guard/' },
      { label: 'Statistics Without Borders', href: '/experience/#swb-experience' },
    ],
  },
  {
    title: 'Cloud & delivery',
    body: 'Containerized services on Azure with managed secrets, managed identity for database access, and GitHub Actions deployments that sign in through OIDC.',
    tools: ['Azure', 'Docker', 'GitHub Actions', 'Cosmos DB'],
    evidence: [
      { label: 'Ask Bach', href: '/projects/ask-bach/' },
      { label: 'MarketGuard', href: '/projects/market-guard/' },
    ],
  },
];
