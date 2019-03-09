export default (template, container) => {

  container.insertAdjacentHTML(`beforeend`, template);

  return container.lastChild;
};
