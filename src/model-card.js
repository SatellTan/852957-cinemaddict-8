export default class ModelCard {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.actors = data.film_info[`actors`];
    this.age = data.film_info[`age_rating`];
    this.titleOriginal = data.film_info[`alternative_title`] || ``;
    this.description = data.film_info[`description`] || ``;
    this.director = data.film_info[`director`] || ``;
    this.genre = data.film_info[`genre`];
    this.poster = data.film_info[`poster`] || ``;
    this.releaseDate = data.film_info.release[`date`];
    this.country = data.film_info.release[`release_country`];
    this.duration = data.film_info[`runtime`];
    this.title = data.film_info[`title`] || ``;
    this.rating = data.film_info[`total_rating`];
    this.writers = data.film_info[`writers`];
    this.watched = data.user_details[`already_watched`];
    this.favorite = data.user_details[`favorite`];
    this.ownRating = Math.floor(data.user_details[`personal_rating`]);
    this.watchingDate = data.user_details['watching_date'];
    this.watchlist = data.user_details[`watchlist`];
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': [...this.comments.values()],
      'film_info': {
        'actors': [...this.actors.values()],
        'age_rating': this.age,
        'alternative_title': this.titleOriginal,
        'description': this.description,
        'director': this.director,
        'genre': [...this.genre.values()],
        'poster': this.poster,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country,
        },
        'runtime': this.duration,
        'title': this.title,
        'total_rating': this.rating,
        'writers': [...this.writers.values()],
      },
      'user_details': {
        'already_watched': this.watched,
        'favorite': this.favorite,
        'personal_rating': this.ownRating,
        'watching_date': this.watchingDate,
        'watchlist': this.watchlist,
      },
    };
  }

  static parseCard(data) {
    return new ModelCard(data);
  }

  static parseCards(data) {
    return data.map(ModelCard.parseCard);
  }
}
