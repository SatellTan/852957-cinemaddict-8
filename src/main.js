import generateDataFilter from './data-filter';
import Card from './card';
import CardPopup from './card-popup';
import Filter from './filter';
import FilterStatistic from './filter-statistic';
import Search from './search';
import displayStatistics from './statistic';
import {FILTERS_NAMES} from './data-total';
import {USER_CATEGORY} from './data-total';
import {USER_NAME} from './data-total';
import {FILTERS_STATISTIC_NAMES} from './data-total';
import API from './api';
import Provider from './provider';
import Store from './store';

const QUANTITY_CARDS_IN_FILM_LIST_EXTRA = 2;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=4`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const CARDS_STORE_KEY = `cards-store-key`;
const ANIMATION_TIMEOUT = 600;
const LOAD_ERROR_MASSAGE_TIMEOUT = 6000;
const AMOUNT_CARDS_IN_ITERATION = 5;
const TOPRATED_CARDSLIST_CONTAINER = 1;
const MOSTCOMMENTED_CARDSLIST_CONTAINER = 2;

const filmsBlock = document.querySelector(`.films`);
const filmsListContainerMain = filmsBlock.querySelector(`.films-list .films-list__container`);
const filmsListExtraContainers = filmsBlock.querySelectorAll(`.films-list--extra .films-list__container`);
const statisticsBlock = document.querySelector(`.statistic`);
const statisticBtn = document.querySelector(`.main-navigation__item--additional`);
const filmPopupContainer = document.querySelector(`body`);
const filtersContainer = document.querySelector(`.main-navigation`);
const filtersStatisticContainer = document.querySelector(`.statistic__filters`);
const loadMessage = document.querySelector(`.preloader`);
const loadMessageTextContainer = document.querySelector(`.preloader-text`);
const footerStatistics = document.querySelector(`.footer__statistics p`);
const profileRating = document.querySelector(`.profile__rating`);
const searchBlock = document.querySelector(`.header__search`);
const showMoreBtn = filmsBlock.querySelector(`.films-list__show-more`);
let initialCards = [];
let outputCards = [];
let displayedCardsIndex;
let filters;
let filtersStatistic;
let noFiltering;
let openedCardPopup = null;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: CARDS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncCards();
});

const shake = (element) => {
  element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, ANIMATION_TIMEOUT);
};

const getUserCategory = (cards) => {
  const watchedCards = cards.filter((it) => it.watched);
  let result = ``;
  Object.entries(USER_CATEGORY).every(([minimum, category]) => {
    if (minimum <= watchedCards.length) {
      result = category;
      return true;
    }
    return false;
  });

  return result;
};

const createFilter = (name) => {
  const data = generateDataFilter(name);

  const filterElement = new Filter(data);
  filterElement.render(filtersContainer, `afterbegin`);
  const filteredCards = Filter.toFilter(initialCards, name.toLowerCase());
  data.count = filteredCards.length;
  filterElement.update(data);
  if (filterElement._name === `All movies`) {
    noFiltering = filterElement._element;
    filterElement.element.classList.add(`main-navigation__item--active`);
  }

  filterElement.onClick = () => {
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (filterActive) {
      filterActive.classList.remove(`main-navigation__item--active`);
    }

    if (filmsBlock.classList.contains(`visually-hidden`)) {
      filtersStatistic.map((element)=>element.unrender());
      filmsBlock.classList.remove(`visually-hidden`);
      statisticsBlock.classList.add(`visually-hidden`);
    }

    outputCards = Filter.toFilter(initialCards, filterElement._name.toLowerCase());
    data.count = (filterElement._name === `All movies`) ? `` : outputCards.length;
    filterElement.update(data);
    filterElement.element.classList.add(`main-navigation__item--active`);
    displayedCardsIndex = 0;
    renderCards(outputCards, filmsListContainerMain);
  };

  return filterElement;
};

const createFilterStatistic = (name) => {
  const filterStatisticElement = new FilterStatistic(name);

  filterStatisticElement.onClick = () => {
    const resultCards = FilterStatistic.toFilter(initialCards, filterStatisticElement._name.toLowerCase());
    displayStatistics(resultCards);
  };

  return filterStatisticElement;
};

const createFilters = () => {
  return FILTERS_NAMES.map((element)=>createFilter(element));
};

const updateFilters = () => {
  for (const element of filters) {
    const filteredCards = Filter.toFilter(initialCards, element._name.toLowerCase());
    let filterCount = filteredCards.length;
    if (element._name === `All movies`) {
      filterCount = ``;
    }
    const dataFilter = {
      name: element._name,
      count: filterCount,
    };
    element.update(dataFilter);
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (element._element === filterActive) {
      outputCards = filteredCards;
      displayedCardsIndex = 0;
      renderCards(outputCards, filmsListContainerMain);
    }
  }
  profileRating.textContent = getUserCategory(initialCards);
};

const createSearch = () => {
  const searchElement = new Search();
  searchElement.render(searchBlock);

  searchElement.onClick = () => {
    const filterActive = document.querySelector(`.main-navigation__item--active`);
    if (filterActive.textContent !== `All movies`) {
      filterActive.classList.remove(`main-navigation__item--active`);
      noFiltering.classList.add(`main-navigation__item--active`);

      outputCards = initialCards;
      displayedCardsIndex = 0;
      renderCards(initialCards, filmsListContainerMain);
    }
  };

  searchElement.onInput = () => {
    outputCards = initialCards.filter((it) => it.title.toLowerCase().includes(searchElement._element.value.toLowerCase()));
    displayedCardsIndex = 0;
    renderCards(outputCards, filmsListContainerMain);
  };

  searchElement.onChange = () => {
    searchElement._element.value = ``;
  };
};

const renderCards = (cards, block) => {
  block.innerHTML = ``;
  let endCardsListIndex = cards.length;

  if (block === filmsListContainerMain) {
    if (displayedCardsIndex === 0) {
      showMoreBtn.classList.remove(`visually-hidden`);
    }
    endCardsListIndex = Math.min(displayedCardsIndex + AMOUNT_CARDS_IN_ITERATION, cards.length);
    displayedCardsIndex = endCardsListIndex;
    if (endCardsListIndex === cards.length) {
      showMoreBtn.classList.toggle(`visually-hidden`);
    }
  }

  for (let i = 0; i < endCardsListIndex; i++) {
    const data = cards[i];
    const cardElement = new Card(data);
    const cardPopup = new CardPopup(data);
    cardElement.blockOfCard = block;
    cardElement.render(cardElement.block);

    cardElement.onClickComments = () => {
      if (openedCardPopup) {
        openedCardPopup.unrender();
      }
      cardPopup.render(filmPopupContainer);
      openedCardPopup = cardPopup;
      cardPopup.updateCommentsBlock();
    };

    cardElement.onAddToWatchList = () => {
      if (!data.watchlist) {
        data.watchlist = true;
        updateData();
      }
    };

    cardElement.onMarkAsWatched = () => {
      if (!data.watched) {
        data.watched = true;
        updateData();
      }
    };

    cardElement.onFavorite = () => {
      data.favorite = !data.favorite;
      updateData();
    };

    const updateData = () => {
      provider.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        updateFilters();
      });
    };

    cardPopup.onClickCloseBtn = (newData) => {
      data.ownRating = newData.score;

      provider.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.unrender();
        openedCardPopup = null;
        toFillFilmsListsExtra(MOSTCOMMENTED_CARDSLIST_CONTAINER);
        updateFilters();
      });
    };

    cardPopup.onAddComment = (newData) => {
      if (Object.keys(newData.comment).length) {
        data.comments.push(newData.comment);
      }

      const commentInput = cardPopup.element.querySelector(`.film-details__comment-input`);
      commentInput.disabled = true;
      provider.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.updateCommentsBlock();
        commentInput.value = ``;
        commentInput.disabled = false;
        cardPopup.element.querySelector(`.film-details__watched-reset`).classList.remove(`visually-hidden`);
        cardPopup.element.querySelector(`.film-details__watched-status`).textContent = `Comment added`;
      })
      .catch(() => {
        commentInput.disabled = false;
        shake(commentInput);
        data.comments.pop();
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
      openedCardPopup = null;
      toFillFilmsListsExtra(MOSTCOMMENTED_CARDSLIST_CONTAINER);
    };

    cardPopup.onDeleteComment = () => {
      if (data.comments[data.comments.length - 1].author === USER_NAME) {
        const lastUserComment = data.comments[data.comments.length - 1];
        data.comments.pop();
        provider.updateCard({id: data.id, data: data.toRAW()})
        .then((newCard) => {
          cardPopup.update(newCard);
          cardElement.update(newCard);
          cardPopup.updateCommentsBlock();
          cardPopup.element.querySelector(`.film-details__watched-reset`).classList.add(`visually-hidden`);
          cardPopup.element.querySelector(`.film-details__watched-status`).textContent = `Comment deleted`;
        })
        .catch(() => {
          data.comments.push(lastUserComment);
        });
      }
    };
  }

  if (block === filmsListContainerMain) {
    toFillFilmsListsExtra(TOPRATED_CARDSLIST_CONTAINER);
    toFillFilmsListsExtra(MOSTCOMMENTED_CARDSLIST_CONTAINER);
  }
};

const toFillFilmsListsExtra = (numberOfContainer) => {
  const accessoryArrayCards = initialCards.slice(0);
  if (numberOfContainer === 1) {
    accessoryArrayCards.sort((prev, next) => next.rating - prev.rating);
  } else if (numberOfContainer === 2) {
    accessoryArrayCards.sort((prev, next) => next.comments.length - prev.comments.length);
  }
  renderCards(accessoryArrayCards.slice(0, QUANTITY_CARDS_IN_FILM_LIST_EXTRA), filmsListExtraContainers[numberOfContainer - 1]);
};

const listenerClickStatisticBtn = () => {
  if (statisticsBlock.classList.contains(`visually-hidden`)) {
    filtersStatistic.map((element)=>element.render(filtersStatisticContainer));
    statisticsBlock.classList.remove(`visually-hidden`);
    filmsBlock.classList.add(`visually-hidden`);
  }
  const resultCards = initialCards.filter((it) => it.watched);
  displayStatistics(resultCards);
};

const listenerClickOnShowMoreBtn = () => {
  renderCards(outputCards, filmsListContainerMain);
};

const getStarted = () => {
  filters = createFilters();
  filtersStatistic = FILTERS_STATISTIC_NAMES.map((element)=>createFilterStatistic(element));
  createSearch();
  statisticBtn.addEventListener(`click`, listenerClickStatisticBtn);
  showMoreBtn.addEventListener(`click`, listenerClickOnShowMoreBtn);
  loadMessageTextContainer.textContent = `Loading movies...`;
  loadMessageTextContainer.style.width = `260px`;
  provider.getCards()
    .then((cards) => {
      initialCards = cards.slice(0);
      renderCards(initialCards, filmsListContainerMain);
      updateFilters();
      footerStatistics.textContent = `${cards.length.toLocaleString()} movies inside`;
      loadMessage.classList.add(`visually-hidden`);
    })
    .catch(() => {
      loadMessageTextContainer.style.width = `640px`;
      loadMessageTextContainer.textContent = `Something went wrong while loading movies. Check your connection or try again later`;
      setTimeout(() => {
        loadMessage.classList.remove(`visually-hidden`);
      }, LOAD_ERROR_MASSAGE_TIMEOUT);
    });
};

getStarted();
