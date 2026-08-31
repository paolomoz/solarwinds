/**
 * stats — orange numerals band. Authoring: one row per stat, 2 cells:
 * number | label.
 */
export default async function decorate(block) {
  const wrap = document.createElement('div');
  wrap.className = 'stat-row';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const stat = document.createElement('div');
    stat.className = 'stat';
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = cells[0]?.textContent.trim() || '';
    const l = document.createElement('span');
    l.className = 'l';
    l.textContent = cells[1]?.textContent.trim() || '';
    stat.append(n, l);
    wrap.append(stat);
  });
  block.replaceChildren(wrap);
}
