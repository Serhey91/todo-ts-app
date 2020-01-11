import {Project, ProjectStatus} from '../models/project.js';

export type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];
  addlistener(listenerFn: Listener<T>):void {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project>{
  private projects: Project[] = [];

  private static instance: ProjectState;
  private constructor() {
    super();
  }

  static getInstance():ProjectState {
    if (!this.instance) this.instance = new ProjectState();

    return this.instance;
  }

  addProject(title: string, description: string, people: number):void {
    const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project: null|Project = this.projects.find((p: Project) => p.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    this.listeners.forEach(listenerFn => listenerFn([...this.projects]));
  }
}
// runs only once for the first time - and if it imports at second time - it would not run again
// state of all application
export const $state:ProjectState = ProjectState.getInstance();
