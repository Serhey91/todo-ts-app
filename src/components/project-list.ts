/// <reference path='./base.ts' />
/// <reference path='project-item.ts' />
/// <reference path='../decorators/auto-bind.ts' />
/// <reference path='../state/state.ts' />
/// <reference path='../models/project.ts' />
/// <reference path='../models/drag-drop.ts' />

namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
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
}
