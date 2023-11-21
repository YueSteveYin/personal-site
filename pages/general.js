window.addEventListener('DOMContentLoaded', init);


async function init() {
    const swtich = document.querySelector('#dark');
    const body = document.querySelector('body');
    body.classList.add("body1");
    if (localStorage.getItem('dark') == null) {
        localStorage.setItem('dark', false);
    } else if (localStorage.getItem('dark') == 'true') {
        setTimeout(() => {
            swtich.click();
        }, 1);
    }
    swtich.addEventListener('click', function () {
        if (this.checked) {
            localStorage.setItem('dark', true);
            body.classList.add("body2");
            body.classList.remove("body1");
        }else{
            localStorage.setItem('dark', false);
            body.classList.add("body1");
            body.classList.remove("body2");
        }
    });
}