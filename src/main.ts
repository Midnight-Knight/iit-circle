import data from "./data.ts";
import {Modal, ModalJob} from "./Modal.ts";
import {animate} from "motion";

const isTouch = window.matchMedia('(hover: none)').matches;
const app = document.querySelector("#app");

const elementsDark = Array.from(document.querySelector('#frontend_circle-dark-theme')!.children);
const elementsLight = Array.from(document.querySelector('#frontend_circle-light-theme')!.children);

const darkElementsCache = new Map<string, { vector: HTMLElement, title: HTMLElement }>();
const lightElementsCache = new Map<string, { vector: HTMLElement, title: HTMLElement }>();

type ElementState = 'active' | 'activeAndHover' | 'noActive' | 'noActiveAndHover' | 'accentuated';

const hasDarkElement = new Map<string, ElementState>();
const hasLightElement = new Map<string, ElementState>();

for (const element of elementsDark) {
    if (element.id.includes('hit-dark')) {
        const id = element.id.slice(0, -9);
        darkElementsCache.set(id, {
            vector: document.getElementById(id + '-vector-dark') as HTMLElement,
            title: document.getElementById(id + '-title-dark') as HTMLElement,
        });
    }
}

for (const element of elementsLight) {
    if (element.id.includes('hit-light')) {
        const id = element.id.slice(0, -10);
        lightElementsCache.set(id, {
            vector: document.getElementById(id + '-vector-light') as HTMLElement,
            title: document.getElementById(id + '-title-light') as HTMLElement,
        });
    }
}

export function changePositionCircle(scale: number | null | undefined = 1.0 , x: string | null | undefined = '0%', y: string | null | undefined = '0%')
{
    if (app)
    {
        const circleLight = app.querySelector('.light-circle')?.firstElementChild;
        const circleDark = app.querySelector('.dark-circle')?.firstElementChild;

        /*
        {
            duration: 0.3,
            ease: 'linear',
        }
        {
            duration: 0,
        }
        {
            type: 'spring',
            stiffness: 60,
            damping: 20,
            mass: 1.5,
            restDelta: 0.01,
            restSpeed: 0.01
        }
         */

        animate([circleLight, circleDark], { x, y }, {
            type: 'spring',
            stiffness: 60,
            damping: 20,
            mass: 1.5,
            restDelta: 0.01,
            restSpeed: 0.01
        });

        animate([circleLight, circleDark], { scale }, {
            type: 'spring',
            stiffness: 60,
            damping: 20,
            mass: 1.5,
            restDelta: 0.01,
            restSpeed: 0.01
        });

        const buttons = Array.from(document.querySelectorAll<HTMLElement>('.button-theme-light, .button-theme-dark'));
        const isDefault = scale === 1.0 && x === '0%' && y === '0%';

        if (isDefault) {
            buttons.forEach(btn => btn.style.display = '');
            animate(buttons,
                { opacity: 1 },
                { duration: 0.3, ease: 'easeOut' }
            );
        } else {
            animate(buttons,
                { opacity: 0 },
                { duration: 0.3, ease: 'easeIn' }
            ).then(() => {
                buttons.forEach(btn => btn.style.display = 'none');
            });
        }
    }
}

const hoverDark = (elementVector: HTMLElement | null, elementTitle: HTMLElement | null, hasElement: Map<string, ElementState>, id: string) => {
    const has = hasElement.get(id);
    switch (has) {
        case 'accentuated':
            break;
        case 'active':
            hasElement.set(id, 'activeAndHover');
            elementVector!.setAttribute('stroke-width', '0.75');
            elementVector!.setAttribute('stroke-color', '#FFFFFF');
            break;
        case 'activeAndHover':
            hasElement.set(id, 'active');
            elementVector!.setAttribute('stroke-width', '0.25');
            elementVector!.setAttribute('stroke-color', '#9D9D9D');
            break;
        case 'noActive':
            hasElement.set(id, 'noActiveAndHover');
            elementVector!.setAttribute('opacity', '1');
            elementTitle!.setAttribute('opacity', '1');
            elementVector!.setAttribute('stroke-width', '0.75');
            elementVector!.setAttribute('stroke-color', '#FFFFFF');
            break;
        case 'noActiveAndHover':
            hasElement.set(id, 'noActive');
            elementVector!.setAttribute('opacity', '0.5');
            elementTitle!.setAttribute('opacity', '0.5');
            elementVector!.setAttribute('stroke-width', '0.25');
            elementVector!.setAttribute('stroke-color', '#9D9D9D');
            break;
    }
};

