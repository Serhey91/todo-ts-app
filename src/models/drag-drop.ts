namespace App {
  // drag&drop
  export interface Draggable {
    dragEndHandler(event: DragEvent): void;
    dragStartHandler(event: DragEvent): void;
  }

  export interface DragTarget {
    dropHandler(event: DragEvent): void;
    dragOverHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}

