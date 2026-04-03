import data from "./data.ts";
import {Modal, ModalJob} from "./Modal.ts";
import {animate} from "motion";

const DARK = {
    strokeActive: '0.0833333',
    strokeHover: '0.6',
    colorActive: '#9D9D9D',
    colorHover: '#FFFFFF',
    opacityActive: '1',
    opacityInactive: '0.3',
} as const;

const LIGHT = {
    strokeActive: '0.0833333',
    strokeHover: '0.6',
    colorActive: '#3B3C48',
    colorHover: '#151515',
    opacityActive: '1',
    opacityInactive: '0.3',
} as const;

const isTouch = window.matchMedia('(hover: none)').matches;
const isTablet = window.innerWidth < 1335;
const app = document.querySelector("#app");
const settingsModal = document.querySelector('.small-modal') as HTMLElement;

const elementsDark = Array.from(document.querySelector('#frontend_circle-dark-theme')!.children);
const elementsLight = Array.from(document.querySelector('#frontend_circle-light-theme')!.children);

const darkElementsCache = new Map<string, { vector: HTMLElement, title: HTMLElement }>();
const lightElementsCache = new Map<string, { vector: HTMLElement, title: HTMLElement }>();

type ElementState = 'active' | 'activeAndHover' | 'noActive' | 'noActiveAndHover' | 'accentuated';
const animateCheck = settingsModal.querySelector<HTMLInputElement>('.animation-check');
let theme = 'dark';

const savedTheme = localStorage.getItem('theme');
const savedAnimation = localStorage.getItem('animation');

if (savedTheme) {
    theme = savedTheme;
}

if (animateCheck) {
    animateCheck.checked = savedAnimation !== null ? savedAnimation === 'true' : true;
}

animateCheck?.addEventListener('change', () => {
    localStorage.setItem('animation', String(animateCheck.checked));
});

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
        if (animateCheck?.checked){
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
        }
        else {
            animate([circleLight, circleDark], { x, y }, {
                duration: 0
            });

            animate([circleLight, circleDark], { scale }, {
                duration: 0
            });
        }

        const buttons = Array.from(document.querySelectorAll<HTMLElement>('.button-theme-light, .button-theme-dark, .button-settings-dark, .button-settings-light'));
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
            elementVector!.setAttribute('stroke-width', DARK.strokeHover);
            elementVector!.setAttribute('stroke-color', DARK.colorHover);
            break;
        case 'activeAndHover':
            hasElement.set(id, 'active');
            elementVector!.setAttribute('stroke-width', DARK.strokeActive);
            elementVector!.setAttribute('stroke-color', DARK.colorActive);
            break;
        case 'noActive':
            hasElement.set(id, 'noActiveAndHover');
            elementVector!.setAttribute('opacity', DARK.opacityActive);
            elementTitle!.setAttribute('opacity', DARK.opacityActive);
            elementVector!.setAttribute('stroke-width', DARK.strokeHover);
            elementVector!.setAttribute('stroke-color', DARK.colorHover);
            break;
        case 'noActiveAndHover':
            hasElement.set(id, 'noActive');
            elementVector!.setAttribute('opacity', DARK.opacityInactive);
            elementTitle!.setAttribute('opacity', DARK.opacityInactive);
            elementVector!.setAttribute('stroke-width', DARK.strokeActive);
            elementVector!.setAttribute('stroke-color', DARK.colorActive);
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
            elementVector!.setAttribute('stroke-width', LIGHT.strokeHover);
            elementVector!.setAttribute('stroke-color', LIGHT.colorHover);
            break;
        case 'activeAndHover':
            hasElement.set(id, 'active');
            elementVector!.setAttribute('stroke-width', LIGHT.strokeActive);
            elementVector!.setAttribute('stroke-color', LIGHT.colorActive);
            break;
        case 'noActive':
            hasElement.set(id, 'noActiveAndHover');
            elementVector!.setAttribute('opacity', LIGHT.opacityActive);
            elementTitle!.setAttribute('opacity', LIGHT.opacityActive);
            elementVector!.setAttribute('stroke-width', LIGHT.strokeHover);
            elementVector!.setAttribute('stroke-color', LIGHT.colorHover);
            break;
        case 'noActiveAndHover':
            hasElement.set(id, 'noActive');
            elementVector!.setAttribute('opacity', LIGHT.opacityInactive);
            elementTitle!.setAttribute('opacity', LIGHT.opacityInactive);
            elementVector!.setAttribute('stroke-width', LIGHT.strokeActive);
            elementVector!.setAttribute('stroke-color', LIGHT.colorActive);
            break;
    }
};

function applyAccentuatedDark(elVector: HTMLElement, elTitle: HTMLElement) {
    elTitle.setAttribute('opacity', DARK.opacityActive);
    elVector.setAttribute('opacity', DARK.opacityActive);
    elVector.setAttribute('stroke-width', DARK.strokeHover);
    elVector.setAttribute('stroke-color', DARK.colorHover);
}