const hoverLight = (elementVector: HTMLElement | null, elementTitle: HTMLElement | null, hasElement: Map<string, ElementState>, id: string) => {
    const has = hasElement.get(id);
    switch (has) {
        case 'accentuated':
            break;
        case 'active':
            hasElement.set(id, 'activeAndHover');
            elementVector!.setAttribute('stroke-width', '0.75');
            elementVector!.setAttribute('stroke-color', '#151515');
            break;
        case 'activeAndHover':
            hasElement.set(id, 'active');
            elementVector!.setAttribute('stroke-width', '0.25');
            elementVector!.setAttribute('stroke-color', '#3B3C48');
            break;
        case 'noActive':
            hasElement.set(id, 'noActiveAndHover');
            elementVector!.setAttribute('opacity', '1');
            elementTitle!.setAttribute('opacity', '1');
            elementVector!.setAttribute('stroke-width', '0.75');
            elementVector!.setAttribute('stroke-color', '#151515');
            break;
        case 'noActiveAndHover':
            hasElement.set(id, 'noActive');
            elementVector!.setAttribute('opacity', '0.5');
            elementTitle!.setAttribute('opacity', '0.5');
            elementVector!.setAttribute('stroke-width', '0.25');
            elementVector!.setAttribute('stroke-color', '#3B3C48');
            break;
    }
};

function applyAccentuatedDark(elVector: HTMLElement, elTitle: HTMLElement) {
    elTitle.setAttribute('opacity', '1');
    elVector.setAttribute('opacity', '1');
    elVector.setAttribute('stroke-width', '0.75');
    elVector.setAttribute('stroke-color', '#FFFFFF');
}

function applyAccentuatedLight(elVector: HTMLElement, elTitle: HTMLElement) {
    elTitle.setAttribute('opacity', '1');
    elVector.setAttribute('opacity', '1');
    elVector.setAttribute('stroke-width', '0.75');
    elVector.setAttribute('stroke-color', '#151515');
}

export function resetAllElements() {
    for (const el of elementsDark) {
        if (el.id.includes('hit-dark')) {
            const idForEach = el.id.slice(0, -9);
            const elVectorForEach = darkElementsCache.get(idForEach)?.vector as HTMLElement;
            const elTitleForEach = darkElementsCache.get(idForEach)?.title as HTMLElement;

            hasDarkElement.set(idForEach, 'active');
            elTitleForEach.setAttribute('opacity', '1');
            elVectorForEach.setAttribute('opacity', '1');
            elVectorForEach.setAttribute('stroke-width', '0.25');
            elVectorForEach.setAttribute('stroke-color', '#9D9D9D');
        }
    }

    for (const el of elementsLight) {
        if (el.id.includes('hit-light')) {
            const idForEach = el.id.slice(0, -10);
            const elVectorForEach = lightElementsCache.get(idForEach)?.vector as HTMLElement;
            const elTitleForEach = lightElementsCache.get(idForEach)?.title as HTMLElement;

            hasLightElement.set(idForEach, 'active');
            elTitleForEach.setAttribute('opacity', '1');
            elVectorForEach.setAttribute('opacity', '1');
            elVectorForEach.setAttribute('stroke-width', '0.25');
            elVectorForEach.setAttribute('stroke-color', '#3B3C48');
        }
    }
}

