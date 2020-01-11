/// <reference path='./base.ts' />
/// <reference path='../decorators/auto-bind.ts' />
/// <reference path='../state/state.ts' />
/// <reference path='../utils/validation.ts' />

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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
}
