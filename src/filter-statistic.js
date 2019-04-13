import Component from './component';
import createElement from './create-element';
import moment from 'moment';

export default class FilterStatistic extends Component {
  constructor(name) {
    super();
    this._name = name;
    this._onClick = null;
    this._listener = null;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    const nameLowCase = this._name.toLowerCase().split(` `).join(`-`);
    return `
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${nameLowCase}" value="${nameLowCase}" ${this._name === `All time` ? ` checked` : ``}>
      <label for="statistic-${nameLowCase}" class="statistic__filters-label">${this._name}</label>
    `.trim();
  }

  toFilter(cards, filterName) {

    switch (filterName) {
      case `all time`:
        return cards.filter((it) => it.watched);

      case `today`:
        return cards.filter((it) => moment(it.watchingDate).isAfter(moment().startOf(`day`)));

      case `week`:
        return cards.filter((it) => moment(it.watchingDate).isAfter(moment().subtract(7, `days`)));

      case `month`:
        return cards.filter((it) => moment(it.watchingDate).isAfter(moment().subtract(1, `months`)));

      case `year`:
        return cards.filter((it) => moment(it.watchingDate).isAfter(moment().subtract(1, `year`)));

      default: return cards.filter((it) => it.watched);
    }
  }

  _onFilterClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  render(container) {
    this._element = createElement(this.template, container, `beforeend`);
    this.bind();
    return this._element;
  }

  bind() {
    this._listener = this._onFilterClick.bind(this);
    this._element.addEventListener(`click`, this._listener);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._listener);
  }

}
