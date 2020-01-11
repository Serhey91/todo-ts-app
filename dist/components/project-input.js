var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Base from './base.js';
import { AutoBindContext as Bind } from '../decorators/auto-bind.js';
import * as VALIDATION from '../utils/validation.js';
import { $state } from '../state/state.js';
export class ProjectInput extends Base {
    constructor() {
        super('project-input', 'app', 'afterbegin', 'user-input');
        this.configure();
    }
    configure() {
        this.initializeInputs();
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    initializeInputs() {
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.fetchUserInput();
        if (!userInput) {
        }
        else {
            const [title, description, people] = userInput;
            $state.addProject(title, description, people);
            this.clearInput();
        }
    }
    fetchUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = +this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle, required: true, minLength: 3
        };
        const descriptionValidatable = {
            value: enteredDescription, required: true
        };
        const peopleValidatable = {
            value: enteredPeople, required: true, min: 1, max: 10
        };
        if (!VALIDATION.validate(titleValidatable) || !VALIDATION.validate(descriptionValidatable) || !VALIDATION.validate(peopleValidatable)) {
            return alert('Invalid input, please try again');
        }
        return [enteredTitle, enteredDescription, enteredPeople];
    }
    clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = null;
    }
}
__decorate([
    Bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map