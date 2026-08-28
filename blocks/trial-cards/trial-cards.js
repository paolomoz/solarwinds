/**
 * trial-cards — the "Free Trials" listing's 3-up card grid. Variant: `dark`
 * (authored as "trial-cards (dark)") for the IT Service Management and Tools
 * zones, matching the live page's alternating white/#222 category zones.
 * Schema: stardust/eds-schema/products.json § trial-cards
 *
 * Authoring rows — one row per card, up to 4 cells:
 *   1. <h3> card title (linked)
 *   2. optional module note <p> ("NPM, an Orion module, …")
 *   3. <ul> bullets
 *   4. CTAs: <p><em><a>Quick View</a></em></p> <p><strong><a>primary</a></strong></p>
 *      + trial note <p>
 */


function findCta(cell, kind) {
  // decorated shape first (decorateButtons ran), authored emphasis as fallback
  const cls = cell.querySelector(`a.button.${kind}`);
  if (cls) return cls.closest('p.button-wrapper') || cls;
  const tag = kind === 'primary' ? 'strong' : 'em';
  const raw = cell.querySelector(`${tag} > a`);
  if (raw) {
    raw.classList.add('button', kind);
    const p = raw.closest('p');
    if (p) p.classList.add('button-wrapper');
    const wrap = raw.closest(tag);
    wrap.replaceWith(raw);
    return (p && p.contains(raw)) ? p : raw;
  }
  return null;
}

function supWrap(el) {
  el.innerHTML = el.innerHTML.replace(/([®™])/g, '<sup>$1</sup>');
}

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const card = document.createElement('article');
    card.className = 'trial-card';

    const headingCell = cells.find((c) => c.querySelector('h3, h2, h4'));
    const heading = headingCell?.querySelector('h3, h2, h4');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.className = 'card-title';
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      card.append(h3);
    }

    const noteCell = cells.find((c) => !c.querySelector('h3, h2, h4, ul, a.button') && c.textContent.trim() && /Orion module|SolarWinds Platform/.test(c.textContent));
    if (noteCell) {
      const p = document.createElement('p');
      p.className = 'card-module-note';
      p.textContent = noteCell.textContent.trim();
      card.append(p);
    }

    const ulCell = cells.find((c) => c.querySelector('ul'));
    const ul = ulCell?.querySelector('ul');
    if (ul) {
      supWrap(ul);
      card.append(ul);
    }

    const ctaCell = cells.find((c) => c.querySelector('a.button, strong > a, em > a'));
    if (ctaCell) {
      const ctas = document.createElement('div');
      ctas.className = 'card-ctas';
      const quick = findCta(ctaCell, 'secondary');
      if (quick) ctas.append(quick);
      const primary = findCta(ctaCell, 'primary');
      if (primary) ctas.append(primary);
      const note = [...ctaCell.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
      if (note) {
        note.className = 'trial-note';
        ctas.append(note);
      }
      card.append(ctas);
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
