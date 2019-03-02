export default (block, film) => {

  const durationInHour = Math.trunc(film.duration / 60);
  const durationInMinutes = film.duration - durationInHour * 60;

  let descriptionBlock = ``;
  let controlsBlock = ``;
  if (!block.parentNode.classList.contains(`films-list--extra`)) {
    descriptionBlock = `<p class="film-card__description">${film.description}</p>`;
    controlsBlock = `
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>`;
  }

  const templateCardText = `
  <article class="film-card">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${durationInHour}h&nbsp;${durationInMinutes}m</span>
      <span class="film-card__genre">${film.genre}</span>
    </p>
    <img src="${film.poster}" alt="" class="film-card__poster">
    ${descriptionBlock}
    <button class="film-card__comments">${film.comments.length} comments</button>
    ${controlsBlock}
  </article>`;

  block.insertAdjacentHTML(`beforeend`, templateCardText);
};
