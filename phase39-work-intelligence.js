(() => {
  const input = document.getElementById('workSearch');
  const items = [...document.querySelectorAll('.work-item')];
  const filters = [...document.querySelectorAll('.work-filter')];
  const count = document.getElementById('workCount');
  if (!input || !items.length) return;
  let active = 'all';

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(item => {
      const category = item.dataset.category || '';
      const haystack = item.textContent.toLowerCase();
      const matchCategory = active === 'all' || category === active;
      const matchSearch = !q || haystack.includes(q);
      const show = matchCategory && matchSearch;
      item.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = visible;
  };

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    active = button.dataset.filter || 'all';
    apply();
  }));

  input.addEventListener('input', apply);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); input.focus(); input.select();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = ''; input.blur(); apply();
    }
  });
  apply();
})();
