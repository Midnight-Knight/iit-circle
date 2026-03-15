const elementsDark = Array.from(document.querySelector('#frontend_circle-dark-theme')!.children);

for (const element of elementsDark) {
    if(element.id.includes('hit-dark')) {
        const id = element.id.slice(0, -9);
        const elementVector = document.getElementById(id+'-vector-dark');

        //console.log(id, elementVector!.id);

        element.addEventListener('click', () => {
            alert(element.id);
        })

        element.addEventListener('mouseover', () => {
            console.log('hover',elementVector!.id);
            elementVector!.setAttribute('stroke-width', '8');
            elementVector!.setAttribute('stroke-color', '#FFFFFF');
        })

        element.addEventListener('mouseout', () => {
            elementVector!.setAttribute('stroke-width', '2');
            elementVector!.setAttribute('stroke-color', '#9D9D9D');
        })
    }
}

const elementsLight = Array.from(document.querySelector('#frontend_circle-light-theme')!.children);

for (const element of elementsLight) {
    if(element.id.includes('hit-light')) {
        const id = element.id.slice(0, -10);
        const elementVector = document.getElementById(id+'-vector-light');

        //console.log(id);
        //console.log(elementVector!.id);

        element.addEventListener('click', () => {
            alert(element.id);
        })

        element.addEventListener('mouseover', () => {
            console.log('hover',elementVector!.id);
            elementVector!.setAttribute('stroke-width', '8');
            elementVector!.setAttribute('stroke-color', '#151515');
        })

        element.addEventListener('mouseout', () => {
            elementVector!.setAttribute('stroke-width', '2');
            elementVector!.setAttribute('stroke-color', '#3B3C48');
        })
    }
}

let theme = 'dark';

function buttonLightChangeTheme() {
    theme = 'dark';
    changeTheme();
}

function buttonDarkChangeTheme() {
    theme = 'light';
    changeTheme();
}

function changeTheme() {
    if (theme === 'dark') {
        const circleActive = document.querySelector('.dark-circle');
        const circleDisabled = document.querySelector('.light-circle');
        const buttonActive = document.querySelector('.button-theme-dark');
        const buttonDisabled = document.querySelector('.button-theme-light');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            buttonActive.classList.add('active-button');
            buttonDisabled.classList.remove('active-button');
            app.classList.remove('light-app');
            app.classList.add('dark-app');
        }
    } else {
        const circleActive = document.querySelector('.light-circle');
        const circleDisabled = document.querySelector('.dark-circle');
        const buttonActive = document.querySelector('.button-theme-light');
        const buttonDisabled = document.querySelector('.button-theme-dark');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            buttonActive.classList.add('active-button');
            buttonDisabled.classList.remove('active-button');
            app.classList.remove('dark-app');
            app.classList.add('light-app');
        }
    }
}

const buttonDark = document.querySelector('.button-theme-dark');
const buttonLight = document.querySelector('.button-theme-light');

if (buttonDark && buttonLight) {
    buttonDark.addEventListener('click', buttonDarkChangeTheme);
    buttonLight.addEventListener('click', buttonLightChangeTheme);
}
changeTheme();