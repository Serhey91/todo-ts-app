var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    function AutoBindContext(target, methodName, descriptor) {
        const originalMethod = descriptor.value;
        return {
            configurable: true,
            get() {
                return originalMethod.bind(this);
            }
        };
    }
    App.AutoBindContext = AutoBindContext;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addlistener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (!this.instance)
                this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, people) {
            const newProject = new App.Project(Math.random().toString(), title, description, people, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((p) => p.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            this.listeners.forEach(listenerFn => listenerFn([...this.projects]));
        }
    }
    App.ProjectState = ProjectState;
    App.$state = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
            isValid = isValid && value.length <= maxLength;
        }
        if (min !== undefined && typeof value === 'number') {
            isValid = isValid && value >= min;
        }
        if (max !== undefined && typeof value === 'number') {
            isValid = isValid && value <= max;
        }
        return isValid;
    }
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
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
                App.$state.addProject(title, description, people);
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
            if (!App.validate(titleValidatable) || !App.validate(descriptionValidatable) || !App.validate(peopleValidatable)) {
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
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        constructor(hostId, project) {
            super('single-project', hostId, 'beforeend', project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1)
                return '1 person';
            return `${this.project.people} people`;
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = `${this.persons} assigned`;
            this.element.querySelector('p').textContent = this.project.description;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(event) {
        }
    }
    __decorate([
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectItem.prototype, "dragEndHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
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
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
            App.$state.addlistener((projects) => {
                const relevantProjects = projects.filter(({ status }) => {
                    return (this.listType === 'active') ? (status === App.ProjectStatus.Active) : (status === App.ProjectStatus.Finished);
                });
                this.assinedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderProjects() {
            const list = document.getElementById(`${this.listType}-projects-list`);
            list.innerHTML = '';
            this.assinedProjects.forEach((project) => {
                new App.ProjectItem(this.element.querySelector('ul').id, project);
            });
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const list = this.element.querySelector('ul');
                list.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData('text/plain');
            App.$state.moveProject(projectId, this.listType === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(event) {
            const list = this.element.querySelector('ul');
            list.classList.remove('droppable');
        }
    }
    __decorate([
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    App.projectInputs = new App.ProjectInput();
    App.activeList = new App.ProjectList('active');
    App.finishedList = new App.ProjectList('finished');
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map