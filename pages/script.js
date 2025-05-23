function loadPage(page) {
  const main = document.querySelector('main');
  const url = `components/${page}.html`;
  const title = document.getElementById('title');
  const body = document.querySelector('body');
  main.className = '';
  main.classList.remove('loaded');

  const botbutton = document.querySelector('#ai-assistant');
  const chat = document.querySelector('#chat-box');
  const sendButton = document.querySelector('#chat-send');
  const chatMessages = document.querySelector('#chat-messages');
  const input = document.querySelector('#chat-input');
  botbutton.addEventListener('click', () => {
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendButton.click();
  });
  sendButton.addEventListener('click', () => {
    const message = input.value;
    if (message) {
      const messageBox = document.createElement('div');
      messageBox.classList.add('message');
      messageBox.classList.add('user');
      messageBox.innerHTML = `<p>${message}</p>`;
      chatMessages.appendChild(messageBox);
      input.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      response = responseChat(message);
    }
  });

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then((html) => {
      main.innerHTML = html;
      main.classList.add('loaded', page);
      window.history.pushState(null, '', `?page=${page}`);
      title.innerHTML = page.charAt(0).toUpperCase() + page.slice(1);
      // Load experiences after loading the experience page
      if (page === 'experience') {
        loadExperiences();
        title.style.color = 'white';
        body.classList.value = '';
        body.classList.add('experience');
      } else if (page === 'timeline') {
        loadTimeline();
        title.style.color = 'white';
        body.classList.value = '';
        body.classList.add('timeline');
      } else if (page === 'about') {
        loadAbout();
        title.style.color = 'white';
        body.classList.value = '';
        body.classList.add('about');
      } else if (page === 'projects') {
        loadProjects();
        title.style.color = 'black';
        body.classList.value = '';
        body.classList.add('projects');
      }
    })
    .catch(() => {
      main.innerHTML = '<h2>404 - Page Not Found</h2>';
    });
}

function responseChat(message) {
  const chatMessages = document.querySelector('#chat-messages');
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('loading');
  loadingMessage.innerHTML = `<p>Please wait...</p>`;
  chatMessages.appendChild(loadingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  fetch('https://personal-site-backend-mixt.onrender.com/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      chatMessages.removeChild(loadingMessage);
      const messageBox = document.createElement('div');
      messageBox.classList.add('message', 'assistant');
      messageBox.innerHTML = `<p>${data.reply}</p>`;
      chatMessages.appendChild(messageBox);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch((err) => {
      console.error('Fetch error:', err);
    });
}

let fireworksSpawned = false;

function showTab(tabId) {
  // Show tab content
  document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  // Reveal clicked tab button
  const allButtons = document.querySelectorAll('.tab-buttons button');
  allButtons.forEach((btn) => {
    const id = btn.getAttribute('onclick')?.match(/'(.+)'/)[1];
    if (id === tabId) btn.classList.add('revealed');
  });
}

function toggleGames() {
  const gameList = document.getElementById('game-list');
  gameList.classList.toggle('collapsed');
  gameList.classList.toggle('expanded');
}
function loadAbout() {
  const firstBtn = document.querySelector('.tab-buttons button');
  if (firstBtn) firstBtn.classList.add('revealed');
}

// Load initial page on startup
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'about';
  loadPage(page);
};

function resetScrollbar() {
  const slideshowContainer = document.querySelector('.slideshow-container');
  if (slideshowContainer) {
    slideshowContainer.scrollTop = 0; // Reset vertical scrollbar
  }
}
let slideIndex = 0;
async function loadExperiences() {
  const slidesTrack = document.getElementById('slidesTrack');
  const dotsContainer = document.getElementById('dotsContainer');

  if (!slidesTrack || !dotsContainer) {
    console.error('Slideshow or dots container not found.');
    return;
  }

  slidesTrack.innerHTML = '';
  dotsContainer.innerHTML = '';

  const contentDir = './components/experience_contents/';
  const experiences = [
    'experience1.md',
    'experience2.md',
    'experience3.md',
    'experience4.md',
    'experience5.md',
    // Add more Markdown files here
  ];

  for (let i = 0; i < experiences.length; i++) {
    const response = await fetch(contentDir + experiences[i]);

    if (response.ok) {
      const markdown = await response.text();
      const html = window.marked(markdown); // ✅ use the global marked

      const slide = document.createElement('div');
      slide.classList.add('mySlide');
      slide.innerHTML = html;
      slidesTrack.appendChild(slide);

      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('onclick', `setSlide(${i})`);
      dotsContainer.appendChild(dot);
    } else {
      console.error(`Failed to load file: ${experiences[i]}`);
    }
  }

  updateSlidePosition();
  updateDots();
}

// Move slides left or right
function moveSlide(n) {
  const slides = document.querySelectorAll('.mySlide');
  const totalSlides = slides.length;

  slideIndex += n;

  if (slideIndex >= totalSlides) {
    slideIndex = 0;
  } else if (slideIndex < 0) {
    slideIndex = totalSlides - 1;
  }

  updateSlidePosition();
  updateDots();
}

// Set slide based on dot click
function setSlide(n) {
  slideIndex = n;
  updateSlidePosition();
  updateDots();
  resetScrollbar();
}

// Update slide position using translateX
function updateSlidePosition() {
  const slidesTrack = document.getElementById('slidesTrack');
  const slideWidth = document.querySelector('.mySlide').clientWidth;
  slidesTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
  resetScrollbar();
}

// Update dot appearance
function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot) => dot.classList.remove('active'));
  dots[slideIndex].classList.add('active');
}

