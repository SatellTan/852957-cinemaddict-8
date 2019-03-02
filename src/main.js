import makeFilter from './make-filter.js';
import makeCard from './make-card.js';
import generateData from './data.js';

const FILTERS = [`Favorites`, `History`, `Watchlist`, `All movies`];
const START_QUANTITY_CARDS = 7;
const QUANTITY_CARDS_OF_FILM_LIST_EXTRA = 2;
const MAX_CARDS = 10;

const filmsListContainerMain = document.querySelector(`.films-list .films-list__container`);
const filmsListContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
let arrayCards = [];

const generateRandomNumber = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
};

const onFilterClick = (evt) => {

  const mainNavigationItemActive = document.querySelector(`.main-navigation__item--active`);
  if (mainNavigationItemActive) {
    mainNavigationItemActive.classList.remove(`main-navigation__item--active`);
  }
  evt.currentTarget.classList.add(`main-navigation__item--active`);
  filmsListContainerMain.innerHTML = ``;
  createCards(filmsListContainerMain, generateRandomNumber(MAX_CARDS));
};

const addHandlerOnFilters = () => {
  const filterElements = document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);
  for (const element of filterElements) {
    element.addEventListener(`click`, onFilterClick);
  }
};

const createFilters = () => {
  for (let i = 0; i < FILTERS.length; i++) {
    let filterCount = generateRandomNumber(MAX_CARDS);
    let active = `false`;
    if (i === (FILTERS.length - 1)) {
      active = `true`;
      filterCount = 0;
    }
    makeFilter(FILTERS[i], filterCount, active);
  }
};

const createCards = (block, number) => {
  arrayCards = [];
  for (let i = 0; i < number; i++) {
    arrayCards.push(generateData());
  }

  for (const element of arrayCards) {
    makeCard(block, element);
  }
};

const fillListExtra = () => {
  for (const element of filmsListContainer) {
    for (let i = 0; i < QUANTITY_CARDS_OF_FILM_LIST_EXTRA; i++) {
      makeCard(element, arrayCards[generateRandomNumber(arrayCards.length)]);
    }
  }
};

createFilters();
createCards(filmsListContainerMain, START_QUANTITY_CARDS);
fillListExtra();
addHandlerOnFilters();
