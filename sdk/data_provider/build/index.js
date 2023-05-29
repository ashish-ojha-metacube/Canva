export function getDataProvider() {
  if (window.canva && window.canva.dataProvider) {
    return window.canva.dataProvider;
  }

  throw new Error('Could not retrieve Data Provider');
}
