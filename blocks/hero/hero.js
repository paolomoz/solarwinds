/**
 * hero — SolarWinds home hero: copy column left (h1 with <strong>, lede, CTA),
 * dashboard composite bleeding off the right edge, decorative rounded outline.
 * Template-slotted (#95): fixed composition; authored values fill role slots.
 * Authoring (single cell): <h1>, lede <p>, CTA <p><strong><a>, <img>.
 */
export default async function decorate(block) {
  const h1 = block.querySelector('h1');
  const pic = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')];
  const cta = ps.find((p) => p.querySelector('a'));
  const lede = block.querySelector('h2') || ps.find((p) => !p.querySelector('a') && !p.contains(pic) && p.textContent.trim());

  const media = document.createElement('div');
  media.className = 'hh-media';
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    // LCP: eager-load the hero image (#100 — the metadata-first section defeats
    // the runtime's waitForFirstImage)
    if (img) { img.loading = 'eager'; img.setAttribute('fetchpriority', 'high'); }
    media.append(pic);
  }
  const deco = document.createElement('div');
  deco.className = 'hh-deco';
  const copy = document.createElement('div');
  copy.className = 'hh-copy';
  if (h1) copy.append(h1);
  if (lede) { lede.className = 'hh-lede'; copy.append(lede); }
  if (cta) { cta.className = 'hh-cta'; copy.append(cta); }
  block.replaceChildren(media, deco, copy);
}
