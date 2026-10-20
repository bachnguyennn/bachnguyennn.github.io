import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical origin. GitHub Pages sets PUBLIC_SITE_URL in CI; every other build
// (local, Azure Static Web Apps, previews) must still emit the real canonical URLs,
// so the fallback is the production origin rather than a placeholder.
const site = process.env.PUBLIC_SITE_URL ?? 'https://bachnguyennn.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/';

// Root-relative links written in Markdown ("/research/") get the base path prepended,
// so case studies keep working if the site is ever served from a sub-path.
function rehypeBaseLinks() {
  const prefix = base.replace(/\/$/, '');
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (prefix && typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(`${prefix}/`)) {
        node.properties.href = `${prefix}${href}`;
      }
    }
    node.children?.forEach(visit);
  };
  return (tree) => visit(tree);
}

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    rehypePlugins: [rehypeBaseLinks],
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
});
