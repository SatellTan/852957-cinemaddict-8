import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const statisticsBlock = document.querySelector(`.statistic`);

const getTemplateStatistic = (cards, topGenre) => {

  let totalDuration = 0;
  if (cards.length) {
    totalDuration = cards.reduce((a, b) => {
      return (parseFloat(a) || 0) + (parseFloat(b.duration) || 0);
    }, 0);
  }

  return `
    <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters visually-hidden">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${cards.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${moment.duration(totalDuration, `milliseconds`).hours()}<span class="statistic__item-description">h</span>${moment.duration(totalDuration, `milliseconds`).minutes()}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  `;
};

const displayChart = (resultGenres) => {
  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * Object.values(resultGenres).length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(resultGenres),
      datasets: [{
        data: Object.values(resultGenres),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default (cards) => {
  const resultCards = cards.filter((it) => it.watched);

  let totalGenres = [];
  if (resultCards.length) {
    totalGenres = resultCards.reduce((a, b) => {
      return a.concat(b.genre); // a.push(...b.genre);//a.push.apply(a, b.genre);
    }, []);
  }

  const resultGenres = totalGenres.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  let arrayValues = Object.values(resultGenres);
  let topGenre = Object.keys(resultGenres)[arrayValues.indexOf(Math.max(...arrayValues))];

  statisticsBlock.innerHTML = getTemplateStatistic(resultCards, topGenre);
  displayChart(resultGenres);
};
