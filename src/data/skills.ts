// Technical skills, limited to tools used in the resume, roles, or project repositories.
// Within each group, items are ordered by how much I have actually used them.

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
    items: ['ETL pipelines', 'Apache Spark (PySpark)', 'Delta Lake', 'Databricks', 'Apache Kafka', 'BeautifulSoup', 'Apache Airflow'],
  },
  {
    label: 'Cloud & infrastructure',
    items: ['Azure Container Apps', 'Azure Container Registry', 'Azure Blob Storage', 'Docker', 'GitHub Actions', 'Git'],
  },
  { label: 'Databases', items: ['Azure Cosmos DB (vector search)', 'SQLite', 'MySQL', 'IBM DB2'] },
  { label: 'Business systems', items: ['Power Apps', 'Power Automate', 'SharePoint', 'Excel', 'Power Query'] },
];
