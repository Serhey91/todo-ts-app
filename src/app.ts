function AutoBindContext(target: any, methodName:string|number|Symbol, descriptor: PropertyDescriptor):PropertyDescriptor {
  const originalMethod = descriptor.value;
  return {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  }
}

enum ProjectStatus {Active, Finished}
type InsertPositionHTML = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
// Project
class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

type Listener = (items: Project[]) => void;

// State
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];

  private static instance: ProjectState;
  private constructor() {}

  static getInstance():ProjectState {
    if (!this.instance) this.instance = new ProjectState();

    return this.instance;
  }

  addlistener(listenerFn: Listener):void {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, people: number):void {
    const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);

    this.projects.push(newProject);
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

class ProjectList extends Component<HTMLDivElement, HTMLElement>{
  assinedProjects: Project[];

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
    this.assinedProjects.forEach(({title}: Project) => {
      const listItem = document.createElement('li');
      listItem.textContent = title;
      list.append(listItem);
    })
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;
  // TODO - try to make dynamic files - in the constructor(getting template and hostElement)
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
      value: enteredTitle, required: true, minLength: 5
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

const proj = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
