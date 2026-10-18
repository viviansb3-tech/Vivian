(() => {
  const root = document.querySelector('[data-phase51-deployment]');
  if (!root) return;
  const set = (key, value) => {
    const el = root.querySelector(`[data-phase51-${key}]`);
    if (el) el.textContent = value;
  };
  fetch('deployment-meta.json', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('metadata unavailable')))
    .then(meta => {
      const state = meta.canonicalStatus === 'resolved' ? 'resolved' : 'pending';
      root.querySelector('[data-phase51-canonical-card]')?.setAttribute('data-state', state);
      set('provider', String(meta.provider || 'static').toUpperCase());
      set('environment', String(meta.environment || 'production').toUpperCase());
      set('canonical', meta.canonicalBaseUrl ? new URL(meta.canonicalBaseUrl).host : 'ASSIGNED AT DEPLOY');
      set('indexing', String(meta.indexing || 'controlled').toUpperCase());
    })
    .catch(() => {
      set('provider', 'STATIC');
      set('environment', 'LOCAL / PREVIEW');
      set('canonical', 'ASSIGNED AT DEPLOY');
      set('indexing', 'CONTROLLED');
    });
})();
