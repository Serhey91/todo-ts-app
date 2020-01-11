function AutoBindContext(target: any, methodName:string|number|Symbol, descriptor: PropertyDescriptor):PropertyDescriptor {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  }
}

// drag&drop
interface Draggable {
  dragEndHandler(event: DragEvent): void;
  dragStartHandler(event: DragEvent): void;
}

interface DragTarget {
  dropHandler(event: DragEvent): void;
  dragOverHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {Active, Finished}
type InsertPositionHTML = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
// Project
class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

type Listener<T> = (items: T[]) => void;

// State
abstract class State<T> {
  protected listeners: Listener<T>[] = [];
  addlistener(listenerFn: Listener<T>):void {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project>{
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
// state of all application
const $state:ProjectState = ProjectState.getInstance();

// Validation
interface IValidatable {
  value: string|number;
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  min?: number,
  max?: number,
}

function validate(validatableInput:IValidatable):boolean {
  const {value, required, minLength, maxLength, min, max} = validatableInput;
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

// component base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  constructor(templateId: string, hostElementId: string, insertPlace: InsertPositionHTML, newElementId?: string) {
    this.templateElement = <HTMLTemplateElement>document.getElementById(templateId);
    this.hostElement = <T>document.getElementById(hostElementId);

    this.resolveTemplate(newElementId);
    this.attach(<InsertPosition>insertPlace);

  }

  private resolveTemplate(id: string|void):void {
    const importedHTML:DocumentFragment = document.importNode(this.templateElement.content, true);
    this.element = <U>importedHTML.firstElementChild;
    if (id) this.element.id = id;
  }

  private attach(plateToInsert: InsertPosition):void {
    this.hostElement.insertAdjacentElement(plateToInsert, this.element);
  }

  abstract configure():void;
  abstract renderContent():void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  private assinedProjects: Project[];

  constructor(private listType: 'active'|'finished') {
    super('project-list', 'app', 'beforeend', `${listType}-projects`);

    this.assinedProjects = [];

    this.configure();
    this.renderContent();
  }

  renderContent():void {
    const listId = `${this.listType}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.listType.toUpperCase()} PROJECTS`
  }

  configure():void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    $state.addlistener((projects: Project[]) => {
      const relevantProjects: Project[] = projects.filter(({status}:Project) => {
        return (this.listType === 'active') ? (status === ProjectStatus.Active) : (status === ProjectStatus.Finished);
      });

      this.assinedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects():void {
    const list = <HTMLUListElement>document.getElementById(`${this.listType}-projects-list`);
    list.innerHTML = '';
    this.assinedProjects.forEach((project: Project) => {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    })
  }

  @AutoBindContext
  dragOverHandler(event: DragEvent):void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const list = this.element.querySelector('ul')!;
      list.classList.add('droppable');
    }
  }

  @AutoBindContext
  dropHandler(event: DragEvent):void {
    const projectId: string = event.dataTransfer.getData('text/plain');
    $state.moveProject(projectId, this.listType === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @AutoBindContext
  dragLeaveHandler(event: DragEvent):void {
    const list = this.element.querySelector('ul')!;
    list.classList.remove('droppable');
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
  private project: Project;

  get persons() {
    if (this.project.people === 1) return '1 person';

    return `${this.project.people} people`;
  }
  constructor(hostId: string, project: Project) {
    super('single-project', hostId, 'beforeend', project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure():void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent():void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  @AutoBindContext
  dragStartHandler(event: DragEvent):void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @AutoBindContext
  dragEndHandler(event: DragEvent):void {

  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    super('project-input', 'app', 'afterbegin', 'user-input');

    this.configure();
  }

  configure():void {
    this.initializeInputs();
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent():void {}

  private initializeInputs():void {
    this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
    this.descriptionInputElement = <HTMLTextAreaElement>this.element.querySelector('#description');
    this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');
  }

  @AutoBindContext
  private submitHandler(event: Event):void {
    event.preventDefault();
    const userInput:[string, string, number]|void = this.fetchUserInput();
    if (!userInput) {

    } else {
      const [title, description, people] = userInput;
      $state.addProject(title, description, people);
      this.clearInput();
    }
  }

  private fetchUserInput():[string, string, number]|void {
    const enteredTitle: string = this.titleInputElement.value;
    const enteredDescription: string = this.descriptionInputElement.value;
    const enteredPeople: number = +this.peopleInputElement.value;

    const titleValidatable: IValidatable = {
      value: enteredTitle, required: true, minLength: 3
    }
    const descriptionValidatable: IValidatable = {
      value: enteredDescription, required: true
    }
    const peopleValidatable: IValidatable = {
      value: enteredPeople, required: true, min: 1, max: 10
    }
    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
      return alert('Invalid input, please try again');
    }

    return [enteredTitle, enteredDescription, enteredPeople];
  }

  private clearInput():void {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = null;
  }
}


// instances of application
const projectInputs = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
