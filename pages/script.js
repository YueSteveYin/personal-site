// Fetch and load the component on page load or navigation
function loadPage(page) {
    const main = document.querySelector('main');
    const url = `components/${page}.html`;  // Path to the component
  
    // Fade out for smooth transition
    main.classList.remove('loaded');
  
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
      .then(html => {
        main.innerHTML = html;
        setTimeout(() => main.classList.add('loaded'), 50);
        window.history.pushState(null, '', `?page=${page}`);  // Update URL without reload
      })
      .catch(() => {
        main.innerHTML = "<h2>404 - Page Not Found</h2>";
      });
  }
  
  // Load the initial component based on the query string
  window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'about';  // Default to 'about'
    loadPage(page);
  };
  