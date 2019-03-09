import generateDataCard from './data-card.js';
import generateDataFilter from './data-filter';
import Card from './card';
import CardPopup from './card-popup';
import Filter from './filter';

const FILTERS = [`Favorites`, `History`, `Watchlist`, `All movies`];
const START_QUANTITY_CARDS = 7;
const QUANTITY_CARDS_OF_FILM_LIST_EXTRA = 2;

const filmsListContainerMain = document.querySelector(`.films-list .films-list__container`);
const filmsListContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmPopupContainer = document.querySelector(`body`);
const filtersContainer = document.querySelector(`.main-navigation`);

const createFilter = (name) => {
  const data = generateDataFilter(name);
  if (name === `All movies`) {
    data.count = 0;
    data.active = true;
  }

  const filterElement = new Filter(data);
  filterElement.render(filtersContainer);

  filterElement.onClick = () => {
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (filterActive) {
      filterActive.classList.remove(`main-navigation__item--active`);
    }
    filterElement.element.classList.add(`main-navigation__item--active`);
    createCards(filterElement._count);
  };
};

const createFilters = () => {
  for (const element of FILTERS) {
    createFilter(element);
  }
};

const createCard = (block) => {
  const data = generateDataCard();

  const cardElement = new Card(data, block);
  const cardPopup = new CardPopup(data);

  cardElement.render(block);

  cardElement.onClick = () => {
    cardPopup.render(filmPopupContainer);
  };

  cardPopup.onClick = () => {
    cardPopup.unrender();
  };
};

const createCards = (number) => {
  filmsListContainerMain.innerHTML = ``;
  for (let i = 0; i < number; i++) {
    createCard(filmsListContainerMain);
  }

  // отрисовать карточки в допконтейнерах
  for (const element of filmsListContainer) {
    element.innerHTML = ``;
    for (let i = 0; i < QUANTITY_CARDS_OF_FILM_LIST_EXTRA; i++) {
      createCard(element);
    }
  }
};

createFilters();
createCards(START_QUANTITY_CARDS);
