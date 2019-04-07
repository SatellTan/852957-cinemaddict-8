import generateDataFilter from './data-filter';
import Card from './card';
import CardPopup from './card-popup';
import Filter from './filter';
import displayStatistics from './statistic';
import {UserCategory} from './data-total';
import API from './api';

const FILTERS_NAMES = [`Favorites`, `History`, `Watchlist`, `All movies`];
const QUANTITY_CARDS_IN_FILM_LIST_EXTRA = 2;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const ANIMATION_TIMEOUT = 600;
const LOAD_ERROR_MASSAGE_TIMEOUT = 6000;
const AMOUNT_CARDS_IN_ITERATION = 5;
const TOPRATED_CARDSLIST_CONTAINER = 1;
const MOSTCOMMENTED_CARDSLIST_CONTAINER = 2;
const MAX_FOR_NOVICE = 10;
const MAX_FOR_FAN = 20;

const filmsBlock = document.querySelector(`.films`);
const filmsListContainerMain = filmsBlock.querySelector(`.films-list .films-list__container`);
const filmsListExtraContainers = filmsBlock.querySelectorAll(`.films-list--extra .films-list__container`);
const statisticsBlock = document.querySelector(`.statistic`);
const statisticBtn = document.querySelector(`.main-navigation__item--additional`);
const filmPopupContainer = document.querySelector(`body`);
const filtersContainer = document.querySelector(`.main-navigation`);
const loadMessage = document.querySelector(`.preloader`);
const loadMessageTextContainer = document.querySelector(`.preloader-text`);
const footerStatistics = document.querySelector(`.footer__statistics p`);
const profileRating = document.querySelector(`.profile__rating`);
const searchField = document.querySelector(`.search__field`);
const showMoreBtn = filmsBlock.querySelector(`.films-list__show-more`);
let initialCards = [];
let outputCards = [];
let displayedCardsIndex;
let filters;
let noFiltering;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const shake = (element) => {
  element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, ANIMATION_TIMEOUT);
};

const getUserCategory = (cards) => {
  const watchedCards = cards.filter((it) => it.watched);
  const count = watchedCards.length;
  if (count <= MAX_FOR_NOVICE) {
    return UserCategory[1];
  } else if (count > MAX_FOR_NOVICE && count <= MAX_FOR_FAN) {
    return UserCategory[2];
  }
  return UserCategory[3];
};

const createFilter = (name) => {
  const data = generateDataFilter(name);

  const filterElement = new Filter(data);
  filterElement.render(filtersContainer);
  const filteredCards = filterElement.toFilter(initialCards, name.toLowerCase());
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

    filmsBlock.classList.remove(`visually-hidden`);
    statisticsBlock.classList.add(`visually-hidden`);

    outputCards = filterElement.toFilter(initialCards, filterElement._name.toLowerCase());
    data.count = (filterElement._name === `All movies`) ? `` : outputCards.length;
    filterElement.update(data);
    filterElement.element.classList.add(`main-navigation__item--active`);
    displayedCardsIndex = 0;
    renderCards(outputCards, filmsListContainerMain);
  };

  return filterElement;
};

const createFilters = () => {
  return FILTERS_NAMES.map((element)=>createFilter(element));
};

const updateFilters = () => {
  for (const element of filters) {
    const filteredCards = element.toFilter(initialCards, element._name.toLowerCase());
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
      const openCardPopup = document.querySelector(`.film-details`);
      if (openCardPopup) {
        openCardPopup.parentNode.removeChild(openCardPopup);
      }
      cardPopup.render(filmPopupContainer);
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
      api.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        updateFilters();
      });
    };

    cardPopup.onClickCloseBtn = (newData) => {
      data.ownRating = newData.score;

      api.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.unrender();
        updateFilters();
      });
    };

    cardPopup.onAddComment = (newData) => {
      if (Object.keys(newData.comment).length) {
        data.comments.push(newData.comment);
      }

      const commentInput = cardPopup.element.querySelector(`.film-details__comment-input`);
      commentInput.style.border = `1px solid initial`;
      commentInput.disabled = true;
      api.updateCard({id: data.id, data: data.toRAW()})
      .then((newCard) => {
        cardPopup.update(newCard);
        cardElement.update(newCard);
        cardPopup.updateCommentsBlock();
        commentInput.value = ``;
        commentInput.disabled = false;
        cardPopup.element.querySelector(`.film-details__user-rating-controls`).classList.remove(`visually-hidden`);
        toFillFilmsListsExtra(MOSTCOMMENTED_CARDSLIST_CONTAINER);
      })
      .catch(() => {
        commentInput.disabled = false;
        commentInput.style.border = `2px solid red`;
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
    };

    cardPopup.onDeleteComment = () => {
      if (data.comments[data.comments.length - 1].author === `Me`) {
        const lastUserComment = data.comments[data.comments.length - 1];
        data.comments.pop();
        api.updateCard({id: data.id, data: data.toRAW()})
        .then((newCard) => {
          cardPopup.update(newCard);
          cardElement.update(newCard);
          cardPopup.updateCommentsBlock();
          cardPopup.element.querySelector(`.film-details__user-rating-controls`).classList.add(`visually-hidden`);
          toFillFilmsListsExtra(MOSTCOMMENTED_CARDSLIST_CONTAINER);
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
  // отрисовать карточки в допконтейнерах
  const accessoryArrayCards = initialCards.slice(0);
  if (numberOfContainer === 1) {
    accessoryArrayCards.sort((prev, next) => next.rating - prev.rating);
  } else if (numberOfContainer === 2) {
    accessoryArrayCards.sort((prev, next) => next.comments.length - prev.comments.length);
  }
  renderCards(accessoryArrayCards.slice(0, QUANTITY_CARDS_IN_FILM_LIST_EXTRA), filmsListExtraContainers[numberOfContainer - 1]);
};

const listenerClickStatisticBtn = () => {
  statisticsBlock.classList.remove(`visually-hidden`);
  filmsBlock.classList.add(`visually-hidden`);
  displayStatistics(initialCards);
};

const listenerClickOnSearchField = () => {
  const filterActive = document.querySelector(`.main-navigation__item--active`);
  if (filterActive.textContent !== `All movies`) {
    filterActive.classList.remove(`main-navigation__item--active`);
    noFiltering.classList.add(`main-navigation__item--active`);

    outputCards = initialCards;
    displayedCardsIndex = 0;
    renderCards(initialCards, filmsListContainerMain);
  }
};

const listenerChangesOnSearchField = () => {
  outputCards = initialCards.filter((it) => it.title.toLowerCase().includes(searchField.value.toLowerCase()));
  displayedCardsIndex = 0;
  renderCards(outputCards, filmsListContainerMain);
};

const listenerClickOnShowMoreBtn = () => {
  renderCards(outputCards, filmsListContainerMain);
};

const getStarted = () => {
  filters = createFilters();
  statisticBtn.addEventListener(`click`, listenerClickStatisticBtn);
  searchField.addEventListener(`click`, listenerClickOnSearchField);
  searchField.addEventListener(`input`, listenerChangesOnSearchField);
  showMoreBtn.addEventListener(`click`, listenerClickOnShowMoreBtn);
  loadMessageTextContainer.textContent = `Loading movies...`;
  loadMessageTextContainer.style.width = `260px`;
  api.getCards()
    .then((cards) => {
      console.log(cards);
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
