import Component from './component';

export default class Card extends Component {
  constructor(data, block) {
    super();
    this._title = data.title;
    this._releaseDate = data.releaseDate;
    this._rating = data.rating;
    this._duration = data.duration;
    this._description = data.description;
    this._genre = data.genre;
    this._poster = data.poster;
    this._comments = data.comments;
    this._block = block;
    this._element = null;
    this._onClick = null;
    this._listener = null;
  }

  _onCardClick(evt) {
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

  get template() {

    const durationInHour = Math.trunc(this._duration / 60);
    const durationInMinutes = this._duration - durationInHour * 60;

    let descriptionBlock = ``;
    let controlsBlock = ``;
    if (!this._block.parentNode.classList.contains(`films-list--extra`)) {
      descriptionBlock = `<p class="film-card__description">${this._description}</p>`;
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
        <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${durationInHour}h&nbsp;${durationInMinutes}m</span>
        <span class="film-card__genre">${this._genre.join(`, `)}</span>
      </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      ${descriptionBlock}
      <button class="film-card__comments">${this._comments.length} comments</button>
      ${controlsBlock}
    </article>`.trim();
  }

  bind() {
    this._listener = this._onCardClick.bind(this);
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._listener);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._listener);
    this._listener = null;
  }
}