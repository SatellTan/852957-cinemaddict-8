
const MAX_CARDS = 10;

export default (name) => {
  return {
    name,
    count: Math.floor(Math.random() * (MAX_CARDS)),
    active: false,
  };
};
