import makeFilter from './make-filter.js';
import makeCard from './make-card.js';

const FILTERS = [`Favorites`, `History`, `Watchlist`, `All movies`];
const START_QUANTITY_CARDS = 7;
const QUANTITY_CARDS_OF_FILM_LIST_EXTRA = 2;
const MAX_CARDS = 10;

const filmsListContainerMain = document.querySelector(`.films-list .films-list__container`);
const filmsListContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);

const randomNumber = () => { return Math.floor(Math.random() * (MAX_CARDS + 1)); }

const onFilterClick = (evt) => {

  const mainNavigationItemActive = document.querySelector('.main-navigation__item--active');
  if (mainNavigationItemActive) {
    mainNavigationItemActive.classList.remove('main-navigation__item--active');
  }
  evt.currentTarget.classList.add('main-navigation__item--active');
  filmsListContainerMain.innerHTML = ``;
  createCards(filmsListContainerMain, randomNumber());
};

const addHandlerOnFilters = () => {
  const filterElements = document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);
  for (const element of filterElements) {
    element.addEventListener(`click`, onFilterClick);
  }
};

const createFilters = () => {
  for (let i = 0; i < FILTERS.length; i++) {
    let filterCount = randomNumber();
    let active = `false`;
    if (i === (FILTERS.length - 1)) {
      active  = `true`;
      filterCount = 0;
    }
    makeFilter(FILTERS[i], filterCount, active);
  }
};

const createCards = (block, number) => {
  for (let i = 0; i < number; i++) {
    makeCard(block);
  }
};

createFilters();
createCards(filmsListContainerMain, START_QUANTITY_CARDS);

for (const element of filmsListContainer) {
  createCards(element, QUANTITY_CARDS_OF_FILM_LIST_EXTRA);
}

addHandlerOnFilters();
