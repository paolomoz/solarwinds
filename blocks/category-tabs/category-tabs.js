/**
 * category-tabs — the "Solve your biggest challenges" widget: tab row, the
 * donut category navigator (fixed brand SVGs from /media/donut, #67), and one
 * sliding panel per tab (media, body, explore CTA, capability links).
 * Authoring: one row per tab, 4 cells:
 *   1. tab label <p>
 *   2. body <p>
 *   3. explore CTA <p><strong><a>
 *   4. capabilities: <h3> + <ul> of links (optional)
 * Media per tab is block-owned (frozen video frame / Wistia posters — the live
 * media is an HLS stream; see stardust/eds-conversion-log.md).
 */
const TAB_IDS = ['mo', 'db', 'ir', 'itsm'];
const MEDIA = [
  '/media/home-tab-media-1440.png',
  'https://fast.wistia.com/embed/medias/v02o141sgs/swatch',
  'https://fast.wistia.com/embed/medias/jdpqf2s0o1/swatch',
  'https://fast.wistia.com/embed/medias/v02o141sgs/swatch',
];
const DONUT_POS = { mo: [0, 0], db: [244, 27], ir: [-1, 214], itsm: [214, 187] };

export default async function decorate(block) {
  const rows = [...block.children];
  const tabsBar = document.createElement('div');
  tabsBar.className = 'tabs';
  tabsBar.setAttribute('role', 'tablist');
  const zone = document.createElement('div');
  zone.className = 'panel-zone';
  const inner = document.createElement('div');
  inner.className = 'panel-inner';
  const donut = document.createElement('div');
  donut.className = 'donut';
  TAB_IDS.forEach((id) => {
    const piece = document.createElement('div');
    piece.className = `donut-piece${id === 'mo' ? ' on' : ''}`;
    piece.dataset.donut = id;
    const [x, y] = DONUT_POS[id];
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.innerHTML = `<img class="d-off" src="/media/donut/${id}-off.svg" alt=""><img class="d-on" src="/media/donut/${id}-on.svg" alt="">`;
    donut.append(piece);
  });
  const panels = document.createElement('div');
  panels.className = 'tab-panels';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const id = TAB_IDS[i] || `t${i}`;
    const label = cells[0]?.textContent.trim() || `Tab ${i + 1}`;
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.dataset.tab = id;
    btn.textContent = label;
    if (i === 0) btn.classList.add('active');
    tabsBar.append(btn);

    const panel = document.createElement('div');
    panel.className = `tab-panel${i === 0 ? ' active' : ''}`;
    panel.dataset.panel = id;
    const media = document.createElement('div');
    media.className = 'tp-media';
    media.innerHTML = `<img src="${MEDIA[i] || MEDIA[1]}" alt="" loading="lazy">`;
    panel.append(media);
    const body = cells[1]?.querySelector('p') || cells[1];
    if (body) { body.className = 'tp-body'; panel.append(body); }
    const ctaP = cells[2]?.querySelector('p') || cells[2];
    if (ctaP && ctaP.querySelector('a')) { ctaP.className = 'tp-cta'; panel.append(ctaP); }
    if (cells[3] && cells[3].textContent.trim()) {
      const caps = document.createElement('div');
      caps.className = 'tp-caps';
      [...cells[3].childNodes].forEach((n) => caps.append(n));
      caps.querySelectorAll('li a').forEach((a) => {
        a.innerHTML = `${a.textContent.trim()} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="18" height="20"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.86 4.37a1.203 1.203 0 0 1 1.735 0l6.545 6.737a1.29 1.29 0 0 1 0 1.786L9.595 19.63a1.203 1.203 0 0 1-1.736 0 1.29 1.29 0 0 1 0-1.786L13.537 12 7.86 6.156a1.29 1.29 0 0 1 0-1.786z" fill="currentColor"/></svg>`;
      });
      panel.append(caps);
    }
    panels.append(panel);
  });

  inner.append(donut, panels);
  zone.append(inner);
  block.replaceChildren(tabsBar, zone);

  const activate = (id) => {
    tabsBar.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.tab === id));
    panels.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
    donut.querySelectorAll('.donut-piece').forEach((d) => d.classList.toggle('on', d.dataset.donut === id));
  };
  tabsBar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) activate(b.dataset.tab); });
  donut.addEventListener('click', (e) => { const d = e.target.closest('.donut-piece'); if (d) activate(d.dataset.donut); });
}
