/**
 * product-list — the light listing's product rows (icon | title+pricing+CTAs | value prop).
 * Schema: stardust/eds-schema/products.json § product-list
 *
 * Authoring rows — one row per product, 4 cells:
 *   1. product icon <img> (root-relative /icons/products/<slug>.svg — upload to
 *      DA media and rewrite before delivery, see stardust/eds-conversion-log.md)
 *   2. <h3> title (linked) + optional price <p> / price-note <p> / "Get a Quote" <a>
 *   3. CTAs: <p><strong><a>primary</a></strong></p> <p><a>Quick View</a></p> + trial note <p>
 *   4. value prop: lede <p><strong>…</strong></p> + <ul> bullets
 *
 * Decode is defensive (#48/#62): fields are classified by content (heading,
 * price prefix, link text), never by index inside a cell.
 */

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


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
  // ENCODE bans raw <sup> in content; re-create superscript ®/™ in the block
  el.innerHTML = el.innerHTML.replace(/([®™])/g, '<sup>$1</sup>');
}

export default async function decorate(block) {
  const rows = [...block.children];
  const out = document.createElement('div');
  out.className = 'product-rows';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const art = document.createElement('article');
    art.className = 'prod-row';

    // icon — fixed brand iconography from the code origin (#67), keyed by the
    // product title (never authored: root-relative imgs in content deliver as
    // about:error; see stardust/eds-conversion-log.md)
    const iconCol = document.createElement('div');
    iconCol.className = 'prod-icon-col';
    const titleForIcon = row.querySelector('h3, h2, h4')?.textContent.trim();
    if (titleForIcon) {
      const img = document.createElement('img');
      img.src = `/icons/products/${slugify(titleForIcon)}.svg`;
      img.alt = '';
      img.width = 88;
      img.height = 88;
      img.loading = 'lazy';
      iconCol.append(img);
    }
    art.append(iconCol);

    // left column: title + pricing + CTAs
    const left = document.createElement('div');
    left.className = 'prod-left';
    const titleCell = cells.find((c) => c.querySelector('h3, h2, h4'));
    const heading = titleCell?.querySelector('h3, h2, h4');
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      left.append(h3);
    }
    // pricing paragraphs (in the title cell, classified by content)
    [...(titleCell?.querySelectorAll('p, a') || [])].forEach((el) => {
      const t = el.textContent.trim();
      if (el.closest('h2, h3, h4')) return;
      if (/^Starts at /.test(t)) {
        const p = document.createElement('p');
        p.className = /Orion module/.test(titleCell.textContent) ? 'price price-tall' : 'price';
        p.textContent = t;
        left.append(p);
      } else if (el.tagName === 'P' && t && !el.querySelector('a')) {
        const p = document.createElement('p');
        p.className = 'price-sub';
        p.textContent = t;
        left.append(p);
      } else if (el.tagName === 'A' && /^Get a Quote/.test(t)) {
        const p = document.createElement('p');
        p.className = 'quote-link';
        const a = el.cloneNode(true);
        a.innerHTML = 'Get a Quote <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="21" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.86 4.37a1.203 1.203 0 0 1 1.735 0l6.545 6.737a1.29 1.29 0 0 1 0 1.786L9.595 19.63a1.203 1.203 0 0 1-1.736 0 1.29 1.29 0 0 1 0-1.786L13.537 12 7.86 6.156a1.29 1.29 0 0 1 0-1.786z" fill="currentColor"/></svg>';
        p.append(a);
        left.append(p);
      }
    });
    // CTA cell: clone decorated buttons + trial note (never manufacture anchors;
    // emphasis-wrapped fallback for un-decorated harness shapes)
    const ctaCell = cells.find((c) => c.querySelector('a.button, strong > a, em > a'));
    if (ctaCell) {
      const group = document.createElement('div');
      group.className = 'cta-group';
      const col = document.createElement('div');
      col.className = 'cta-col';
      const primary = findCta(ctaCell, 'primary');
      if (primary) col.append(primary);
      const note = [...ctaCell.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim());
      if (note) {
        note.className = 'trial-note';
        col.append(note);
      }
      group.append(col);
      const quick = findCta(ctaCell, 'secondary');
      if (quick) group.append(quick);
      left.append(group);
    }
    art.append(left);

    // right column: lede + bullets
    const right = document.createElement('div');
    right.className = 'prod-right';
    const propCell = cells.find((c) => c.querySelector('ul'));
    if (propCell) {
      const lede = [...propCell.querySelectorAll('p')].find((p) => p.textContent.trim());
      if (lede) {
        lede.className = 'lede-bold';
        supWrap(lede);
        right.append(lede);
      }
      const ul = propCell.querySelector('ul');
      if (ul) {
        supWrap(ul);
        right.append(ul);
      }
    }
    art.append(right);
    out.append(art);
  });

  block.replaceChildren(out);
}
