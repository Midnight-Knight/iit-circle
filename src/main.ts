import data from "./data.ts";
import {Modal, ModalJob} from "./Modal.ts";

const app = document.querySelector("#app");

const elementsDark = Array.from(document.querySelector('#frontend_circle-dark-theme')!.children);

for (const element of elementsDark) {
    if(element.id.includes('hit-dark')) {
        const id = element.id.slice(0, -9);
        const elementVector = document.getElementById(id+'-vector-dark');

        //console.log(id, elementVector!.id);
        element.addEventListener('click', () => {
            const modal: HTMLElement = openModal(id);
            const existingModal = app.querySelector('.modal');{
                if (existingModal) {
                    existingModal.remove();
                }
                app.appendChild(modal);
            }
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
            const modal: HTMLElement = openModal(id);
            const existingModal = app.querySelector('.modal');{
                if (existingModal) {
                    existingModal.remove();
                }
                app.appendChild(modal);
            }
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
            document.documentElement.style.setProperty('--main-color-elements', '#151515');
            document.documentElement.style.setProperty('--main-color-inside', '#E6E6E6');
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
            document.documentElement.style.setProperty('--main-color-elements', '#FFFFFF');
            document.documentElement.style.setProperty('--main-color-inside', '#3B3C48');
            //добавить смену цвета названия и рамки профессии в светлой теме
        }
    }
}

function openModal(id: string): HTMLElement{
    if (data[id] && data[id].jobDescription != null) {
        const templateElement = document.getElementById("position-modal");
        const cloneElement = templateElement.content.cloneNode(true) as HTMLElement;
        const modalElement = cloneElement.firstElementChild as HTMLElement;
        const modalObject = new ModalJob(modalElement, data, id);
        const color: string | null = modalObject.getJobColor();
        if (color == null) {
            document.documentElement.style.setProperty('--job-color', 'var(--main-color-inside)');
        }
        else {
            document.documentElement.style.setProperty('--job-color', color);
        }
        return modalElement as HTMLElement;
    }
    else{
        const templateElement = document.getElementById("specialization-modal");
        const cloneElement = templateElement.content.cloneNode(true) as HTMLElement;
        const modalElement = cloneElement.firstElementChild as HTMLElement;
        new Modal(modalElement, data, id);
        return modalElement as HTMLElement;
    }
}

const buttonDark = document.querySelector('.button-theme-dark');
const buttonLight = document.querySelector('.button-theme-light');
if (buttonDark && buttonLight) {
    buttonDark.addEventListener('click', buttonDarkChangeTheme);
    buttonLight.addEventListener('click', buttonLightChangeTheme);
}
changeTheme();