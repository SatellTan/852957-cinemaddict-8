import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const statisticsBlock = document.querySelector(`.statistic`);

const getTemplateStatistic = (cards, topGenre) => {

  let totalDuration = 0;
  if (cards.length) {
    totalDuration = cards.reduce((a, b) => {
      return (a || 0) + (b.duration || 0);
    }, 0);
  }

  return `
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${cards.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${moment.duration(totalDuration, `minutes`).format(`h`, {trunc: true})}<span class="statistic__item-description">h</span>${moment.duration(totalDuration, `minutes`).minutes()}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ``}</p>
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
  statisticCtx.height = BAR_HEIGHT * Array.from(resultGenres.values()).length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Array.from(resultGenres.keys()),
      datasets: [{
        data: Array.from(resultGenres.values()),
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

export default (resultCards) => {

  let totalGenres = [];
  if (resultCards.length) {
    totalGenres = resultCards.reduce((a, b) => {
      return a.concat(b.genre);
    }, []);
  }

  let resultGenres = totalGenres.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  const arrayGenres = Object.entries(resultGenres).sort((a, b) => b[1] - a[1]);
  resultGenres = new Map(arrayGenres);

  const statisticTextList = statisticsBlock.querySelector(`.statistic__text-list`);
  if (statisticTextList) {
    statisticsBlock.removeChild(statisticTextList);
    statisticsBlock.removeChild(statisticsBlock.querySelector(`.statistic__chart-wrap`));
  }
  statisticsBlock.insertAdjacentHTML(`beforeend`, getTemplateStatistic(resultCards, arrayGenres[0][0]));
  displayChart(resultGenres);
};
