const app = (function () {
  'use strict';

  // const list = 'http://localhost:3501/sp500/v1/tick/'
  const list = 'https://api.datasilo.org/sp500/v1/tick/';

  let datas;

  function init () {
    console.log('Init sp500');
    getAjaxData(list, showData);
    setInterval(function () {
      getAjaxData(list, showData);
    }, 5000);
  }

  function showData (data) {
    datas = Object.values(data);
    // console.log(datas[0])
    let res = '';
    for (let i = 0; i < datas.length; i++) {
      // let fecha = new Date(datas[i].time * 1e3).toISOString().slice(-13, -5)
      let going = '';
      if (datas[i].price > datas[i].last) { going = 'up'; }
      if (datas[i].price < datas[i].last) { going = 'down'; }
      if (datas[i].price === 0) {
        going = '';
        datas[i].price = datas[i].last;
      }
      res +=
        `<div class="row tooltip" id="${i}">
           <div>${datas[i].symbol}</div>
           <div class="${going}">${datas[i].price}</div>
           <span class="tooltipText">
           <strong>${datas[i].companyName}</strong><br>
           Last day : ${datas[i].last}<br>
           <small>${datas[i].industry}<br>${datas[i].sector}</small>
           </span>
         </div>`;
    }
    document.getElementById('data').innerHTML = res;
  }

  function getAjaxData (urlData, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          // console.log(xhr.responseText)
          callback(JSON.parse(xhr.responseText));
        } else {
          console.log('Error: ' + xhr.status);
        }
      }
    };
    xhr.open('GET', urlData); // add false to synchronous request
    xhr.send();
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);