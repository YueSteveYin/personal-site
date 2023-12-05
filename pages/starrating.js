class ratingWidget extends HTMLElement{
    constructor () {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        console.log(this.shadowRoot.innerHTML);

        const stars = document.createElement('div');
        stars.classList.add('stars');
        stars.setAttribute('data-rating', '0');
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.setAttribute('data-value', i.toString());
            star.textContent = '\u2605';
            stars.appendChild(star);
        }

        let starbutton = this.shadowRoot.querySelectorAll(".star");
        starbutton.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                setRating(value);
                sendRating(value);
            });
        });
        

        const ratingInput = document.createElement('input');
        ratingInput.setAttribute('type', 'number');
        ratingInput.setAttribute('id', 'rating');
        ratingInput.setAttribute('name', 'rating');
        ratingInput.setAttribute('min', '1');
        ratingInput.setAttribute('max', '5');
        ratingInput.setAttribute('value', '0');
        ratingInput.setAttribute('required', '');

        shadow.appendChild(stars);
    }
}
window.customElements.define('rating-widget', ratingWidget);