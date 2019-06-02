var tbody = document.querySelector('.table tbody');

var url = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48';

function append(parent, el) {
   return parent.appendChild(el);
}

function deg2rad(deg) {
   return deg * (Math.PI/180)
}

function heightConvert(ft) {
   return ft/3.2808
}

function speedConvert(s) {
   return s*1.609
}

function distanse(data) {
   var aLat = 55.410307;
   var aLong = 37.902451;
   var pLat = data.slice(1,2)[0];
   var pLong = data.slice(2,3)[0];
   var R = 6371;

   var dLat = deg2rad(pLat-aLat);
   var dLon = deg2rad(pLong-aLong);

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos(deg2rad(aLat)) * Math.cos(deg2rad(pLat)) *
       Math.sin(dLon/2) * Math.sin(dLon/2);

   var d = 2 *R * Math.asin(Math.sqrt(a));
   return parseFloat(d.toFixed(1));
}

function parseData(data) {
   var coordinates = data.slice(1,3).join(' ');
   var speed = Math.round(speedConvert(data.slice(5,6)));
   var course = data.slice(3,4);
   var height = Math.round(heightConvert(data.slice(4,5)));
   var flight = data.slice(9,10);
   var codes = data.slice(11,13).join(' ');
   var distance = distanse(data);
   return [].concat(coordinates, speed, course, height, codes, flight, distance);
}

function fetchData() {
   fetch(url)
       .then(function(res) { return res.json()} )
       .then(function (items) {
          tbody.innerHTML = "";

          Object.values(items).slice(2).sort(function (a, b) {
             return distanse(a) - distanse(b)}).map(function (item) {
             var tr = document.createElement('tr');
             append(tbody, tr);

             parseData(item).map(function(subItem) {
                var td = document.createElement('td');
                td.innerHTML = subItem;
                append(tr, td);
             })
          })
       })
       .catch(function (error) {
          console.log('Ошибка: ' + error.message);
       });
}

fetchData();

setInterval(fetchData, 4000);

