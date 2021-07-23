// $(document).ready(function() {
//     getData('countGeoffrey.json')
// });
// var clearData;

function loadData() {
    clearData;
    getData('edward2.json')
};

var map;

function getData(url) {
    if (map != undefined) {
        map.remove();
    }
    console.log('success')
    var container = L.DomUtil.get('mapid');
    if (container != null) { container._leaflet_id = null; }
    $('#mapid').height(window.innerHeight);
    var map = L.map('mapid', {
            zoomControl: false
        })
        .setView([51.467376142760884, -3.1661224365234375, ], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'accessToken'
    }).addTo(map);
    // });

    // function getData(url) {
    console.log('success1')
    var monarchGeoJSON = false;
    var newMonarch = document.getElementById('monarch').value;
    url = 'data/json/' + newMonarch + '.json'
    fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            console.log('success2')
            var min = 0;
            var max = 0;
            monarchGeoJSON = L.geoJSON(json, {
                style: function(feature) {
                    return {
                        fillOpacity: 0.1,
                        fillColor: '#000',
                        color: '#000',
                        opacity: 0.3
                    };
                },
                pointToLayer: function(geoJsonPoint, latlng) {
                    if (geoJsonPoint.properties.id < min || min === 0) {
                        min = geoJsonPoint.properties.id;
                    }
                    if (geoJsonPoint.properties.id > max) {
                        max = geoJsonPoint.properties.id;
                    }
                    console.log('success2')

                    var html = '';
                    var arrayOfProps = ['location', 'id', 'time', 'comments'];
                    arrayOfProps.forEach(function(prop) {
                        html += '<strong>' + prop + '</strong>' + ': ' + geoJsonPoint.properties[prop] + '<br/>'
                    })
                    console.log('success3')
                    return L.circle(latlng, 5000).bindPopup(html);


                },
            }).addTo(map);
            console.log('success3')
            var slider = document.getElementById('slider');
            noUiSlider.create(slider, {
                start: [min],
                step: 1,
                range: {
                    'min': min,
                    'max': max
                }
            }).on('slide', function(e) {
                monarchGeoJSON.eachLayer(function(layer) {
                    if (layer.feature.properties.id == parseFloat(e[0])) {
                        $('#displayLocation').html(layer.feature.properties.location);
                        $('#displayDate').html(layer.feature.properties.time);
                        // $('#displayInformation').html(layer.feature.properties.comments);
                        layer.addTo(map);
                    } else {
                        map.removeLayer(layer);
                    }
                });
            });
        })
        .catch(error => console.log(error.message));

    function removeData() {
        map.remove();
    };
    clearData = removeData;
    // circle.on('mouseover', function() {
    //     circle.setStyle({ color: 'red' });
    // })
};