/**
 * resource-cards — resource/article cards on the #EEE zone. Variant `lead`:
 * the top row (big image card + white feature card + photo card).
 * Authoring: one row per card, up to 3 cells:
 *   1. <img> (optional — the feature card has none)
 *   2. eyebrow <p>
 *   3. title <p> with the card link <a> wrapping or trailing
 * Card link: first <a> found anywhere in the row.
 */
export default async function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'res-grid';
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const card = document.createElement('a');
    card.className = 'res-card';
    card.href = link ? link.href : '#';
    const media = row.querySelector('picture, img');
    if (media) {
      const img = media.tagName === 'IMG' ? media : media.querySelector('img');
      if (img) img.loading = 'lazy';
      card.append(media);
    } else {
      card.classList.add('res-feature');
    }
    const texts = [...row.querySelectorAll('p')].filter((p) => p.textContent.trim() && !p.querySelector('img, picture'));
    const eyebrow = texts.find((p) => p.textContent.trim().length < 20);
    const title = texts.find((p) => p !== eyebrow);
    if (eyebrow) { const e = document.createElement('p'); e.className = 'res-eyebrow'; e.textContent = eyebrow.textContent.trim(); card.append(e); }
    // a media card with no eyebrow is a poster card (title baked into the
    // artwork); its authored link text serves the href/aria only
    const poster = media && !eyebrow;
    if (poster) card.setAttribute('aria-label', title ? title.textContent.trim() : card.href);
    if (title && !poster) { const t = document.createElement('p'); t.className = 'res-title'; t.textContent = title.textContent.trim().replace(/\s*Read more.*$/i, ''); card.append(t); }
    grid.append(card);
  });
  block.replaceChildren(grid);
}
