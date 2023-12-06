class ratingWidget extends HTMLElement{
    constructor () {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        //create basic element
        const form = document.createElement('form');
        // form.setAttribute('action', 'https://httpbin.org/post');
        // form.setAttribute('method', 'POST');

        const title = document.createElement('label');
        title.setAttribute("id", "rating title")
        title.setAttribute('for', 'rating');
        title.textContent = 'How Satisfied are you? ';
        
        const ratingInput = document.createElement('input');
        ratingInput.setAttribute('type', 'number');
        ratingInput.setAttribute('id', 'rating');
        ratingInput.setAttribute('name', 'rating');
        ratingInput.setAttribute('min', '1');
        ratingInput.setAttribute('max', '5');
        ratingInput.setAttribute('value', '0');
        ratingInput.setAttribute('required', '');

        const submit = document.createElement('button');
        submit.setAttribute('type', 'submit');
        submit.textContent = 'Submit';
        submit.style.display = 'none';

        const stars = document.createElement('div');
        stars.classList.add('stars');
        stars.setAttribute('data-rating', '0');
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.setAttribute("class", "star");
            star.setAttribute('data-value', i.toString());
            star.textContent = '\u2605';
            stars.appendChild(star);
        }

        // Adding functions and css

        const style = document.createElement('style');
        style.textContent = `
        .star {
            font-size: 30px;
            color: #ccc;
            transition: color 0.2s;
            cursor: pointer;
        }
        .star:hover{
            color: gold;
        }
        `;

        form.appendChild(title);
        form.appendChild(stars);
        form.appendChild(submit);

        shadow.appendChild(form);
        shadow.appendChild(style);

        let starbutton = this.shadowRoot.querySelectorAll(".star");
        starbutton.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                ratingInput.value = value;
                for(let i = 0; i<starbutton.length; i++){
                    if(i<=(value-1)){
                        starbutton[i].style.color = "gold";
                    } else{
                        starbutton[i].style.color = "#ccc";
                    }
                }
                submit.click();
            });
        });
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission behavior

            const formData = new FormData(form);
            fetch('https://httpbin.org/post', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                console.log('Form submitted successfully');
                // You can add additional handling here, such as showing a success message
                } else {
                console.error('Form submission failed');
                // Handle error cases if needed
                }
            })
            .catch(error => {3
                console.error('Error:', error);
                // Handle error cases if needed
            });
        });
    }
}
window.customElements.define('rating-widget', ratingWidget);