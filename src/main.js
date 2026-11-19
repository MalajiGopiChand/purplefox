async function start() {
  await import('./app.js');
  if (document.querySelector('#admin-login')) {
    await import('./admin.js');
  } else {
    await import('./enquiries.js');
    if (document.querySelector('[data-published-photos]')) await import('./public-media.js');
  }
}
start().catch(error => {
  console.error('Purple Fox could not load:', error);
  const status = document.querySelector('#admin-status, #form-status');
  if (status) status.textContent = 'The page could not finish loading. Please refresh and try again.';
});
