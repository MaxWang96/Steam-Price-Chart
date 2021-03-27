'use strict';

function makePriceArr(price, points) {
  const len = points.length;
  price.push(points[0][1]);
  if (len === 2) {
    price.push(points[1][1]);
  } else {
    let i = 1;
    for (; i < len - 2; i += 1) {
      if (points[i + 1][0] - points[i][0] <= 1656e5
        || points[i + 1][1] === points[i][1]) {
        showOriginalModal();
      }
      price.push(points[i][1]);
    }
    price.push(points[i][1], points[i + 1][1]);
  }
}

function setupEnd(priceArr, pointsArr, firstPurchaseOption) {
  const arr = priceArr;
  let price;
  let endDiscount = true;
  const len = arr.length;
  const curPrice = arr[len - 1];
  const discount = firstPurchaseOption.getElementsByClassName('discount_block');

  function fillDiscount() {
    arr[len - 1] = price / 2;
    arr.push(price);
    endDiscount = false;
  }

  if (bundle === 'app' || bundle === 'bundle') {
    price = discount[0].getAttribute('data-price-final') / 100;
    let max = price;
    const searchRange = len < 5 ? len - 1 : 4;
    for (let j = 0; j < searchRange; j += 1) {
      if (arr[len - j - 2] > max) max = arr[len - j - 2];
    }
    if (max === price) {
      fillDiscount();
    } else {
      arr[len - 1] = max;
    }
  } else if (discount.length !== 0) {
    price = discount[0].getAttribute('data-price-final') / 100;
    arr[len - 1] = parseFloat(discount[0]
      .getElementsByClassName('discount_original_price')[0]
      .textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
  } else {
    price = firstPurchaseOption.getElementsByClassName('game_purchase_price')[0].getAttribute('data-price-final') / 100;
    fillDiscount();
  }

  if (price !== curPrice) {
    if (firstPurchaseOption.parentNode.getElementsByClassName('free_weekend').length === 0) {
      const updateDelay = Date.now() - pointsArr[len - 1][0];
      if (updateDelay >= 864e5) {
        dataModal();
      } else if (endDiscount && curPrice === arr[len - 1]) { // divinity US
        updateDelayModal();
        fillDiscount();
      } else if (!endDiscount && updateDelay >= 54e5) {
        updateDelayModal();
        arr.pop();
        arr[len - 1] = price;
        endDiscount = true;
      } else {
        dataModal();
      }
    } else {
      const points = pointsArr;
      [points[len - 2][1], points[len - 1][1]] = [price, price];
      arr[len - 2] = price;
    }
  }
  return endDiscount;
}

function setupBegin(price, points) {
  let max = price[0];
  let beginDiscount = false;
  if (price.length === 2) {
    beginDiscount = true;
    max = price[1];
  } else {
    for (let i = 1; i < 3; i += 1) {
      if (price[i] > max) {
        beginDiscount = true;
        max = price[i];
      }
    }
  }
  if (beginDiscount) {
    price.unshift(max);
    points.unshift(0);
  }
}

function setup(points, price, firstPurchaseOption) {
  makePriceArr(price, points);
  const endDiscount = setupEnd(price, points, firstPurchaseOption);
  setupBegin(price, points);
  return endDiscount;
}

function makeBase(price, baseArr, priceIncrease, partial = false) {
  const base = baseArr;
  let i = partial ? partial - 1 : 0;
  const len = price.length;
  const last = partial ? Math.min(partial + 4, len - 2) : len - 2;
  if (len === 2) base.fill(price[1]);
  else [base[0]] = price;

  while (i < last) {
    const [cur, first, second] = [price[i], price[i + 1], price[i + 2]];
    if (cur < first) {
      base[i + 1] = first;
      i += 1;
      priceIncrease.push(i);
    } else if (cur === second) {
      base.fill(cur, i + 1, i + 3);
      i += 2;
    } else if (cur > second) {
      const third = price[i + 3];
      if (cur === third) {
        base.fill(cur, i + 1, i + 4);
        i += 3;
      } else if (cur === price[i + 4]) {
        base.fill(cur, i + 1, i + 5);
        i += 4;
      } else if (cur < third) {
        base.fill(cur, i + 1, i + 3);
        base[i + 3] = third;
        i += 3;
        priceIncrease.push(i);
      } else if (first < second) {
        base[i + 1] = cur;
        base[i + 2] = second;
        i += 2;
      } else if (first === third) {
        if (i >= price.length - 5 || cur !== price[i + 5]) {
          base.fill(first, i + 1, i + 4);
          i += 3;
        } else if (first / cur <= 0.8) { // borderlands 2 psycho pack US
          base.fill(cur, i + 1, i + 6);
          i += 5;
        } else { // dead by daylight CN
          base.fill(first, i + 1, i + 5);
          base[i + 5] = cur;
          i += 5;
          priceIncrease.push(i);
        }
      } else if (second > third) { // double price decrease
        base[i + 1] = first;
        base.fill(second, i + 2, i + 5);
        i += 4;
      } else {
        base[i + 1] = first;
        i += 1;
      }
    } else {
      base[i + 1] = cur;
      base[i + 2] = second;
      i += 2;
      priceIncrease.push(i);
    }
  }
}

function checkAbnormalHigh(pointsArr, priceArr, baseArr, priceIncrease) {
  const [price, base] = [priceArr, baseArr];
  let tmp;
  let i = priceIncrease.length - 1;

  if (pointsArr.length > 3 && pointsArr[0] === 0) { // XCOM 2 CN
    if (baseArr[0] !== baseArr[3]) {
      base.splice(2, 2);
      price.splice(2, 2);
      pointsArr(2, 2);
      makeBase(price, base, priceIncrease, 1);
    }
  }

  function removeAbnormal(n) {
    let j = 0;
    let idx = tmp;
    const points = pointsArr;
    const toDelete = [];
    const correctBase = base[tmp - 1];
    if (i >= 2) {
      if (priceIncrease[i] - priceIncrease[i - 2] <= 10) showOriginalModal();
    }
    while (j < n) {
      if (price[idx] < correctBase) {
        idx += 1;
      } else {
        if (price[idx - 1] !== correctBase) {
          points[idx][1] = correctBase;
          price[idx] = correctBase;
          base[idx] = correctBase;
        } else {
          toDelete.push(idx);
        }
        if (price[idx + 1] === correctBase) {
          toDelete.push(idx + 1);
        }
        idx += 2;
        j += 1;
      }
    }
    for (let k = toDelete.length - 1; k >= 0; k -= 1) {
      const deleteIdx = toDelete[k];
      base.splice(deleteIdx, 1);
      price.splice(deleteIdx, 1);
      points.splice(deleteIdx, 1);
    }
  }

  for (; i >= 0; i -= 1) {
    tmp = priceIncrease[i];
    if (base[tmp] !== base[tmp + 1]) {
      removeAbnormal(1);
    } else if (base[tmp] !== base[tmp + 2]) {
      removeAbnormal(1);
      makeBase(price, base, priceIncrease, tmp);
    } else if (tmp < base.length - 4 && base[tmp] !== base[tmp + 4]) { // rainbow six US
      removeAbnormal(2);
      makeBase(price, base, priceIncrease, tmp);
    }
  }
}

function calculateBase(points, price) {
  const base = Array(price.length);
  const priceIncrease = [];
  makeBase(price, base, priceIncrease);
  checkAbnormalHigh(points, price, base, priceIncrease);
  return base;
}

function restorePriceArr(points, priceArr, base, endDiscount) {
  const price = priceArr;
  if (points[0] === 0) {
    points.shift();
    price.shift();
    base.shift();
  }
  const len = price.length;
  if (endDiscount) {
    price[len - 1] = price[len - 2];
  } else {
    price[len - 2] = price[len - 3];
  }
}

function makeDiscountArr(pointsArr, priceArr, base) {
  const [points, price] = [pointsArr, priceArr];
  const discountArr = [];
  let len = points.length;
  let i = 0;
  for (; i < len - 2; i += 1) {
    if (price[i] === base[i]) {
      discountArr.push(0, 0);
    } else {
      if (points[i + 1][0] - points[i][0] >= 2592e6) {
        if (i > 1) {
          if (price[i] === 0) {
            if (price[i - 1] === base[i - 1]) { // dying light US
              points[i][1] = price[i - 2];
              price[i] = price[i - 2];
            } else { // rainbow six US
              points[i][1] = price[i + 1];
              points.splice(i + 1, 1);
              price.splice(i, 1);
              base.splice(i, 1);
              len -= 1;
            }
          } else {
            showOriginalModal();
          }
        } else if (i === 1) {
          if (price[i - 1] === base[i - 1]) { // tomb raider US
            showOriginalModal();
          }
        }
      }
      const curDiscount = Math.round((1 - price[i] / base[i]) * 100);
      discountArr.push(curDiscount, curDiscount);
    }
  }
  discountArr.push(Math.round((1 - price[i] / base[i]) * 100),
    Math.round((1 - price[i + 1] / base[i + 1]) * 100));
  return discountArr;
}

function calculateDiscount(points, firstPurchaseOption) {
  if ((points[0][1] === 0
      && points[1][0] - points[0][0] >= 31536e6)
    || points[points.length - 1][1] !== points[points.length - 2][1]) {
    dataModal();
  }
  const priceArr = [];
  const endDiscount = setup(points, priceArr, firstPurchaseOption);
  const base = calculateBase(points, priceArr);
  restorePriceArr(points, priceArr, base, endDiscount);
  return makeDiscountArr(points, priceArr, base);
}

function personalPrice(pointsArr, firstPurchaseOption) {
  const userPrice = firstPurchaseOption.getElementsByClassName('your_price');
  if (userPrice.length) {
    const price = parseFloat(userPrice[0]
      .children[1]
      .textContent
      .match(/[\d.,]+/)[0]
      .replace(',', '.'));
    const points = pointsArr;
    const len = points.length;
    if (price !== points[len - 1][1]) {
      const pricePercent = price / points[len - 1][1];
      for (let i = 0; i < len; i += 1) {
        points[i][1] *= pricePercent;
      }
    }
  }
}

function addIntermediatePoints(points) {
  const plotArr = [];
  const len = points.length;
  let i = 0;
  for (; i < len - 2; i += 1) {
    plotArr.push(points[i]);
    plotArr.push([points[i + 1][0] - 36e5, points[i][1]]);
  }
  plotArr.push(points[i], points[i + 1]);
  return plotArr;
}
