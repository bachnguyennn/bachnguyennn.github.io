---
title: "Global GDP ETL Pipeline"
summary: "A Python ETL job that scrapes IMF GDP figures from an archived Wikipedia table, normalizes them, and loads them into SQLite with a timestamped log of each stage."
problem: "Turn an inconsistently formatted web table into a clean, queryable table with a traceable load process."
categories: [data]
status: complete
role: "Sole developer"
period: "2025"
year: 2025
order: 11
stack: ["Python", "BeautifulSoup", "requests", "pandas", "SQLite"]
github: "https://github.com/bachnguyennn/ETL-Process---IMF-GDP"
caseStudy: false
resume:
  - "Built an end-to-end ETL pipeline to scrape, clean, and normalize international GDP data (millions to billions of USD) into a structured SQLite database."
  - "Loaded the cleaned table into SQLite and CSV, queried it with SQL, and logged each extract, transform and load stage with timestamps."
---
