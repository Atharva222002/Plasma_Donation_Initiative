const Form = document.getElementById('dist');
const InputDist = document.getElementById('maxd');
const div = document.getElementById('123');
const div1 = document.getElementById('1234');
mapboxgl.accessToken =
  'pk.eyJ1IjoiZGVvcmUyMiIsImEiOiJja253dXcxb2MwZnowMnZtcGN2aWxydWt1In0.v7P4N0AirMvEb1184Vb0jQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 9,
  center: [window.localStorage.getItem("longitude"), window.localStorage.getItem("latitude")]
});

// Fetch stores from API
async function getDonors() {
  const res = await fetch('/searchDonors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bloodgroup: window.localStorage.bloodgroup})
  });
  const data = await res.json();
 

  const donors = data.data.donors.map(donor => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          donor.location.coordinates[0],
          donor.location.coordinates[1]
        ]
      },
      properties: {
        'icon':'embassy-15',
        'description':
          `<strong>${donor.name}</strong>
          <p><strong>Age: </strong>${donor.age}</p>
          <p><strong>Blood Group: </strong>${donor.bloodGroup}</p>
          <p><strong>Gender: </strong>${donor.gender}</p>
          <p><strong>Contact No.: </strong>${donor.contact}</p>
          <p><strong>Weight: </strong>${donor.weight}</p>`,
      }
    };
  });
  const banks = data.data.banks.map(bank => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          bank.location.coordinates[0],
          bank.location.coordinates[1]
        ]
      },
      properties: {
        'icon':'hospital-15',
        'description':
          `<strong>${bank.name}</strong>
          <p><strong>Contact: </strong>${bank.contact}</p>
          <p><strong>Avaibility: </strong>${bank.availibility}</p>`,
             }
    };
  });
  const list = donors.concat(banks)
  loadMap(list);
}

function loadMap(list) {
  map.on('load', function () {
        // Add a data source containing one point feature.
        map.addSource('point', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': list
          }
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'point',
          'layout': {
          'icon-image': '{icon}',
          'icon-size':2,
          'icon-allow-overlap': true
          }
          });
        map.on('click', 'points', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
          map.getCanvas().style.cursor = '';
        });
      }
    );
  };

async function showList(e) {
  e.preventDefault();
    console.log("Clicked")
    document.getElementById("err").style.display = "none"
    const res = await fetch('/showlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bloodgroup: window.localStorage.bloodgroup,lng:localStorage.getItem('longitude'),lat:localStorage.getItem('latitude'),dist:InputDist.value*1000})
    });
    const data = await res.json();
    console.log(data);


    
    if(!data.data.donorslist.length && data.data.banklist.length ){
       document.getElementById('err').textContent = "No Donors exists in such region."
       document.getElementById("err").style.display = "block"
    }

    else if(!data.data.banklist.length && data.data.donorslist.length  ){
      document.getElementById('err').textContent = "No Blood Banks exists in such region."
      document.getElementById("err").style.display = "block"
   }
   
   else if(!data.data.banklist.length && !data.data.donorslist.length){
    document.getElementById('err').textContent = "Neither Blood Banks  nor Donors exists in such region."
    document.getElementById("err").style.display = "block"
   }

    if(data.data.banklist.length || data.data.donorslist.length) {
      

    let string1 = ""
    data.data.donorslist.forEach(donor => {
      string1=string1+
      `<div class="col-12 Box  col-sm-10 col-md-5  offset-0 offset-sm-1 offset-md-1 px-4 ">
          
      <p class="pt-4  lead" style="color: rgb(69, 145, 211)"><b></b></p>
      <p>Name :<span class="a px-3 py-1">${donor.name}</span> </p>
      <p>Blood Group :<span class="a px-3 py-1">${donor.bloodGroup}</span> </p>
  
      <p>Contact No. : <span class="a">${donor.contact}</span></p>
      <p>Address  :   <span class="a">${donor.location.formattedAddress}</span> </p></div>`
    });
    div.innerHTML = string1
    let string=""
    data.data.banklist.forEach(bank => {
      console.log(bank)
      string = string+
      `<div class="col-12 Box  col-sm-10 col-md-5  offset-0 offset-sm-1 offset-md-1 px-4 ">
          
      <p class="pt-4  lead" style="color: rgb(69, 145, 211)"><b></b></p>
      <p>Name :<span class="a px-3 py-1">${bank.name}</span> </p>
      <p>Contact No. : <span class="a">${bank.contact}</span></p>
      <p>Availibility : <span class="a">${bank.availibility}</span></p>
      <p>Address  :   <span class="a">${bank.location.formattedAddress}</span> </p></div>`
    });
    div1.innerHTML=string
    }
  }
  
console.log(window.localStorage)
Form.addEventListener('submit', showList);
console.log(Form)
getDonors();