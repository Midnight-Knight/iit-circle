import type {dataObjectType, dataType} from "./data.ts";

export class Modal{
    protected sectorTitle: HTMLElement;
    protected sectorDescription: HTMLElement;
    protected directionTitle: HTMLElement;
    protected profiles: HTMLElement;
    protected sectorData: dataObjectType;
    protected qrImage: HTMLImageElement;
    protected closeButton: HTMLButtonElement;

    constructor(modal: HTMLElement, data: dataType, key: string) {
        this.sectorTitle = modal.querySelector('.sector-title') as HTMLElement;
        this.sectorDescription = modal.querySelector('.sector-description') as HTMLElement;
        this.directionTitle = modal.querySelector('.direction-title') as HTMLElement;
        this.profiles = modal.querySelector('.profiles') as HTMLElement;
        this.closeButton = modal.querySelector('.modal__close-button') as HTMLButtonElement;
        this.qrImage = modal.querySelector('.qr-code') as HTMLImageElement;
        this.sectorData = data[key];
        if (this.sectorData) {
            this.sectorTitle.textContent = this.sectorData.sectorTitle;
            this.sectorDescription.textContent = this.sectorData.sectorDescription[0];
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
                    this.directionTitle.textContent = "Направления: " + directionsList.map(direction => direction).join(', ');
                }
                else {
                    this.directionTitle.textContent = "Направление: " + directionsList[0];
                }
            }
            if (profilesList) {
                profilesList.forEach(profile => {
                    let liElement = document.createElement("li");
                    liElement.textContent = profile;
                    this.profiles.appendChild(liElement);
                })
            }
            this.closeButton.addEventListener('click', () => {
                modal.remove();
            });
        }
    }
}

export class ModalJob extends Modal {
    protected jobTitle: HTMLElement;
    protected scopeOfWork: HTMLElement;
    protected skills: HTMLElement;
    protected vacancies: HTMLElement;
    protected jobColor: string;
    constructor(modal: HTMLElement, data: dataType, key: string) {
        super(modal, data, key);
        this.jobTitle = modal.querySelector('.job-title') as HTMLElement;
        this.scopeOfWork = modal.querySelector('.scope-of-work') as HTMLElement;
        this.skills = modal.querySelector('.skills') as HTMLElement;
        this.vacancies = modal.querySelector('.vacancies') as HTMLElement;
        this.jobTitle.textContent = this.sectorData.jobTitle;
        const jobList : string[] | null = this.sectorData.jobDescription;
        if (jobList) {
            this.scopeOfWork.textContent = jobList[0];
            jobList.slice(1).forEach(skill => {
                let liElement = document.createElement("li");
                liElement.textContent = skill;
                this.skills.appendChild(liElement);
            })
        }
        if (this.sectorData.jobColor != null) {
            this.jobColor = this.sectorData.jobColor;
        }
        if (this.sectorData.vacancies != null) {
            this.vacancies.href = this.sectorData.vacancies;
        }
    }
    public getJobColor(): string {
        return this.jobColor;
    }
}