const ALL_FILMS = [
  `На море!`,
  `Географ глобус пропил`,
  `Любовь и голуби`,
  `Мажор`,
  `Полицейский с Рублевки`,
  `Секретный фарватер`,
  `Друзья`,
  `Пятый элемент`,
  `Метро`,
  `Ночная смена`,
  `Огни большого города`,
  `Приходи на меня посмотреть`,
  `Ван-Хельсинг`,
  `Мумия`,
  `Пираты карибского моря`,
];

const DESCRIPTION_OPTIONS = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const COUNTRYS = [
  `Canada`,
  `USA`,
  `Russia`,
  `France`,
  `Argentina`,
  `China`,
  `Japan`,
];

const ALL_POSTERS = [
  `./images/posters/accused.jpg`,
  `./images/posters/blackmail.jpg`,
  `./images/posters/blue-blazes.jpg`,
  `./images/posters/fuga-da-new-york.jpg`,
  `./images/posters/moonrise.jpg`,
  `./images/posters/three-friends.jpg`,
];

const ALL_GENRE = [
  `Thriller`,
  `Comedy`,
  `Action`,
  `Fantastic`,
  `Detective`,
  `Drama`,
  `Historical`,
];

const PEOPLE = [
  `Samuel L. Jackson`,
  `Catherine Keener`,
  `Sophia Bush`,
  `Brad Bird`,
  `Tim Macoveev`,
  `Meryl Streep`,
  `Anne Hathaway`,
  `Johnny Depp`,
  `Harrison Ford`,
  `Steven Spielberg`,
];

export const EMOJI = {
  "sleeping": `😴`,
  "neutral-face": `😐`,
  "grinning": `😀`,
};

const MAX_SENTENCES_IN_DESCRIPTION = 4;
const MAX_AGE_LIMIT = 18;
const MAX_NUMBER_MEN = 3;

const allComments = [
  `Отлично`,
  `Класс`,
  `Отстой`,
  `Ниче-так`,
  `Один раз посмотреть можно`,
  `Скушнотища`,
  `Очень интересно`,
  `Чуть не уснули, не стали досматривать`,
  `Хороший добрый фильм`,
  `Понравилось`,
  `Супер`,
  `Нормально`,
  `Не понравилось`,
  `Подойдет для детей`,
];

const proffers = DESCRIPTION_OPTIONS.split(`. `);

const generateRandomNumber = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
};

const getArrayOfUniqueValues = (number, sourceArray) => {
  const resultArray = [];
  const tmpArray = sourceArray.slice();
  for (let i = 0; i < number; i++) {
    const index = generateRandomNumber(tmpArray.length);
    resultArray.push(tmpArray[index]);
    tmpArray.splice(index, 1);
  }
  return resultArray;
};

const createDescription = () => {
  const descriptionArray = getArrayOfUniqueValues(generateRandomNumber(MAX_SENTENCES_IN_DESCRIPTION), proffers);
  return `${descriptionArray.join(`. `)}${descriptionArray.length ? `.` : ``}`;
};

const createDate = (number) => {
  return new Date(Date.now() + 1 + (generateRandomNumber(number) - number) * 24 * 60 * 60 * 1000);
};

const createComments = (number) => {
  const textCommentsArray = getArrayOfUniqueValues(number, allComments);
  const commentsArray = [];
  const emojiKeys = Object.keys(EMOJI);
  for (const element of textCommentsArray) {
    const comment = {
      emoji: EMOJI[emojiKeys[generateRandomNumber(emojiKeys.length)]],
      text: element,
      author: PEOPLE[generateRandomNumber(PEOPLE.length)],
      date: createDate(100),
    };
    commentsArray.push(comment);
  }

  return commentsArray;
};

export default () => {
  const film = {
    title: ALL_FILMS[generateRandomNumber(ALL_FILMS.length)],
    titleOriginal: ALL_FILMS[generateRandomNumber(ALL_FILMS.length)],
    age: generateRandomNumber(MAX_AGE_LIMIT),
    director: PEOPLE[generateRandomNumber(PEOPLE.length)],
    writers: getArrayOfUniqueValues(generateRandomNumber(MAX_NUMBER_MEN) + 1, PEOPLE),
    actors: getArrayOfUniqueValues(generateRandomNumber(MAX_NUMBER_MEN) + 1, PEOPLE),
    releaseDate: createDate(1000),
    country: COUNTRYS[generateRandomNumber(COUNTRYS.length)],
    rating: generateRandomNumber(100) / 10,
    duration: (generateRandomNumber(40) + 90) * 60 * 1000,
    genre: getArrayOfUniqueValues(generateRandomNumber(2) + 1, ALL_GENRE),
    poster: ALL_POSTERS[generateRandomNumber(ALL_POSTERS.length)],
    description: createDescription(),
    comments: createComments(generateRandomNumber(allComments.length)),
    ownRating: 0,
  };

  return film;
};
