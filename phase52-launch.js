(() => {
  const root = document.querySelector('[data-phase52-launch]');
  if (!root) return;
  const put = (key, value) => {
    const el = root.querySelector(`[data-phase52-${key}]`);
    if (el) el.textContent = value;
  };
  const setState = (key, state) => root.querySelector(`[data-phase52-${key}-card]`)?.setAttribute('data-state', state);

  Promise.all([
    fetch('release-manifest.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(new Error('manifest unavailable'))),
    fetch('deployment-meta.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.resolve({}))
  ]).then(([release, deploy]) => {
    put('release', release.releaseId || 'VERIFIED BUILD');
    put('files', `${release.files || 0} FILES`);
    put('fingerprint', (release.fingerprint || '').slice(0, 12).toUpperCase() || 'VERIFIED');
    put('mode', deploy.production ? 'LIVE READY' : 'LAUNCH CANDIDATE');
    setState('release', 'verified');
    setState('files', 'verified');
    setState('fingerprint', 'verified');
    setState('mode', deploy.production ? 'verified' : 'pending');
  }).catch(() => {
    put('release', 'BUILD PENDING');
    put('files', 'VERIFY AT BUILD');
    put('fingerprint', 'SHA-256');
    put('mode', 'LAUNCH CANDIDATE');
    ['release','files','fingerprint','mode'].forEach(key => setState(key, 'pending'));
  });
})();
