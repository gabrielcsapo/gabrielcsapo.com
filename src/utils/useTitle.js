export function useTitle(title, description) {
  document.title = title;

  if (description) {
    document.querySelector('meta[name="description"]').content = description;
  }
}
