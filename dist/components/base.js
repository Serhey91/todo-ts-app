export default class Component {
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
//# sourceMappingURL=base.js.map