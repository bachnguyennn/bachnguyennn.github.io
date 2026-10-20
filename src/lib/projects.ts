import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './urls';

export type Project = CollectionEntry<'projects'>;

/** All projects: featured first, then by `order`, then newest. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      b.data.year - a.data.year,
  );
}

/** Where a project's title links: its case study, an internal page, or its repository. */
export function projectHref(p: Project): string {
  if (p.data.href) return withBase(p.data.href);
  if (p.data.caseStudy) return withBase(`/projects/${p.id}/`);
  return p.data.github ?? withBase('/projects/');
}

export function hasInternalPage(p: Project): boolean {
  return Boolean(p.data.href || p.data.caseStudy);
}

export const displayTitle = (p: Project) => p.data.shortTitle ?? p.data.title;
