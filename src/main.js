import generateDataCard from './data-card.js';
import generateDataFilter from './data-filter';
import Card from './card';
import CardPopup from './card-popup';
import Filter from './filter';
import displayStatistics from './statistic';

const FILTERS = [`Favorites`, `History`, `Watchlist`, `All movies`];
const START_QUANTITY_CARDS = 7;
const QUANTITY_CARDS_OF_FILM_LIST_EXTRA = 2;

const filmsListContainerMain = document.querySelector(`.films-list .films-list__container`);
const filmsListExtraContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsBlock = document.querySelector(`.films`);
const statisticsBlock = document.querySelector(`.statistic`);
const filmPopupContainer = document.querySelector(`body`);
const filtersContainer = document.querySelector(`.main-navigation`);
const statisticBtn = document.querySelector(`.main-navigation__item--additional`);
const initialCards = [];
let accessoryArrayCards = [];

const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `all movies`:
      return cards;

    case `watchlist`:
      return cards.filter((it) => it.watchlist);

    case `history`:
      return cards.filter((it) => it.watched);

    case `favorites`:
      return cards.filter((it) => it.favorite);

    default: return cards;
  }
};

const createFilter = (name) => {
  const data = generateDataFilter(name);
  if (name === `All movies`) {
    data.count = 0;
    data.active = true;
  } else {
    const filteredCards = filterCards(initialCards, name.toLowerCase());
    data.count = filteredCards.length;
  }

  const filterElement = new Filter(data);
  filterElement.render(filtersContainer);

  filterElement.onClick = () => {
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (filterActive) {
      filterActive.classList.remove(`main-navigation__item--active`);
    }
    filterElement.element.classList.add(`main-navigation__item--active`);

    filmsBlock.classList.remove(`visually-hidden`);
    statisticsBlock.classList.add(`visually-hidden`);

    // createCards(filterElement._count);
    const filteredCards = filterCards(initialCards, filterElement._name.toLowerCase());
    filterElement._count = filteredCards.length;
    renderCards(filteredCards, filmsListContainerMain);
  };
};

const createFilters = () => {
  for (const element of FILTERS) {
    createFilter(element);
  }
};

const renderCards = (cards, block) => {
  block.innerHTML = ``;

  for (let i = 0; i < cards.length; i++) {
    const data = cards[i];
    const cardElement = new Card(data, block);
    const cardPopup = new CardPopup(data);

    cardElement.render(block);

    cardElement.onClick = () => {
      cardPopup.render(filmPopupContainer);
    };

    cardPopup.onClickCloseBtn = (newData) => {
      data.ownRating = newData.score;
      cardElement.update(data);
      cardPopup.update(data);
      cardPopup.unrender();

      /* const filterActive = document.querySelector(`.main-navigation__item--active`);
      if (filterActive.textContent.toLowerCase() !== `all movies`) {
        const filteredCards = filterCards(initialCards, filterElement._name.toLowerCase());
        filterElement._count = filteredCards.length; //нужно найти экземпляр класса и обновить счетчик
        renderCards(filteredCards, filmsListContainerMain);
      } */
    };

    cardPopup.onAddComment = (newData) => {
      if (Object.keys(newData.comment).length) {
        data.comments.push(newData.comment);
      }
      toFillFilmsListsExtra(2);
    };

    cardPopup.onAddToWatchList = (newData) => {
      data.watchlist = newData.watchlist;
      // обновление фильтра
    };

    cardPopup.onMarkAsWatched = (newData) => {
      data.watched = newData.watched;
      // обновление фильтра
    };

    cardPopup.onFavorite = (newData) => {
      data.favorite = newData.favorite;
      // обновление фильтра
    };

    cardPopup.onEscPress = () => {
      cardPopup.unrender();
    };
  }
};

const createInitialCards = (number) => {
  for (let i = 0; i < number; i++) {
    initialCards.push(generateDataCard());
  }
};

const toFillFilmsListsExtra = (numberOfContainer) => {
  // отрисовать карточки в допконтейнерах
  accessoryArrayCards = initialCards.slice(0);

  if (numberOfContainer === 1) {
    accessoryArrayCards.sort((prev, next) => next.rating - prev.rating);
  } else if (numberOfContainer === 2) {
    accessoryArrayCards.sort((prev, next) => next.comments.length - prev.comments.length);
  }
  renderCards(accessoryArrayCards.slice(0, QUANTITY_CARDS_OF_FILM_LIST_EXTRA), filmsListExtraContainers[numberOfContainer - 1]);
};

const listenerClickStatisticBtn = () => {
  statisticsBlock.classList.remove(`visually-hidden`);
  filmsBlock.classList.add(`visually-hidden`);
  displayStatistics(initialCards);
};

createInitialCards(START_QUANTITY_CARDS);
createFilters();
statisticBtn.addEventListener(`click`, listenerClickStatisticBtn);
renderCards(initialCards, filmsListContainerMain);
toFillFilmsListsExtra(1);
toFillFilmsListsExtra(2);
