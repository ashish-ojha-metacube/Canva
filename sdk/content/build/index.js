export function getContent() {
  if (window.canva && window.canva.content) {
    return window.canva.content;
  }

  throw new Error('Could not retrieve the Content SDK client');
}