function loadProjects() {
  scrollTo(0, 0);
  // Find all parallax carousels on the page
  const carousels = document.querySelectorAll('.parallax-carousel');
  carousels.forEach((carousel) => {
    const left = carousel.querySelector('.left');
    const right = carousel.querySelector('.right');
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) {
      left.style.display = 'none';
      right.style.display = 'none';
    }
    left.addEventListener('click', () => moveCarousel(carousel, -1));
    right.addEventListener('click', () => moveCarousel(carousel, 1));
  });
}

function moveCarousel(carousel, direction) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const activeSlide = carousel.querySelector('.carousel-slide.active');
  let currentIndex = Array.from(slides).indexOf(activeSlide);
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = slides.length - 1;
  if (newIndex >= slides.length) newIndex = 0;

  slides[currentIndex].classList.remove('active');
  slides[newIndex].classList.add('active');
}

async function loadTimeline() {
  scrollTo(0, 0); // Reset scroll position

  // Animate timeline-line height as user scrolls
  function animateTimelineLine() {
    const line = document.querySelector('.timeline-line');
    const timeline = document.getElementById('timeline');
    if (!line || !timeline) return;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const elementTop = timeline.offsetTop;
    const maxHeight = timeline.scrollHeight;

    const visibleHeight = scrollY + viewportHeight - elementTop;
    const newHeight = Math.min(visibleHeight, maxHeight);

    line.style.height = `${newHeight}px`;
  }

  // Trigger timeline-line height growth on scroll
  window.addEventListener('scroll', animateTimelineLine);
  animateTimelineLine(); // initial call

  // Observer for timeline-item animations
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const connector = item.querySelector('.timeline-connector');
          const bump = item.querySelector('.timeline-bump');
          const content = item.querySelector('.timeline-content');

          if (connector && connector.style.opacity !== '1') {
            connector.style.opacity = '1';
            connector.style.animation = 'expandConnector 0.4s ease-out forwards';
          }

          setTimeout(() => {
            if (bump && bump.style.opacity !== '1') {
              bump.style.opacity = '1';
              bump.style.animation = 'expandBall 0.4s ease-out forwards';
            }
          }, 200); // after connector

          setTimeout(() => {
            if (content && content.style.opacity !== '1') {
              const isLeft = item.classList.contains('left');
              content.style.setProperty('--origin', isLeft ? 'right top' : 'left top');
              content.style.opacity = '1';
              content.style.transform = 'scale(1)';
              content.style.animation = 'unfoldFromBump 0.5s ease-out forwards';
            }
          }, 400);

          observer.unobserve(item); // Animate once
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll('.timeline-item').forEach((item) => {
    observer.observe(item);
  });
}
