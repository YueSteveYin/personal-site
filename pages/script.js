function loadPage(page) {
  const main = document.querySelector('main');
  const url = `components/${page}.html`;
  const title = document.getElementById('title');
  const body = document.querySelector('body');
  main.className = '';
  main.classList.remove('loaded');

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
        title.style.color = 'white';
        body.classList.value = '';
        body.classList.add('projects');
      }
    })
    .catch(() => {
      main.innerHTML = '<h2>404 - Page Not Found</h2>';
    });
}

let fireworksSpawned = false;

function loadAbout() {
  scrollTo(0, 0);
  const firework = document.querySelector('.firework');
  const cover = document.querySelector('#cover');
  const sky = document.getElementById('skyfireworks');

  if (!firework || !cover || !sky) {
    console.error('Missing firework or cover element.');
    return;
  }

  let fireworksSpawned = false;

  function updateFirework() {
    let scrollY = window.scrollY;
    let progress = scrollY / (document.body.scrollHeight - window.innerHeight);

    let fireworkMove = Math.min(progress * 90, 90);
    firework.style.bottom = `${fireworkMove}%`;
    cover.style.bottom = `${fireworkMove}%`;

    if (progress >= 0.95) {
      firework.classList.add('exploded');
      cover.style.display = 'none';

      if (!fireworksSpawned) {
        spawnSkyFireworks(5); // spawn 5 fireworks
        fireworksSpawned = true;
      }
    } else {
      firework.classList.remove('exploded');
      cover.style.display = 'block';
      fireworksSpawned = false;
      sky.innerHTML = ''; // clear old fireworks
    }
  }

  function spawnSkyFireworks(count) {
    for (let i = 0; i < count; i++) {
      const fw = document.createElement('div');
      fw.classList.add('sky-firework');

      // Random position
      fw.style.left = `${Math.random() * 80 + 10}%`;
      fw.style.top = `${Math.random() * 20 + 5}%`;

      // Staggered animation delay
      fw.style.animationDelay = `${i * 0.3}s`;

      document.getElementById('skyfireworks').appendChild(fw);
    }
  }

  window.addEventListener('scroll', updateFirework);
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
const contentDir = './components/experience_contents/';
const experiences = [
  'experience1.txt',
  'experience2.txt',
  'experience3.txt',
  'experience4.txt',
  'experience5.txt',
];

// Load experiences and add dots dynamically
async function loadExperiences() {
  const slidesTrack = document.getElementById('slidesTrack');
  const dotsContainer = document.getElementById('dotsContainer');

  if (!slidesTrack || !dotsContainer) {
    console.error('Slideshow or dots container not found.');
    return;
  }

  slidesTrack.innerHTML = ''; // Clear existing slides
  dotsContainer.innerHTML = ''; // Clear existing dots

  // Fetch and add slides
  for (let i = 0; i < experiences.length; i++) {
    const response = await fetch(contentDir + experiences[i]);

    if (response.ok) {
      const text = await response.text();
      const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length < 3) {
        console.error(`Invalid format in file: ${experiences[i]}`);
        continue;
      }

      const [title, position, time] = lines.slice(0, 3);
      let site = '';
      let description = '';

      // Check if the 4th line is a site link
      if (lines[3].startsWith('site:')) {
        site = lines[3].replace('site: ', '');
        description = lines.slice(4).join('<br>'); // Combine the rest into the description
      } else {
        description = lines.slice(3).join('<br>'); // No site, so start description from 4th line
      }

      // Create slide
      const slide = document.createElement('div');
      slide.classList.add('mySlide');
      slide.innerHTML = `
                <h2>${title}</h2>
                <p class="position-time">${position} | ${time}</p>
                ${site ? `<a href="${site}" target="_blank">Visit Site</a>` : ''}
                <div class="description">
                    <p>${description}</p>
                </div>
            `;
      slidesTrack.appendChild(slide);

      // Create corresponding dot
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('onclick', `setSlide(${i})`);
      dotsContainer.appendChild(dot);
    } else {
      console.error(`Failed to load file: ${experiences[i]}`);
    }
  }

  // Set initial slide position and activate first dot
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
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, index) => {
    // Delay connectors, bumps, and content sequentially
    const delay = 0.5 + index * 0.3; // Delay after timeline expansion

    const connector = item.querySelector('.timeline-connector');
    const bump = item.querySelector('.timeline-bump');
    const content = item.querySelector('.timeline-content');

    // Apply animation with delay
    if (connector) {
      setTimeout(
        () => {
          connector.style.opacity = 1;
        },
        delay * 1000 - 1,
      );
      setTimeout(() => {
        connector.style.animation = `expandConnector 0.4s ease-out forwards`;
      }, delay * 1000);
    }
    if (bump) {
      setTimeout(
        () => {
          bump.style.opacity = 1;
        },
        delay * 1000 - 1,
      );
      setTimeout(() => {
        bump.style.animation = `expandBall 0.4s ease-out forwards`;
      }, delay * 1000);
    }
    if (content) {
      setTimeout(
        () => {
          content.style.opacity = 1;
        },
        delay * 1000 - 1,
      );
      setTimeout(() => {
        content.style.animation = `fadeInContent 0.4s ease-out forwards`;
      }, delay * 1000);
      setTimeout(
        () => {
          content.style.animation = 'none'; // Remove animation once completed
        },
        delay * 1000 + 400,
      );
    }
  });
}
