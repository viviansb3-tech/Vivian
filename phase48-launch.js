(() => {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel',[...rel].join(' '));
  });
  document.querySelectorAll('footer span').forEach(el => {
    if (/^©\s*\d{4}\s+Vivian Sibanda$/.test(el.textContent.trim())) el.textContent = `© ${new Date().getFullYear()} Vivian Sibanda`;
  });
})();