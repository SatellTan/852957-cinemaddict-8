import moment from 'moment';
import 'moment-duration-format';
import Component from './component';

export default class Card extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._releaseDate = data.releaseDate;
    this._rating = data.rating;
    this._duration = data.duration;
    this._description = data.description;
    this._genre = data.genre;
    this._poster = data.poster;
    this._comments = data.comments.slice();
    this.block = null;
    this._element = null;
    this._onClickComments = null;
    this._listenerClickComments = null;
    this._onAddToWatchList = null;
    this._listenerClickAddToWatchlistBtn = null;
    this._onMarkAsWatched = null;
    this._listenerClickMarkAsWatchedBtn = null;
    this._onFavorite = null;
    this._listenerClickFavoriteBtn = null;
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
    const newElement = this._element.parentElement.insertBefore(this._element.firstChild, this._element);
    this._element.remove();
    this._element = newElement;
  }

  _onCardClickAddToWatchlistBtn() {
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList();
    }
  }

  _onCardClickMarkAsWatchedBtn() {
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched();
    }
  }

  _onCardClickFavoriteBtn() {
    if (typeof this._onFavorite === `function`) {
      this._onFavorite();
    }
  }

  _onCardClickComments(evt) {
    evt.preventDefault();
    if (typeof this._onClickComments === `function`) {
      this._element.querySelector(`.film-card__comments`).blur();
      this._onClickComments();
    }
  }

  get element() {
    return this._element;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onFavorite(fn) {
    this._onFavorite = fn;
  }

  set onClickComments(fn) {
    this._onClickComments = fn;
  }

  set blockOfCard(param) {
    this.block = param;
  }

  get template() {

    let controlsBlock = ``;
    if (!this.block.parentNode.classList.contains(`films-list--extra`)) {
      controlsBlock = `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>`;
    }

    return `
    <article class="film-card">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h [h] m [min]`)}</span>
        <span class="film-card__genre">${this._genre.join(`, `)}</span>
      </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${this._description}</p>
      <button class="film-card__comments">${this._comments.length} comments</button>
      ${controlsBlock}
    </article>`.trim();
  }

  bind() {
    this._listenerClickComments = this._onCardClickComments.bind(this);
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._listenerClickComments);
    if (!this.block.parentNode.classList.contains(`films-list--extra`)) {
      this._listenerClickAddToWatchlistBtn = this._onCardClickAddToWatchlistBtn.bind(this);
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._listenerClickAddToWatchlistBtn);

      this._listenerClickMarkAsWatchedBtn = this._onCardClickMarkAsWatchedBtn.bind(this);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._listenerClickMarkAsWatchedBtn);

      this._listenerClickFavoriteBtn = this._onCardClickFavoriteBtn.bind(this);
      this._element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._listenerClickFavoriteBtn);
    }
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._listenerClickComments);
    if (!this.block.parentNode.classList.contains(`films-list--extra`)) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).removeEventListener(`click`, this._listenerClickAddToWatchlistBtn);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`).removeEventListener(`click`, this._listenerClickMarkAsWatchedBtn);
      this._element.querySelector(`.film-card__controls-item--favorite`).removeEventListener(`click`, this._listenerClickFavoriteBtn);
    }
  }

  update(data) {
    this._comments = data.comments.slice();
    this.unbind();
    this._partialUpdate();
    this.bind();
  }
}
