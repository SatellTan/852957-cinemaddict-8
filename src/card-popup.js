import Component from './component';

const ESC_KEYCODE = 27;

export default class Card extends Component {
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
    this._comments = data.comments;
    this._element = null;
    this._onClick = null;
    this._listenerClick = null;
    this._onEscPress = null;
    this._listenerEsc = null;
  }

  _onEscPress(evt) {
    evt.preventDefault();
    if (evt.keyCode === ESC_KEYCODE && typeof this._onEscPress === `function`) {
      this._onEscPress();
    }
  }

  _onCardPopupClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onEscPress(fn) {
    this._onEscPress = fn;
  }

  get template() {

    let rating = ``;
    for (let i = 1; i < 10; i++) {
      rating += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === 5 ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`;
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
                <p class="film-details__user-rating">Your rate 8</p>
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
                <td class="film-details__cell">${this._releaseDate.getDate()} ${this._releaseDate.toLocaleString(`en-us`, {month: `long`})} ${this._releaseDate.getFullYear()} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration} min</td>
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
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${(Array.from(this._comments).map((comment) => (`
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">${comment.emoji}</span>
              <div>
                <p class="film-details__comment-text"${comment.text}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${comment.author}</span>
                  <span class="film-details__comment-day">${comment.date.getDate()} ${comment.date.toLocaleString(`en-us`, {month: `long`})} ${comment.date.getFullYear()}</span>
                </p>
              </div>
            </li>`.trim()))).join(``)}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
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
                ${rating}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`.trim();
  }

  bind() {
    this._listenerClick = this._onCardPopupClick.bind(this);
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._listenerClick);

    this._listenerEsc = this._onEscPress.bind(this);
    this._element.parentNode.addEventListener(`keydown`, this._listenerEsc);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._listenerClick);
    this._listenerClick = null;

    this._element.parentNode.removeEventListener(`keydown`, this._listenerEsc);
    this._listenerEsc = null;
  }
}
