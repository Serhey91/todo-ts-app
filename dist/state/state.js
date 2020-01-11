import { Project, ProjectStatus } from '../models/project.js';
class State {
    constructor() {
        this.listeners = [];
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
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
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
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
export const $state = ProjectState.getInstance();
//# sourceMappingURL=state.js.map