var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("models/position", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.Component = Component;
});
define("decorators/auto-bind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function AutoBindContext(target, methodName, descriptor) {
        const originalMethod = descriptor.value;
        return {
            configurable: true,
            get() {
                return originalMethod.bind(this);
            }
        };
    }
    exports.AutoBindContext = AutoBindContext;
});
define("utils/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.validate = validate;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            const newProject = new project_js_1.Project(Math.random().toString(), title, description, people, project_js_1.ProjectStatus.Active);
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
    exports.ProjectState = ProjectState;
    exports.$state = ProjectState.getInstance();
});
define("components/project-input", ["require", "exports", "components/base", "decorators/auto-bind", "utils/validation", "state/state"], function (require, exports, base_js_1, auto_bind_js_1, validation_js_1, state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProjectInput extends base_js_1.Component {
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
                state_js_1.$state.addProject(title, description, people);
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
            if (!validation_js_1.validate(titleValidatable) || !validation_js_1.validate(descriptionValidatable) || !validation_js_1.validate(peopleValidatable)) {
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
        auto_bind_js_1.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base", "decorators/auto-bind"], function (require, exports, base_js_2, auto_bind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProjectItem extends base_js_2.Component {
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
        auto_bind_js_2.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        auto_bind_js_2.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectItem.prototype, "dragEndHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "components/base", "state/state", "models/project", "components/project-item", "decorators/auto-bind"], function (require, exports, base_js_3, state_js_2, project_js_2, project_item_js_1, auto_bind_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProjectList extends base_js_3.Component {
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
            state_js_2.$state.addlistener((projects) => {
                const relevantProjects = projects.filter(({ status }) => {
                    return (this.listType === 'active') ? (status === project_js_2.ProjectStatus.Active) : (status === project_js_2.ProjectStatus.Finished);
                });
                this.assinedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderProjects() {
            const list = document.getElementById(`${this.listType}-projects-list`);
            list.innerHTML = '';
            this.assinedProjects.forEach((project) => {
                new project_item_js_1.ProjectItem(this.element.querySelector('ul').id, project);
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
            state_js_2.$state.moveProject(projectId, this.listType === 'active' ? project_js_2.ProjectStatus.Active : project_js_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(event) {
            const list = this.element.querySelector('ul');
            list.classList.remove('droppable');
        }
    }
    __decorate([
        auto_bind_js_3.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        auto_bind_js_3.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        auto_bind_js_3.AutoBindContext,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [DragEvent]),
        __metadata("design:returntype", void 0)
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const projectInputs = new project_input_js_1.ProjectInput();
    const activeList = new project_list_js_1.ProjectList('active');
    const finishedList = new project_list_js_1.ProjectList('finished');
});
//# sourceMappingURL=bundle.js.map