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
class Component {
    constructor(templateId, hostElementId, insertPlace, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        this.resolveTemplate(newElementId);
        this.attach(insertPlace);
    }
    resolveTemplate(id) {
        const importedHTML = document.importNode(this.templateElement.content, true);
        this.element = importedHTML.firstElementChild;
        if (id)
            this.element.id = id;
    }
    attach(plateToInsert) {
        this.hostElement.insertAdjacentElement(plateToInsert, this.element);
    }
}
class ProjectList extends Component {
    constructor(listType) {
        super('project-list', 'app', 'beforeend', `${listType}-projects`);
        this.listType = listType;
        this.assinedProjects = [];
        this.configure();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.listType}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.listType.toUpperCase()} PROJECTS`;
    }
    configure() {
        $state.addlistener((projects) => {
            const relevantProjects = projects.filter(({ status }) => {
                return (this.listType === 'active') ? (status === ProjectStatus.Active) : (status === ProjectStatus.Finished);
            });
            this.assinedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const list = document.getElementById(`${this.listType}-projects-list`);
        list.innerHTML = '';
        this.assinedProjects.forEach(({ title }) => {
            const listItem = document.createElement('li');
            listItem.textContent = title;
            list.append(listItem);
        });
    }
}
class ProjectInput extends Component {
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