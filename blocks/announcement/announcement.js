/**
 * announcement — dismissible top notice bar.
 * Authoring: one row, two cells: message <p> | link <a>.
 */
export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const wrap = document.createElement('div');
  wrap.className = 'annwrap';
  const msg = cells[0]?.querySelector('p') || cells[0];
  if (msg) wrap.append(msg);
  const link = block.querySelector('a');
  if (link) wrap.append(link);
  const x = document.createElement('button');
  x.className = 'x';
  x.setAttribute('aria-label', 'Dismiss');
  x.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  x.addEventListener('click', () => { block.closest('.section').style.display = 'none'; });
  block.replaceChildren(wrap, x);
  block.classList.add('ready');
}