for (const element of elementsDark) {
    if(element.id.includes('hit-dark')) {
        const id = element.id.slice(0, -9);
        const elementVector = darkElementsCache.get(id)?.vector as HTMLElement;
        const elementTitle = darkElementsCache.get(id)?.title as HTMLElement;
        hasDarkElement.set(id, 'active');

        function touchOrClick() {
            if (app) {
                changePositionCircle(data[id].animationScale, data[id].positionAnimX, data[id].positionAnimY);
                const existingModal = app.querySelector('.modal');
                if (existingModal) existingModal.remove();
                app.appendChild(openModal(id));

                for (const el of elementsDark) {
                    if (el.id.includes('hit-dark')) {
                        const idForEach = el.id.slice(0, -9);
                        const elVectorForEach = darkElementsCache.get(idForEach)?.vector as HTMLElement;
                        const elTitleForEach = darkElementsCache.get(idForEach)?.title as HTMLElement;
                        const hasForEach = hasDarkElement.get(idForEach);

                        if (idForEach === id) {
                            hasDarkElement.set(idForEach, 'accentuated');
                            applyAccentuatedDark(elVectorForEach, elTitleForEach);
                        } else {
                            if (hasForEach === 'activeAndHover' || hasForEach === 'noActiveAndHover') {
                                hasDarkElement.set(idForEach, 'noActiveAndHover');
                                elVectorForEach.setAttribute('stroke-width', '0.75');
                                elVectorForEach.setAttribute('stroke-color', '#FFFFFF');
                                elTitleForEach.setAttribute('opacity', '1');
                                elVectorForEach.setAttribute('opacity', '1');
                            } else {
                                hasDarkElement.set(idForEach, 'noActive');
                                elVectorForEach.setAttribute('stroke-width', '0.25');
                                elVectorForEach.setAttribute('stroke-color', '#9D9D9D');
                                elTitleForEach.setAttribute('opacity', '0.5');
                                elVectorForEach.setAttribute('opacity', '0.5');
                            }
                        }
                    }
                }
            }
        }

        if (isTouch) {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchOrClick();
            }, { passive: false });
        } else {
            element.addEventListener('click', touchOrClick);
            element.addEventListener('mouseover', () => hoverDark(elementVector, elementTitle, hasDarkElement, id))
            element.addEventListener('mouseout', () => hoverDark(elementVector, elementTitle, hasDarkElement, id))
        }
    }
}

