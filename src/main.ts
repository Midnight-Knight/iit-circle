import data from "./data.ts";
import {Modal, ModalJob} from "./Modal.ts";
import {animate} from "motion";

const app = document.querySelector("#app");

const elementsDark = Array.from(document.querySelector('#frontend_circle-dark-theme')!.children);

function changePositionCircle(scale: number | null | undefined = 1.0 ,x: string | null | undefined = '0%', y: string | null | undefined = '0%')
{
    if (app)
    {
        const circleLight = app.querySelector('.light-circle')?.firstElementChild;
        const circleDark = app.querySelector('.dark-circle')?.firstElementChild;

        animate([circleLight, circleDark], { scale, x, y }, {
            type: 'spring',
            stiffness: 60,
            damping: 20,
            mass: 1.5
        });
    }
}

for (const element of elementsDark) {
    if(element.id.includes('hit-dark')) {
        const id = element.id.slice(0, -9);
        const elementVector = document.getElementById(id+'-vector-dark');

        //console.log(id, elementVector!.id);
        element.addEventListener('click', () => {
            if (app)
            {
                changePositionCircle(data[id].animationScale, data[id].positionAnimX, data[id].positionAnimY)
                const existingModal = app.querySelector('.modal');
                if (existingModal) existingModal.remove();
                app.appendChild(openModal(id));
                for (const el of elementsDark) {
                    if (el.id.includes('hit-dark')) {
                        const idForEach = el.id.slice(0, -9);
                        const elVectorForEach = document.getElementById(idForEach+'-vector-dark');
                        const elTitleForEach = document.getElementById(idForEach+'-title-dark');
                        if (idForEach !== id) {
                            elTitleForEach!.setAttribute('opacity', '0.5');
                            elVectorForEach!.setAttribute('opacity', '0.5');
                        } else {
                            elTitleForEach!.setAttribute('opacity', '1');
                            elVectorForEach!.setAttribute('opacity', '1');
                        }
                    }
                }
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
            if (app)
            {
                changePositionCircle(data[id].animationScale, data[id].positionAnimX, data[id].positionAnimY)
                const existingModal = app.querySelector('.modal');
                if (existingModal) existingModal.remove();
                app.appendChild(openModal(id));
                for (const el of elementsLight) {
                    const idForEach = el.id.slice(0, -10);
                    const elVectorForEach = document.getElementById(idForEach+'-vector-light');
                    const elTitleForEach = document.getElementById(idForEach+'-title-light');
                    if (idForEach !== id) {
                        elTitleForEach!.setAttribute('opacity', '0.5');
                        elVectorForEach!.setAttribute('opacity', '0.5');
                    } else {
                        elTitleForEach!.setAttribute('opacity', '1');
                        elVectorForEach!.setAttribute('opacity', '1');
                    }
                }
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
        const templateElement = document.getElementById("position-modal") as HTMLTemplateElement | null;
        if (!templateElement) throw new Error("Template 'position-modal' not found");
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
        const templateElement = document.getElementById("specialization-modal") as HTMLTemplateElement | null;
        if (!templateElement) throw new Error("Template 'specialization-modal' not found");
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