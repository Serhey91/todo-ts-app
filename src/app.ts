/// <reference path='./components/project-input.ts' />
/// <reference path='./components/project-list.ts' />

namespace App {
  export const projectInputs = new ProjectInput();
  export const activeList = new ProjectList('active');
  export const finishedList = new ProjectList('finished');
}
