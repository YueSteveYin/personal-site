function loadPage(page) {
    const main = document.querySelector('main');
    const url = `components/${page}.html`;

    main.className = '';
    main.classList.remove('loaded');

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            main.innerHTML = html;
            main.classList.add('loaded', page);
            window.history.pushState(null, '', `?page=${page}`);

            // Load experiences after loading the experience page
            if (page === 'experience') {
                loadExperiences();
            }
        })
        .catch(() => {
            main.innerHTML = "<h2>404 - Page Not Found</h2>";
        });
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
const experiences = ['experience1.txt', 'experience2.txt', 'experience3.txt', 'experience4.txt', 'experience5.txt'];

// Load experiences and add dots dynamically
async function loadExperiences() {
    const slidesTrack = document.getElementById('slidesTrack');
    const dotsContainer = document.getElementById('dotsContainer');

    if (!slidesTrack || !dotsContainer) {
        console.error("Slideshow or dots container not found.");
        return;
    }

    slidesTrack.innerHTML = '';  // Clear existing slides
    dotsContainer.innerHTML = '';  // Clear existing dots

    // Fetch and add slides
    for (let i = 0; i < experiences.length; i++) {
        const response = await fetch(contentDir + experiences[i]);
        if (response.ok) {
            const text = await response.text();
            const [title, position, time, description, site] = text.split('\n');

            // Create slide
            const slide = document.createElement('div');
            slide.classList.add('mySlide');
            slide.innerHTML = `
                <h2>${title}</h2>
                <p class="position-time">${position} | ${time}</p>
                <div class="description">
                    <p>${description}</p>
                </div>
                ${site ? `<a href="${site}" target="_blank">Visit Site</a>` : ''}
            `;
            slidesTrack.appendChild(slide);

            // Create corresponding dot
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('onclick', `setSlide(${i})`);
            dotsContainer.appendChild(dot);
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
    resetScrollbar()
}

// Update slide position using translateX
function updateSlidePosition() {
    const slidesTrack = document.getElementById('slidesTrack');
    const slideWidth = document.querySelector('.mySlide').clientWidth;
    slidesTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
    resetScrollbar()
}

// Update dot appearance
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}
