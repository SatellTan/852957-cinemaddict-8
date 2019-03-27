import moment from 'moment';
import Component from './component';
import {EMOJIS} from './data-card';

const ESC_KEYCODE = 27;
const ENTER_KEYCODE = 13;

const momentDurationFormatSetup = require(`moment-duration-format`);

export default class CardPopup extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._titleOriginal = data.titleOriginal;
    this._age = data.age;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._releaseDate = data.releaseDate;
    this._country = data.country;
    this._rating = data.rating;
    this._duration = data.duration;
    this._description = data.description;
    this._genre = data.genre;
    this._poster = data.poster;
    this._comments = data.comments.slice();
    this._ownRating = data.ownRating;
    this._watchlist = data.watchlist;
    this._watched = data.watched;
    this._favorite = data.favorite;
    this._element = null;
    this._onClickCloseBtn = null;
    this._listenerClickCloseBtn = null;
    this._onEscPress = null;
    this._onAddComment = null;
    this._listenerKeyDown = null;
    this._onAddToWatchList = null;
    this._listenerClickAddToWatchlistBtn = null;
    this._onMarkAsWatched = null;
    this._listenerClickMarkAsWatchedBtn = null;
    this._onFavorite = null;
    this._listenerClickFavoriteBtn = null;
  }

  _processForm(formData) {
    const entry = {
      comment: {},
      score: ``,
      watchlist: ``,
      watched: ``,
      favorite: ``,
    };
    const cardPopupMapper = CardPopup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (cardPopupMapper[property]) {
        cardPopupMapper[property](value);
      }
    }

    return entry;
  }

  _toGetFormDate() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    return this._processForm(formData);
  }

  _onCardPopupClickCloseBtn(evt) {
    evt.preventDefault();
    const newData = this._toGetFormDate();

    if (typeof this._onClickCloseBtn === `function`) {
      this._onClickCloseBtn(newData);
    }
  }

  _onCardPopupKeyDown(evt) {
    if ((evt.keyCode === ESC_KEYCODE) && (typeof this._onEscPress === `function`)) {

      evt.preventDefault();
      this._onEscPress();

    } else if (evt.ctrlKey && (evt.keyCode === ENTER_KEYCODE)) {

      evt.preventDefault();
      const newData = this._toGetFormDate();

      if (typeof this._onAddComment === `function`) {
        this._onAddComment(newData);
      }
    }
  }

  _onCardPopupClickAddToWatchlistBtn() {
    const newData = this._toGetFormDate();

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(newData);
    }
  }

  _onCardPopupClickMarkAsWatchedBtn() {
    const newData = this._toGetFormDate();

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(newData);
    }
  }

  _onCardPopupClickFavoriteBtn() {
    const newData = this._toGetFormDate();

    if (typeof this._onFavorite === `function`) {
      this._onFavorite(newData);
    }
  }

  get element() {
    return this._element;
  }

  set onClickCloseBtn(fn) {
    this._onClickCloseBtn = fn;
  }

  set onEscPress(fn) {
    this._onEscPress = fn;
  }

  set onAddComment(fn) {
    this._onAddComment = fn;
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

  get template() {

    let ratingBlock = ``;
    for (let i = 1; i < 10; i++) {
      ratingBlock += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${Math.floor(+this._ownRating) === i ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
    }

    let emojisBlock = ``;
    for (const iterator of Object.keys(EMOJIS)) {
      emojisBlock += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${iterator}" value="${iterator}" ${iterator === `neutral-face` ? `checked` : ``}>
      <label class="film-details__emoji-label" for="emoji-${iterator}">${EMOJIS[iterator]}</label>`;
    }

    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

            <p class="film-details__age">${this._age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                <p class="film-details__user-rating">Your rate ${this._ownRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate).format(`D MMMM YYYY`)} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${moment.duration(this._duration, `minutes`).format(`m [min]`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${(Array.from(this._genre).map((genre) => (`
                  <span class="film-details__genre">${genre}</span>`.trim()))).join(` `)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._watchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._watched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._favorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${(Array.from(this._comments).map((comment) => (`
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">${EMOJIS[comment.emotion]}</span>
              <div>
                <p class="film-details__comment-text">${comment.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${comment.author}</span>
                  <span class="film-details__comment-day">${moment(comment.date).format(`D MMMM YYYY`)}</span>
                </p>
              </div>
            </li>`.trim()))).join(``)}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                ${emojisBlock}
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">${this._watched ? `Already watched` : ``}</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${ratingBlock}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`.trim();
  }

  bind() {
    this._listenerClickCloseBtn = this._onCardPopupClickCloseBtn.bind(this);
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._listenerClickCloseBtn);

    this._listenerKeyDown = this._onCardPopupKeyDown.bind(this);
    this._element.parentNode.addEventListener(`keydown`, this._listenerKeyDown);

    this._listenerClickAddToWatchlistBtn = this._onCardPopupClickAddToWatchlistBtn.bind(this);
    this._element.querySelector(`#watchlist`).addEventListener(`click`, this._listenerClickAddToWatchlistBtn);

    this._listenerClickMarkAsWatchedBtn = this._onCardPopupClickMarkAsWatchedBtn.bind(this);
    this._element.querySelector(`#watched`).addEventListener(`click`, this._listenerClickMarkAsWatchedBtn);

    this._listenerClickFavoriteBtn = this._onCardPopupClickFavoriteBtn.bind(this);
    this._element.querySelector(`#favorite`).addEventListener(`click`, this._listenerClickFavoriteBtn);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._listenerClickCloseBtn);
    this._element.parentNode.removeEventListener(`keydown`, this._listenerKeyDown);
    this._element.querySelector(`#watchlist`).removeEventListener(`click`, this._listenerClickAddToWatchlistBtn);
    this._element.querySelector(`#watched`).removeEventListener(`click`, this._listenerClickMarkAsWatchedBtn);
    this._element.querySelector(`#favorite`).removeEventListener(`click`, this._listenerClickFavoriteBtn);
  }

  update(data) {
    this._comments = data.comments.slice();
    this._ownRating = data.ownRating;
    this._watchlist = data.watchlist;
    this._watched = data.watched;
    this._favorite = data.favorite;
  }

  showNewComment() {
    const commentsBlock = this._element.querySelector(`.film-details__comments-list`);
    commentsBlock.innerHTML = `${(Array.from(this._comments).map((comment) => (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">${comment.emotion}</span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${moment(comment.date).format(`D MMMM YYYY`)}</span>
        </p>
      </div>
    </li>`.trim()))).join(``)}`;
    commentsBlock.previousElementSibling.innerHTML = `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>`;
  }

  static createMapper(target) {
    const addNewComment = (value) => {
      if (value) {
        const newComment = {
          emotion: EMOJIS[document.querySelector(`.film-details__emoji-item:checked`).value],
          comment: value,
          author: `Me`,
          date: new Date(),
        };
        target.comment = newComment;
      }
    };

    return {
      comment: (value) => {
        if (value) {
          addNewComment(value);
        }
      },
      score: (value) => {
        if (value) {
          target.score = value;
        }
      },
      watchlist: (value) => {
        if (value) {
          target.watchlist = value;
        }
      },
      watched: (value) => {
        if (value) {
          target.watched = value;
        }
      },
      favorite: (value) => {
        if (value) {
          target.favorite = value;
        }
      },
    };
  }

}