function applyAccentuatedLight(elVector: HTMLElement, elTitle: HTMLElement) {
    elTitle.setAttribute('opacity', LIGHT.opacityActive);
    elVector.setAttribute('opacity', LIGHT.opacityActive);
    elVector.setAttribute('stroke-width', LIGHT.strokeHover);
    elVector.setAttribute('stroke-color', LIGHT.colorHover);
}

export function resetAllElements() {
    for (const el of elementsDark) {
        if (el.id.includes('hit-dark')) {
            const idForEach = el.id.slice(0, -9);
            const elVectorForEach = darkElementsCache.get(idForEach)?.vector as HTMLElement;
            const elTitleForEach = darkElementsCache.get(idForEach)?.title as HTMLElement;

            hasDarkElement.set(idForEach, 'active');
            elTitleForEach.setAttribute('opacity', DARK.opacityActive);
            elVectorForEach.setAttribute('opacity', DARK.opacityActive);
            elVectorForEach.setAttribute('stroke-width', DARK.strokeActive);
            elVectorForEach.setAttribute('stroke-color', DARK.colorActive);
        }
    }

    for (const el of elementsLight) {
        if (el.id.includes('hit-light')) {
            const idForEach = el.id.slice(0, -10);
            const elVectorForEach = lightElementsCache.get(idForEach)?.vector as HTMLElement;
            const elTitleForEach = lightElementsCache.get(idForEach)?.title as HTMLElement;

            hasLightElement.set(idForEach, 'active');
            elTitleForEach.setAttribute('opacity', LIGHT.opacityActive);
            elVectorForEach.setAttribute('opacity', LIGHT.opacityActive);
            elVectorForEach.setAttribute('stroke-width', LIGHT.strokeActive);
            elVectorForEach.setAttribute('stroke-color', LIGHT.colorActive);
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
                const modal = openModal(id);
                if (existingModal) existingModal.remove();
                app.appendChild(modal);
                animateModalIn(modal);

                for (const el of elementsDark) {
                    if (el.id.includes('hit-dark')) {
                        const idForEach = el.id.slice(0, -9);
                        const elVectorForEach = darkElementsCache.get(idForEach)?.vector as HTMLElement;
                        const elTitleForEach = darkElementsCache.get(idForEach)?.title as HTMLElement;
                        const hasForEach = hasDarkElement.get(idForEach);

                        if (idForEach === id) {
                            hasDarkElement.set(idForEach, 'accentuated');
                            applyAccentuatedDark(elVectorForEach, elTitleForEach);
                        } else if (data[id].relatedSectors?.includes(idForEach)) {
                            hasDarkElement.set(idForEach, 'active');
                            elTitleForEach.setAttribute('opacity', DARK.opacityActive);
                            elVectorForEach.setAttribute('opacity', DARK.opacityActive);
                            elVectorForEach.setAttribute('stroke-width', DARK.strokeActive);
                            elVectorForEach.setAttribute('stroke-color', DARK.colorActive);
                        } else {
                            if (hasForEach === 'activeAndHover' || hasForEach === 'noActiveAndHover') {
                                hasDarkElement.set(idForEach, 'noActiveAndHover');
                                elVectorForEach.setAttribute('stroke-width', DARK.strokeHover);
                                elVectorForEach.setAttribute('stroke-color', DARK.colorHover);
                                elTitleForEach.setAttribute('opacity', DARK.opacityActive);
                                elVectorForEach.setAttribute('opacity', DARK.opacityActive);
                            } else {
                                hasDarkElement.set(idForEach, 'noActive');
                                elVectorForEach.setAttribute('stroke-width', DARK.strokeActive);
                                elVectorForEach.setAttribute('stroke-color', DARK.colorActive);
                                elTitleForEach.setAttribute('opacity', DARK.opacityInactive);
                                elVectorForEach.setAttribute('opacity', DARK.opacityInactive);
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
                const modal = openModal(id);
                if (existingModal) existingModal.remove();
                app.appendChild(modal);
                animateModalIn(modal);

                for (const el of elementsLight) {
                    if (el.id.includes('hit-light')) {
                        const idForEach = el.id.slice(0, -10);
                        const elVectorForEach = lightElementsCache.get(idForEach)?.vector as HTMLElement;
                        const elTitleForEach = lightElementsCache.get(idForEach)?.title as HTMLElement;
                        const hasForEach = hasLightElement.get(idForEach);

                        if (idForEach === id) {
                            hasLightElement.set(idForEach, 'accentuated');
                            applyAccentuatedLight(elVectorForEach, elTitleForEach);
                        } else if (data[id].relatedSectors?.includes(idForEach)) {
                            hasLightElement.set(idForEach, 'active');
                            elTitleForEach.setAttribute('opacity', LIGHT.opacityActive);
                            elVectorForEach.setAttribute('opacity', LIGHT.opacityActive);
                            elVectorForEach.setAttribute('stroke-width', LIGHT.strokeActive);
                            elVectorForEach.setAttribute('stroke-color', LIGHT.colorActive);
                        } else {
                            if (hasForEach === 'activeAndHover' || hasForEach === 'noActiveAndHover') {
                                hasLightElement.set(idForEach, 'noActiveAndHover');
                                elVectorForEach.setAttribute('stroke-width', LIGHT.strokeHover);
                                elVectorForEach.setAttribute('stroke-color', LIGHT.colorHover);
                                elTitleForEach.setAttribute('opacity', LIGHT.opacityActive);
                                elVectorForEach.setAttribute('opacity', LIGHT.opacityActive);
                            } else {
                                hasLightElement.set(idForEach, 'noActive');
                                elVectorForEach.setAttribute('stroke-width', LIGHT.strokeActive);
                                elVectorForEach.setAttribute('stroke-color', LIGHT.colorActive);
                                elTitleForEach.setAttribute('opacity', LIGHT.opacityInactive);
                                elVectorForEach.setAttribute('opacity', LIGHT.opacityInactive);
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

function buttonLightChangeTheme() {
    theme = 'dark';
    localStorage.setItem('theme', 'dark');
    changeTheme();
}

function buttonDarkChangeTheme() {
    theme = 'light';
    localStorage.setItem('theme', 'light');
    changeTheme();
}

function changeTheme() {
    if (theme === 'dark') {
        const circleActive = document.querySelector<HTMLElement>('.dark-circle');
        const circleDisabled = document.querySelector<HTMLElement>('.light-circle');
        const buttonActive = document.querySelector('.button-theme-dark');
        const buttonDisabled = document.querySelector('.button-theme-light');
        const buttonSettingsAct = document.querySelector('.button-settings-dark');
        const buttonSettingsDis = document.querySelector('.button-settings-light');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            circleActive.style.display = 'flex';
            animate(circleActive, { opacity: 1 }, { duration: 0.3, ease: 'easeOut' });
            animate(circleDisabled, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' })
                .then(() => { circleDisabled.style.display = 'none'; });
            buttonActive.classList.add('active-button');
            buttonSettingsAct?.classList.add('active-button');
            buttonDisabled.classList.remove('active-button');
            buttonSettingsDis?.classList.remove('active-button');
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
        const buttonSettingsAct = document.querySelector('.button-settings-light');
        const buttonSettingsDis = document.querySelector('.button-settings-dark');
        const app = document.querySelector('#app');
        if (circleActive && circleDisabled && buttonActive && buttonDisabled && app) {
            circleActive.classList.add('active');
            circleDisabled.classList.remove('active');
            circleActive.style.display = 'flex';
            animate(circleActive, { opacity: 1 }, { duration: 0.3, ease: 'easeOut' });
            animate(circleDisabled, { opacity: 0 }, { duration: 0.3, ease: 'easeIn' })
                .then(() => { circleDisabled.style.display = 'none'; });
            buttonActive.classList.add('active-button');
            buttonSettingsAct?.classList.add('active-button');
            buttonDisabled.classList.remove('active-button');
            buttonSettingsDis?.classList.remove('active-button');
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
    switch (position) {
        case 'left':
            if (isTablet) {
                el.style.left = "32px";
            } else {
                el.style.left = "15svmin";
            }
            break;
        case 'right':
            if (isTablet) {
                el.style.right = "32px";
            } else {
                el.style.right = "15svmin";
            }
            break;
        case 'center-right':
            if (isTablet) {
                el.style.right = "20svw";
            } else {
                el.style.right = "48svmin";
            }
            break;
    }
}
function changeColor(modalObject: ModalJob) {
    const colorDark: string | null = modalObject.getJobColor();
    const colorLight: string|null = modalObject.getOutlineColor();
    if (theme =="dark" && colorDark != null){
        document.documentElement.style.setProperty('--job-color', colorDark);
    }
    else if (theme == "light" && colorLight != null){
        document.documentElement.style.setProperty('--job-color', colorLight);
    }
    else {
        document.documentElement.style.setProperty('--job-color', 'var(--main-color-inside)');
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
const settingsDark = document.querySelector('.button-settings-dark');
const settingsLight = document.querySelector('.button-settings-light');
if (settingsDark && settingsLight) {
    settingsDark.addEventListener('click', () =>{
        if (settingsModal.style.opacity == "0"){
            animate(settingsModal, { opacity: 1 }, { duration: 0.3, ease: 'easeOut' });
        }
    })
    settingsLight.addEventListener('click', () =>{
        if (settingsModal.style.opacity == "0"){
            animate(settingsModal, { opacity: 1 }, { duration: 0.1});
        }
    })
}
document.addEventListener('click', (e : MouseEvent) =>{
    if (!settingsModal.contains(e.target as HTMLElement) && settingsModal.style.opacity != "0") {
        animate(settingsModal, { opacity: 0 }, { duration: 0.1});
    }
})

changeTheme();

if (savedTheme === 'light') {
    buttonDarkChangeTheme();
} else {
    buttonLightChangeTheme();
}
