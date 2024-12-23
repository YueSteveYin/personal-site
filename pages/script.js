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



const contentDir = './components/experience_contents/';
const experiences = ['experience1.txt', 'experience2.txt'];

async function loadExperiences() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    if (!slideshowContainer) {
        console.error("Slideshow container not found.");
        return;
    }

    for (let i = 0; i < experiences.length; i++) {
        const response = await fetch(contentDir + experiences[i]);
        if (response.ok) {
            const text = await response.text();
            const [title, position, time, description, site] = text.split('\n');

            // Create slide element
            const slide = document.createElement('div');
            slide.classList.add('mySlides', 'fade');

            slide.innerHTML = `
                <div class="slide-content">
                    <h2>${title}</h2>
                    <p class="position-time">${position} | ${time}</p>
                    <div class="description">
                        <p>${description}</p>
                    </div>
                    ${site ? `<a href="${site}" target="_blank" class="site-link">Visit Site</a>` : ''}
                </div>
            `;

            slideshowContainer.insertBefore(slide, slideshowContainer.querySelector('.prev'));
        }
    }

    showSlides(slideIndex);
}

let slideIndex = 0;

// Next/previous controls
function moveSlide(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length-1) {slideIndex = 0}
    if (n < 0) {slideIndex = slides.length-1}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex].style.display = "block";
}