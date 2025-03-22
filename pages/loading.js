window.addEventListener('load', () => {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    setTimeout(() => overlay.remove(), 300); // cleanup
  }
});
