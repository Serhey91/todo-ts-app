var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function AutoBindContext(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        }
    };
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new ProjectState();
        return this.instance;
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        this.listeners.forEach(listenerFn => listenerFn([...this.projects]));
    }
}
const $state = ProjectState.getInstance();
function validate(validatableInput) {
    const { value, required, minLength, maxLength, min, max } = validatableInput;
    let isValid = true;
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0;
    }
    if (minLength !== undefined && typeof value === 'string') {
        isValid = isValid && value.length >= minLength;
    }
    if (maxLength !== undefined && typeof value === 'string') {
        isValid = isValid && value.length < maxLength;
    }
    if (min !== undefined && typeof value === 'number') {
        isValid = isValid && value > min;
    }
    if (max !== undefined && typeof value === 'number') {
        isValid = isValid && value < max;
    }
    return isValid;
}
class ProjectList {
    constructor(listType) {
        this.listType = listType;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        this.assinedProjects = [];
        this.resolveTemplate();
        $state.addlistener((projects) => {
            const relevantProjects = projects.filter((p) => {
                if (this.listType === 'active') {
                    return p.status === ProjectStatus.Active;
                }
                return p.status === ProjectStatus.Finished;
            });
            this.assinedProjects = relevantProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const list = document.getElementById(`${this.listType}-projects-list`);
        list.innerHTML = '';
        this.assinedProjects.forEach((p) => {
            const listItem = document.createElement('li');
            listItem.textContent = p.title;
            list.append(listItem);
        });
    }
    resolveTemplate() {
        const importedHTML = document.importNode(this.templateElement.content, true);
        this.element = importedHTML.firstElementChild;
        this.element.id = `${this.listType}-projects`;
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
    renderContent() {
        const listId = `${this.listType}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.listType.toUpperCase()} PROJECTS`;
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        this.resolveTemplate();
        this.initializeInputs();
        this.configure();
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    resolveTemplate() {
        const importedHTML = document.importNode(this.templateElement.content, true);
        this.element = importedHTML.firstElementChild;
        this.element.id = 'user-input';
    }
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
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    fetchUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = +this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle, required: true, minLength: 5
        };
        const descriptionValidatable = {
            value: enteredDescription, required: true
        };
        const peopleValidatable = {
            value: enteredPeople, required: true, min: 1, max: 10
        };
        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
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
    AutoBindContext,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], ProjectInput.prototype, "submitHandler", null);
const proj = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
//# sourceMappingURL=app.js.map