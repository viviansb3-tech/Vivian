(() => {
  const root = document.getElementById('research-intelligence');
  if (!root) return;
  const nodes = [...root.querySelectorAll('.phase40-node')];
  const filters = [...root.querySelectorAll('.phase40-filter')];
  const detail = root.querySelector('#phase40Detail');
  const title = root.querySelector('#phase40DetailTitle');
  const copy = root.querySelector('#phase40DetailCopy');
  const meta = root.querySelector('#phase40DetailMeta');
  const tags = root.querySelector('#phase40DetailTags');
  const count = root.querySelector('#phase40Count');
  let active = 'all';

  const render = (node) => {
    if (!node || !title) return;
    title.textContent = node.dataset.title || 'Research project';
    copy.textContent = node.dataset.copy || '';
    meta.textContent = node.dataset.meta || '';
    tags.innerHTML = (node.dataset.tags || '').split('|').filter(Boolean).map(t => `<span>${t}</span>`).join('');
    nodes.forEach(n => n.classList.toggle('is-selected', n === node));
    detail?.scrollIntoView({behavior:'smooth', block:'nearest'});
  };
  const apply = () => {
    let visible = 0;
    nodes.forEach(node => {
      const categories = (node.dataset.category || '').split(' ');
      const show = active === 'all' || categories.includes(active);
      node.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = visible;
    const selected = nodes.find(n => !n.hidden && n.classList.contains('is-selected')) || nodes.find(n => !n.hidden);
    if (selected) render(selected);
  };
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    active = btn.dataset.filter || 'all';
    apply();
  }));
  nodes.forEach(node => node.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    render(node);
  }));
  const timeline = [...root.querySelectorAll('.phase40-timeline-item')];
  timeline.forEach(item => item.addEventListener('click', () => {
    const target = nodes.find(n => n.dataset.key === item.dataset.key);
    if (target) render(target);
  }));
  apply();
})();
