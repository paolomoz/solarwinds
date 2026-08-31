/**
 * ai-cards — the dark "Navigating IT's Future" trio.
 * Authoring: one row per card, 3 cells: <h3> title | body <p> | CTA <p><em><a>.
 */
export default async function decorate(block) {
  const cols = document.createElement('div');
  cols.className = 'ai-cols';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'ai-card';
    const h = cells[0]?.querySelector('h3, h2, h4');
    if (h) {
      const h3 = document.createElement('h3');
      [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      card.append(h3);
    }
    const body = cells[1]?.querySelector('p') || cells[1];
    if (body) card.append(body);
    const cta = cells[2]?.querySelector('p.button-wrapper, p') || cells[2];
    if (cta && cta.querySelector('a')) { cta.classList.add('ai-cta'); card.append(cta); }
    cols.append(card);
  });
  block.replaceChildren(cols);
}
