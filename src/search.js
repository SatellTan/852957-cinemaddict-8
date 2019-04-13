import Component from './component';
import createElement from './create-element';

export default class Search extends Component {
  constructor() {
    super();
    this._onClick = null;
    this._listenerClick = null;
    this._onInput = null;
    this._listenerInput = null;
    this._onChange = null;
    this._listenerChange = null;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onInput(fn) {
    this._onInput = fn;
  }

  set onChange(fn) {
    this._onChange = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `<input type="text" name="search" class="search__field" placeholder="Search">`;
  }

  _onSearchClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  _onSearchInput() {
    if (typeof this._onInput === `function`) {
      this._onInput();
    }
  }

  _onSearchChange() {
    if (typeof this._onChange === `function`) {
      this._onChange();
    }
  }

  render(container) {
    this._element = createElement(this.template, container, `afterbegin`);
    this.bind();
    return this._element;
  }

  bind() {
    this._listenerClick = this._onSearchClick.bind(this);
    this._element.addEventListener(`click`, this._listenerClick);
    this._listenerInput = this._onSearchInput.bind(this);
    this._element.addEventListener(`input`, this._listenerInput);
    this._listenerChange = this._onSearchChange.bind(this);
    this._element.addEventListener(`change`, this._listenerChange);
  }

  unbind() {
    this._element.addEvenetListener(`click`, this._listenerClick);
    this._element.addEvenetListener(`input`, this._listenerInput);
    this._element.addEvenetListener(`change`, this._listenerChange);
  }
}
