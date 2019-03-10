export default (template, container, position = `beforeend`) => {

  container.insertAdjacentHTML(position, template);

  if (position === `beforeend`) {
    return container.lastChild;
  } else {
    return container.firstChild;
  }

};
