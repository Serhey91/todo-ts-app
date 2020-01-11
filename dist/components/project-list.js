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
import { $state } from '../state/state.js';
import { ProjectStatus } from '../models/project.js';
import { ProjectItem } from './project-item.js';
import { AutoBindContext } from '../decorators/auto-bind.js';
export class ProjectList extends Base {
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
        this.assinedProjects.forEach((project) => {
            new ProjectItem(this.element.querySelector('ul').id, project);
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
        $state.moveProject(projectId, this.listType === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    dragLeaveHandler(event) {
        const list = this.element.querySelector('ul');
        list.classList.remove('droppable');
    }
}
__decorate([
    AutoBindContext,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    AutoBindContext,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dropHandler", null);
__decorate([
    AutoBindContext,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map