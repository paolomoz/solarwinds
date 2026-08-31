/**
 * logos — a row/grid of brand images. Variants: (default = grayscale partner
 * logos row with the section head absorbed inline), `awards` (badge grid).
 * Authoring: section head as default content before the block (reabsorbed on
 * decorate — zero pixel change); one row per image.
 */
export default async function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'logo-grid';
  // pipeline wraps images as <p><picture><img>; collect pictures when present
  // (never picture AND its inner img — that duplicates grid items)
  let media = [...block.querySelectorAll('picture')];
  if (!media.length) media = [...block.querySelectorAll('img')];
  media.forEach((m) => {
    const img = m.tagName === 'IMG' ? m : m.querySelector('img');
    if (img) img.loading = 'lazy';
    grid.append(m);
  });
  const kids = [];
  // reabsorb the section head (default content before this block) so the head
  // and logo row share one flex row — pixel-identical to the prototype
  if (!block.classList.contains('awards')) {
    const head = block.parentElement.previousElementSibling;
    if (head && head.classList.contains('default-content-wrapper')) {
      const h = document.createElement('div');
      h.className = 'logo-head';
      [...head.childNodes].forEach((n) => h.append(n));
      head.remove();
      kids.push(h);
    }
  }
  kids.push(grid);
  block.replaceChildren(...kids);
}
