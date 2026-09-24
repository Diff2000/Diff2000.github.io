'use strict';

// Henter alle offentlige repoer med GitHub Pages og viser dem som lenker.
// Nye Pages-repoer dukker dermed opp automatisk.
const USER = 'Diff2000';
const CACHE_KEY = 'startside.repos';

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function pagesUrl(repo) {
  if (repo.homepage) return repo.homepage;
  return `https://${USER.toLowerCase()}.github.io/${repo.name}/`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('no', { day: 'numeric', month: 'short', year: 'numeric' });
}

function render(repos) {
  const list = $('apps');
  list.textContent = '';
  for (const repo of repos) {
    const li = el('li', 'app');
    const h2 = el('h2');
    const link = el('a', null, repo.name);
    link.href = pagesUrl(repo);
    h2.append(link);
    li.append(h2, el('p', null, repo.description || ''));

    const meta = el('div', 'meta');
    meta.append(el('span', null, `Oppdatert ${formatDate(repo.pushed_at)}`));
    const code = el('a', null, 'Kode');
    code.href = repo.html_url;
    meta.append(code);
    li.append(meta);
    list.append(li);
  }
  $('status').textContent = repos.length ? '' : 'Ingen sider ennå.';
}

async function load() {
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { /* ingen cache */ }
  if (cached) render(cached);

  try {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub svarte ${res.status}`);
    const repos = (await res.json())
      .filter((r) => r.has_pages && !r.fork && !r.archived && r.name.toLowerCase() !== `${USER.toLowerCase()}.github.io`)
      .map(({ name, description, homepage, html_url, pushed_at }) => ({ name, description, homepage, html_url, pushed_at }));
    render(repos);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(repos)); } catch { /* lagring er valgfritt */ }
  } catch (e) {
    // Uten cache vises feilen; med cache står forrige liste igjen.
    if (!cached) {
      $('status').textContent = `Kunne ikke hente listen: ${e.message}`;
      $('status').classList.add('error');
    }
  }
}

load();
