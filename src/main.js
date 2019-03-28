import generateDataFilter from './data-filter';
import Card from './card';
import CardPopup from './card-popup';
import Filter from './filter';
import displayStatistics from './statistic';
import API from './api';

const FILTERS_NAMES = [`Favorites`, `History`, `Watchlist`, `All movies`];
const QUANTITY_CARDS_OF_FILM_LIST_EXTRA = 2;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;

const filmsListContainerMain = document.querySelector(`.films-list .films-list__container`);
const filmsListExtraContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsBlock = document.querySelector(`.films`);
const statisticsBlock = document.querySelector(`.statistic`);
const filmPopupContainer = document.querySelector(`body`);
const filtersContainer = document.querySelector(`.main-navigation`);
const statisticBtn = document.querySelector(`.main-navigation__item--additional`);
let initialCards = [];
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const createFilter = (name) => {
  const data = generateDataFilter(name);

  const filterElement = new Filter(data);
  filterElement.render(filtersContainer);
  let filteredCards = filterElement.toFilter(initialCards, name.toLowerCase());
  data.count = filteredCards.length;
  filterElement.update(data);
  if (filterElement._name === `All movies`) {
    filterElement.element.classList.add(`main-navigation__item--active`);
  }

  filterElement.onClick = () => {
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (filterActive) {
      filterActive.classList.remove(`main-navigation__item--active`);
    }

    filmsBlock.classList.remove(`visually-hidden`);
    statisticsBlock.classList.add(`visually-hidden`);

    filteredCards = filterElement.toFilter(initialCards, filterElement._name.toLowerCase());
    data.count = filteredCards.length;
    filterElement.update(data);
    filterElement.element.classList.add(`main-navigation__item--active`);
    renderCards(filteredCards, filmsListContainerMain, filters);
  };

  return filterElement;
};

const createFilters = () => {
  return FILTERS_NAMES.map((element)=>createFilter(element));
};

const updateFilters = (filters) => {
  for (let element of filters) {
    const filteredCards = element.toFilter(initialCards, element._name.toLowerCase());
    let dataFilter = {
      name: element._name,
      count: filteredCards.length,
    };
    element.update(dataFilter);
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (element._element === filterActive) {
      renderCards(filteredCards, filmsListContainerMain, filters);
    }
  }
};

const renderCards = (cards, block, filters) => {
  if (!initialCards.length) {
    initialCards = cards.slice(0);
  }

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

      api.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.unrender();
        updateFilters(filters);
      });
    };

    cardPopup.onAddComment = (newData) => {
      if (Object.keys(newData.comment).length) {
        data.comments.push(newData.comment);
      }

      load(true)
        .then(() => {
          //unblock();
          //taskComponent.update(task);
          //taskComponent.render();
          //tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
          //editTaskComponent.unrender();
      })
      .catch(() => {
        cardPopup.shake();
        //unblock()
      });

      api.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.showNewComment();
        toFillFilmsListsExtra(2);
      });
    };

    cardPopup.onAddToWatchList = (newData) => {
      data.watchlist = newData.watchlist;
    };

    cardPopup.onMarkAsWatched = (newData) => {
      data.watched = newData.watched;
    };

    cardPopup.onFavorite = (newData) => {
      data.favorite = newData.favorite;
    };

    cardPopup.onEscPress = () => {
      cardPopup.unrender();
    };
  }

  if (block === filmsListContainerMain) {
    toFillFilmsListsExtra(1);
    toFillFilmsListsExtra(2);
  }
};

const toFillFilmsListsExtra = (numberOfContainer) => {
  // отрисовать карточки в допконтейнерах
  const accessoryArrayCards = initialCards.slice(0);
  if (numberOfContainer === 1) {
    accessoryArrayCards.sort((prev, next) => next.rating - prev.rating);
  } else if (numberOfContainer === 2) {
    accessoryArrayCards.sort((prev, next) => next.comments.length - prev.comments.length);
  }
  renderCards(accessoryArrayCards.slice(0, QUANTITY_CARDS_OF_FILM_LIST_EXTRA), filmsListExtraContainers[numberOfContainer - 1], filters);
};

const listenerClickStatisticBtn = () => {
  statisticsBlock.classList.remove(`visually-hidden`);
  filmsBlock.classList.add(`visually-hidden`);
  displayStatistics(initialCards);
};

const filters = createFilters();
statisticBtn.addEventListener(`click`, listenerClickStatisticBtn);

api.getCards()
  .then((cards) => {
    renderCards(cards, filmsListContainerMain, filters);
    updateFilters(filters);
  });

const load = (isSuccess) => {
  return new Promise((res, rej) => {
    setTimeout(isSuccess ? res : rej, 2000)
  })
}
