export function getDragAndDrop() {
  if (window.canva && window.canva.dragAndDrop) {
    return window.canva.dragAndDrop;
  }

  throw new Error('Could not retrieve Drag and Drop');
}
