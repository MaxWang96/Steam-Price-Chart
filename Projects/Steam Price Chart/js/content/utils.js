'use strict';

function findRegion() {
  let region = JSON.parse(document.getElementById('application_config').getAttribute('data-config')).COUNTRY;
  if (eu1.includes(region)) region = 'EU1';
  if (!supportedRegion.includes(region)) regionModal(region);
  return region;
}

function findIdAndOption(purchaseArea, isMusic) {
  let id;
  let firstPurchaseOption;
  let i = 0;
  const wrappers = purchaseArea.getElementsByClassName('game_area_purchase_game_wrapper');
  for (;;) {
    const wrap = wrappers[i];
    if (wrap.classList.length === 1) {
      if (isMusic || wrap.getElementsByClassName('music').length === 0) {
        const p = wrap.querySelector('p');
        if (p === null || p.querySelector('a') === null) {
          firstPurchaseOption = wrap;
          id = window.location.href.split('/')[4];
          break;
        }
      }
    } else if (wrap.classList.length === 3) {
      firstPurchaseOption = wrap;
      itemInfo.isBundle = true;
      id = firstPurchaseOption.getAttribute('data-ds-bundleid');
      break;
    }
    i += 1;
  }
  return {
    id,
    firstPurchaseOption,
  };
}

function findInfo() {
  const purchaseArea = document.getElementById('game_area_purchase');
  const info = {
    sysLang: window.navigator.languages[0],
    itemName: document.getElementsByClassName('apphub_AppName')[0].textContent,
  };
  const isDlc = purchaseArea.getElementsByClassName('game_area_dlc_bubble').length !== 0;
  const isMusic = purchaseArea.getElementsByClassName('game_area_soundtrack_bubble').length !== 0;

  if (purchaseArea.querySelector('div.game_area_purchase_game')
    .getAttribute('class') === 'game_area_purchase_game ') {
    freeItemModal(info.itemName);
  }

  info.gameName = (!isDlc && !isMusic)
    ? info.itemName
    : purchaseArea.getElementsByClassName('game_area_bubble')[0].querySelector('a').textContent;
  info.region = findRegion();
  Object.assign(info, findIdAndOption(purchaseArea, isMusic));
  return info;
}
