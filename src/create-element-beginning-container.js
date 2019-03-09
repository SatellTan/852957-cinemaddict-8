export default (template, container) => {

  container.insertAdjacentHTML(`afterbegin`, template);

  return container.firstChild;
};
