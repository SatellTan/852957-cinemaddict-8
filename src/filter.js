import Component from './component';
import createElement from './create-element';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._count = data.count;
    this._onClick = null;
    this._listener = null;
  }

  _partialUpdate() {
    this._element.innerHTML = this._count ? `${this._name}<span class="main-navigation__item-count">${this._count}</span>` : `${this._name}`;
  }

  get element() {
    return this._element;
  }

  _onFilterClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `
    <a href="#${this._name.toLowerCase()}" class="main-navigation__item">${this._name}
    ${this._count !== 0 ? `<span class="main-navigation__item-count">${this._count}</span>` : ``}</a>
    `.trim();
  }

  render(container) {
    this._element = createElement(this.template, container, `afterbegin`);
    this.bind();
    return this._element;
  }

  bind() {
    this._listener = this._onFilterClick.bind(this);
    this._element.addEventListener(`click`, this._listener);
  }

  unbind() {
    this._element.addEvenetListener(`click`, this._listener);
  }

  update(data) {
    this._count = data.count;
    this._partialUpdate();
  }

  toFilter(cards, filterName) {

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
  }
}
