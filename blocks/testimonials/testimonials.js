/**
 * testimonials — customer-quote carousel on a photo ground.
 * Authoring: one row per slide, 4 cells:
 *   1. quote <p>  2. link <p><a>  3. attribution: name <p> + role/company <p>s
 *   4. customer logo <img>
 * The white card, disc, nav (arrows + bar dots) and the decorative white line
 * are block-owned; only slide 1 is visible at rest (mirrors live).
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const slides = document.createElement('div');
  slides.className = 't-slides';
  // decorative connector line + travelling dot (geometry lifted verbatim from
  // the live page's inline SVG; the dot animates along the reversed path)
  const line = document.createElement('div');
  line.className = 't-line';
  line.setAttribute('aria-hidden', 'true');
  line.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 624 307" shape-rendering="geometricPrecision">'
    + '<path d="M-63.629297 296.548189h615.733522c33.441616 0 60.536649-23.57379 60.536649-61.155567V-32.29177" fill="none" stroke="#d8e3e3" stroke-width="8"/>'
    + '<circle class="t-line-dot" transform="scale(1.25)" fill="#444" stroke="#fff" stroke-width="4" stroke-miterlimit="3" r="6.08944"/>'
    + '</svg>';
  slides.append(line);

  const arrow = (dir) => `<button class="t-arrow t-${dir}" aria-label="${dir === 'prev' ? 'Previous' : 'Next'}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}" stroke="currentColor" stroke-width="2.5" fill="none"/></svg></button>`;

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    slide.className = `t-slide${i === 0 ? ' active' : ''}`;
    const card = document.createElement('div');
    card.className = 't-card';
    card.innerHTML = '<span class="t-mark">“</span>';
    const quote = cells[0]?.querySelector('p') || cells[0];
    if (quote) { quote.className = 't-quote'; card.append(quote); }
    const link = cells[1]?.querySelector('a');
    if (link) {
      const p = document.createElement('p');
      p.className = 't-link';
      link.innerHTML = `${link.textContent.trim()} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="20"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.86 4.37a1.203 1.203 0 0 1 1.735 0l6.545 6.737a1.29 1.29 0 0 1 0 1.786L9.595 19.63a1.203 1.203 0 0 1-1.736 0 1.29 1.29 0 0 1 0-1.786L13.537 12 7.86 6.156a1.29 1.29 0 0 1 0-1.786z" fill="currentColor"/></svg>`;
      p.append(link);
      card.append(p);
    }
    const attr = [...(cells[2]?.querySelectorAll('p') || [])];
    attr.forEach((p, j) => { p.className = j === 0 ? 't-name' : 't-role'; card.append(p); });
    const nav = document.createElement('div');
    nav.className = 't-nav';
    nav.innerHTML = `${arrow('prev')}<span class="t-dots">${rows.map((_, j) => `<button class="t-dot${j === i ? ' active' : ''}" data-slide="${j}" aria-label="Slide ${j + 1}"></button>`).join('')}</span>${arrow('next')}`;
    card.append(nav);
    slide.append(card);
    const disc = document.createElement('div');
    disc.className = 't-disc';
    const logo = cells[3]?.querySelector('picture, img');
    if (logo) disc.append(logo);
    slide.append(disc);
    slides.append(slide);
  });
  block.replaceChildren(slides);

  let cur = 0;
  const all = [...slides.querySelectorAll('.t-slide')];
  const go = (i) => {
    cur = (i + all.length) % all.length;
    all.forEach((s, j) => s.classList.toggle('active', j === cur));
    slides.querySelectorAll('.t-dot').forEach((d) => d.classList.toggle('active', +d.dataset.slide === cur));
  };
  slides.addEventListener('click', (e) => {
    const dot = e.target.closest('.t-dot');
    if (dot) { go(+dot.dataset.slide); return; }
    if (e.target.closest('.t-prev')) go(cur - 1);
    else if (e.target.closest('.t-next')) go(cur + 1);
  });
}
