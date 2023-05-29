export function getDesignInteraction() {
  if (window.canva && window.canva.designInteraction) {
    return window.canva.designInteraction;
  }

  throw new Error('Could not retrieve Design Interaction');
}
