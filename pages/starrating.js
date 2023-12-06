class ratingWidget extends HTMLElement{
    constructor () {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        //create basic element
        const form = document.createElement('form');
        form.setAttribute('action', 'https://httpbin.org/post');
        form.setAttribute('method', 'POST');

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
        ratingInput.setAttribute('required', '');
        ratingInput.style.display = "none";

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
        form.appendChild(ratingInput);
        form.appendChild(submit);


        shadow.appendChild(form);
        shadow.appendChild(style);

        let starbutton = this.shadowRoot.querySelectorAll(".star");
        starbutton.forEach(star => {
            star.addEventListener('click', () => {
                let deleteComment = this.shadowRoot.querySelectorAll(".responses");
                console.log(deleteComment);
                if (deleteComment) {
                    deleteComment.forEach(comment => {
                        comment.parentNode.removeChild(comment);
                    });
                }
                const value = star.dataset.value;
                ratingInput.value = value;
                for(let i = 0; i<starbutton.length; i++){
                    if(i<=(value-1)){
                        starbutton[i].style.color = "gold";
                    } else{
                        starbutton[i].style.color = "#ccc";
                    }
                }
                const responses = document.createElement('label');
                responses.setAttribute("class", "responses");
                responses.setAttribute('for', 'rating');
                if(value >= 4){
                    responses.textContent = 'Thank you for ' + value + " rating! Happy to see you like it!";
                    form.appendChild(responses);
                }else if(value<=2){
                    responses.textContent = 'Sorry for the ' + value + " star experience, I will try to do better!";
                    form.appendChild(responses);
                }else{
                    responses.textContent = 'Thank you for ' + value + " rating";
                    form.appendChild(responses);
                }
                submit.click();
            });
        });

                

        const headers = new Headers();
        headers.append('X-Sent-By', 'JS');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const formData = new FormData(form);
            formData.append('sentBy', 'js');
            formData.append("ratingInput", ratingInput.value);
            fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: headers, 
                body: formData, 
            })
            .then(response => {
                if (response.ok) {
                    console.log('Form submitted successfully');
                } else {
                    console.error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
}
window.customElements.define('rating-widget', ratingWidget);