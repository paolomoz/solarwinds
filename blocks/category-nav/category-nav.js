/**
 * category-nav — sticky in-page category navigation with scrollspy.
 * Schema: stardust/eds-schema/products.json § category-nav
 *
 * Authoring (simple shape): one row, one cell holding a <ul> of links whose
 * hrefs are #anchors (e.g. #monitoring-observability). decorate() assigns the
 * anchor ids to the following sibling sections that carry a category block
 * (product-list or trial-cards), in document order, so the links resolve and
 * the scrollspy can track them.
 *
 * Mirrors the live page: no tab is active at scroll 0; the section in view
 * gets a #6E8C96 underline. Hidden on mobile (live hides it ≤639px).
 */
export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const nav = document.createElement('nav');
  nav.className = 'category-nav-items';
  nav.setAttribute('aria-label', 'Product categories');
  links.forEach((a) => nav.append(a));
  block.replaceChildren(nav);

  // assign ids to the category sections that follow this nav's own section
  const ownSection = block.closest('.section');
  const sections = [];
  let el = ownSection?.nextElementSibling;
  while (el && sections.length < links.length) {
    if (el.matches('.product-list-container, .trial-cards-container')) sections.push(el);
    el = el.nextElementSibling;
  }
  links.forEach((a, i) => {
    const id = (a.getAttribute('href') || '').replace(/^#/, '');
    if (id && sections[i] && !document.getElementById(id)) sections[i].id = id;
  });

  const update = () => {
    let active = null;
    links.forEach((a) => {
      const sec = document.getElementById((a.getAttribute('href') || '').replace(/^#/, ''));
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      if (r.top <= 55 && r.bottom > 55) active = a;
    });
    links.forEach((a) => a.classList.toggle('active', a === active));
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}
