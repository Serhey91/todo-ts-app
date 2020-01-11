  // component base class
import {InsertPositionHTML} from '../models/position.js';

export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

