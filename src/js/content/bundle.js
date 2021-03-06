'use strict';

function findRegion() {
  let region = document.getElementsByClassName('game_page_background')[0]
    .getElementsByTagName('script')[0]
    .textContent
    .match(/[A-Z]{2}/)[0];
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

function getName() {
  return document.getElementsByClassName('pageheader')[0].textContent;
}

//find info about the page: store region, item name, game name, browser language, purchase option & its id
function findInfo() {
  const urlParts = window.location.href.split('/');
  const info = {
    region: findRegion(),
    itemName: getName(),
    sysLang: window.navigator.languages[0],
    id: urlParts[4],
    targetOption: (urlParts[3] === 'bundle')
      ? document.getElementsByClassName('bundle')[0]
      : document.getElementsByClassName('game_area_purchase_game')[0],
  };
  if (info.targetOption.getElementsByClassName('btn_disabled').length) bundleOwnedModal();
  bundle = urlParts[3];
  info.gameName = info.itemName;
  return info;
}

// insert the chart into the Steam webpage
function insertChart(height) {
  document.getElementById('game_area_purchase')
    .insertAdjacentHTML('afterEnd', `
    <div class="steam_price_chart">
        <div id="chart_container" style="height: ${height}; min-width: 310px"></div>
    </div>
    `);
}
