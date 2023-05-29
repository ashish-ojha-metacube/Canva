export function getAuthentication() {
  if (window.canva && window.canva.authentication) {
    return window.canva.authentication;
  }

  throw new Error('Could not retrieve Authentication');
}