for (const element of elementsLight) {
    if(element.id.includes('hit-light')) {
        const id = element.id.slice(0, -10);
        const elementVector = lightElementsCache.get(id)?.vector as HTMLElement;
        const elementTitle = lightElementsCache.get(id)?.title as HTMLElement;
        hasLightElement.set(id, 'active');

        function touchOrClick() {
            if (app) {
                changePositionCircle(data[id].animationScale, data[id].positionAnimX, data[id].positionAnimY);
                const existingModal = app.querySelector('.modal');
                if (existingModal) existingModal.remove();
                app.appendChild(openModal(id));

                for (const el of elementsLight) {
                    if (el.id.includes('hit-light')) {
                        const idForEach = el.id.slice(0, -10);
                        const elVectorForEach = lightElementsCache.get(idForEach)?.vector as HTMLElement;
                        const elTitleForEach = lightElementsCache.get(idForEach)?.title as HTMLElement;
                        const hasForEach = hasLightElement.get(idForEach);

                        if (idForEach === id) {
                            hasLightElement.set(idForEach, 'accentuated');
                            applyAccentuatedLight(elVectorForEach, elTitleForEach);
                        } else {
                            if (hasForEach === 'activeAndHover' || hasForEach === 'noActiveAndHover') {
                                hasLightElement.set(idForEach, 'noActiveAndHover');
                                elVectorForEach.setAttribute('stroke-width', '0.75');
                                elVectorForEach.setAttribute('stroke-color', '#151515');
                                elTitleForEach.setAttribute('opacity', '1');
                                elVectorForEach.setAttribute('opacity', '1');
                            } else {
                                hasLightElement.set(idForEach, 'noActive');
                                elVectorForEach.setAttribute('stroke-width', '0.25');
                                elVectorForEach.setAttribute('stroke-color', '#3B3C48');
                                elTitleForEach.setAttribute('opacity', '0.5');
                                elVectorForEach.setAttribute('opacity', '0.5');
                            }
                        }
                    }
                }
            }
        }

        if (isTouch) {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchOrClick();
            }, { passive: false });
        } else {
            element.addEventListener('click', touchOrClick);
            element.addEventListener('mouseover', () => hoverLight(elementVector, elementTitle, hasLightElement, id))
            element.addEventListener('mouseout', () => hoverLight(elementVector, elementTitle, hasLightElement, id))
        }
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
        const circleActive = document.querySelector<HTMLElement>('.dark-circle');
        const circleDisabled = document.querySelector<HTMLElement>('.light-circle');
        const buttonActive = document.querySelector('.button-theme-dark');
        const buttonDisabled = document.querySelector('.button-theme-light');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            circleActive.style.display = 'flex';
            animate(circleActive, { opacity: 1 }, { duration: 0.3, ease: 'easeOut' });
            animate(circleDisabled, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' })
                .then(() => { circleDisabled.style.display = 'none'; });
            buttonActive.classList.add('active-button');
            buttonDisabled.classList.remove('active-button');
            app.classList.remove('light-app');
            app.classList.add('dark-app');
            document.documentElement.style.setProperty('--main-color-elements', '#151515');
            document.documentElement.style.setProperty('--main-color-inside', '#E6E6E6');
        }
    } else {
        const circleActive = document.querySelector<HTMLElement>('.light-circle');
        const circleDisabled = document.querySelector<HTMLElement>('.dark-circle');
        const buttonActive = document.querySelector('.button-theme-light');
        const buttonDisabled = document.querySelector('.button-theme-dark');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            circleActive.style.display = 'flex';
            animate(circleActive, { opacity: 1 }, { duration: 0.3, ease: 'easeOut' });
            animate(circleDisabled, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' })
                .then(() => { circleDisabled.style.display = 'none'; });
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

function changePosition(el: HTMLElement, modalObject: Modal) {
    const position = modalObject.getPosition();
    const isMobile = window.innerWidth < 900;
    switch (position) {
        case 'left':
            if (isMobile) {
                el.style.left = "32px";
            } else {
                el.style.left = "15svmin";
            }
            break;
        case 'right':
            if (isMobile) {
                el.style.right = "32px";
            } else {
                el.style.right = "15svmin";
            }
            break;
        case 'center-right':
            if (isMobile) {
                el.style.right = "32px";
            } else {
                el.style.right = "48svmin";
            }
            break;
    }
}
function changeColor(modalObject: Modal) {
    const color: string | null = modalObject.getJobColor();
    if (color == null) {
        document.documentElement.style.setProperty('--job-color', 'var(--main-color-inside)');
    }
    else {
        document.documentElement.style.setProperty('--job-color', color);
    }
}
function animateModalIn(element: HTMLElement) {
    animate(element, { opacity: 1 },{duration: 0.5});
}

function openModal(id: string): HTMLElement{
    if (data[id] && data[id].jobDescription != null) {
        const templateElement = document.getElementById("position-modal") as HTMLTemplateElement | null;
        if (!templateElement) throw new Error("Template 'position-modal' not found");
        const cloneElement = templateElement.content.cloneNode(true) as HTMLElement;
        const modalElement = cloneElement.firstElementChild as HTMLElement;
        const modalObject = new ModalJob(modalElement, data, id);
        changeColor(modalObject);
        changePosition(modalElement,modalObject);
        return modalElement as HTMLElement;
    }
    else{
        const templateElement = document.getElementById("specialization-modal") as HTMLTemplateElement | null;
        if (!templateElement) throw new Error("Template 'specialization-modal' not found");
        const cloneElement = templateElement.content.cloneNode(true) as HTMLElement;
        const modalElement = cloneElement.firstElementChild as HTMLElement;
        const modalObject = new Modal(modalElement, data, id);
        changePosition(modalElement,modalObject);
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