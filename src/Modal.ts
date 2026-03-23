import type {dataObjectType, dataType} from "./data.ts";
import {changePositionCircle, resetAllElements} from "./main.ts";

export class Modal{
    protected sectorTitle: HTMLElement;
    protected sectorDescription: HTMLElement;
    protected directionTitle: HTMLElement;
    protected profiles: HTMLElement;
    protected profilesTitle: HTMLElement;
    protected sectorData: dataObjectType;
    protected qrImage: HTMLImageElement;
    protected closeButton: HTMLButtonElement;

    constructor(modal: HTMLElement, data: dataType, key: string) {
        this.sectorTitle = modal.querySelector('.sector-title') as HTMLElement;
        this.sectorDescription = modal.querySelector('.div-description') as HTMLElement;
        this.directionTitle = modal.querySelector('.direction-title') as HTMLElement;
        this.profiles = modal.querySelector('.profiles') as HTMLElement;
        this.profilesTitle = modal.querySelector('.profiles-title') as HTMLElement;
        this.closeButton = modal.querySelector('.modal__close-button') as HTMLButtonElement;
        this.qrImage = modal.querySelector('.qr-code') as HTMLImageElement;
        this.sectorData = data[key];
        if (this.sectorData) {
            this.sectorTitle.textContent = this.sectorData.sectorTitle;
            const descriptionList: string[] = this.sectorData.sectorDescription;
            descriptionList.forEach(description => {
                const pDesc = document.createElement("p");
                pDesc.classList.add("sector-description");
                pDesc.textContent = description;
                this.sectorDescription.appendChild(pDesc);
            })
            if (this.sectorData.url != null) {
                this.qrImage.src = this.sectorData.url;
                this.qrImage.hidden = false;
            }
            else {
                this.qrImage.hidden = true;
            }
            const directionsList: string[] | null = this.sectorData.directions;
            const profilesList: string[] | null = this.sectorData.profiles;
            if (directionsList) {
                if (directionsList.length > 1){
                    this.directionTitle.textContent = "Направления: "
                        + directionsList.map(direction => direction).join(', ');
                }
                else {
                    this.directionTitle.textContent = "Направление: " + directionsList[0];
                }
            }
            if (profilesList != null) {
                this.profilesTitle.hidden = false;
                profilesList.forEach(profile => {
                    let liElement = document.createElement("li");
                    liElement.textContent = profile;
                    this.profiles.appendChild(liElement);
                })
            }
            this.closeButton.addEventListener('click', () => {
                changePositionCircle();
                resetAllElements();
                modal.remove();
            });
        }
    }
    public getPosition(): string|null {
        return this.sectorData.positionSide;
    }
}

export class ModalJob extends Modal {
    protected jobTitle: HTMLElement;
    protected scopeOfWork: HTMLElement;
    protected skills: HTMLElement;
    protected vacancies: HTMLAnchorElement;
    protected jobColor: string | null = null;
    constructor(modal: HTMLElement, data: dataType, key: string) {
        super(modal, data, key);
        this.jobTitle = modal.querySelector('.job-title') as HTMLElement;
        this.scopeOfWork = modal.querySelector('.scope-of-work') as HTMLElement;
        this.skills = modal.querySelector('.skills') as HTMLElement;
        this.vacancies = modal.querySelector('.vacancies') as HTMLAnchorElement;
        this.jobTitle.textContent = this.sectorData.jobTitle;
        const jobList : string[] | null = this.sectorData.jobDescription;
        if (jobList) {
            this.scopeOfWork.textContent = jobList[0];
            const skillsString: string = jobList[1];
            const lines: string[] = skillsString.split(/\n/).filter(line => line.trim());
            const title: string = lines[0].trim();
            const items: string[] = lines.slice(1)
                .filter(line => line.trim().startsWith('—'))
                .map(line => line.trim());
            this.skills.innerHTML =
                `<p class="skills-title">${title}</p>
                <ul class="list">
                    ${items.slice(1).map(item => `<li>${(item)}</li>`).join('')}
                </ul>` ;
        }
        if (this.sectorData.jobColor != null) {
            this.jobColor = this.sectorData.jobColor;
        }
        if (this.sectorData.vacancies != null) {
            this.vacancies.href = this.sectorData.vacancies;
        }
    }
    public getJobColor(): string | null {
        return this.jobColor;
    }
}