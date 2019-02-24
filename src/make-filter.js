const mainNavigation = document.querySelector(`.main-navigation`);

export default (name, count, active) => {

  const nameLow = name.toLowerCase();
  const templateFilterText = `
  <a href="#${nameLow}" class="main-navigation__item${active === `true` ? ` main-navigation__item--active` : ``}">${name}
  ${count !== 0 ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>
  `;

  mainNavigation.insertAdjacentHTML(`afterbegin`, templateFilterText);
};
