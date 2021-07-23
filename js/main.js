function getData(url) {
    if (map != undefined) {
        map.remove();
    }
    var container = L.DomUtil.get('mapid');
    if (container != null) {
        container._leaflet_id = null;
    }
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

    var monarchGeoJSON = false;
    var newMonarch = document.getElementById('monarch').value;
    url = 'data/json/' + newMonarch + '.json'
    fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
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

                    var html = '';
                    var arrayOfProps = ['location', 'id', 'time', 'comments'];
                    arrayOfProps.forEach(function(prop) {
                        html += '<strong>' + prop + '</strong>' + ': ' + geoJsonPoint.properties[prop] + '<br/>'
                    })
                    return L.circle(latlng, 5000).bindPopup(html);
                },
            }).addTo(map);
            callSlider();

            function callSlider() {
                destroySlider();

                var slider = document.getElementById('slider');

                // if (slider != null) {
                //     slider.noUiSlider.destroy()
                //     var slider = document.getElementById('slider');

                // }
                // if (slider != null) {
                //     slider.noUiSlider.destroy()
                // }

                noUiSlider.create(slider, {
                    start: [min],
                    step: 1,
                    range: {
                        'min': min,
                        'max': max
                    },
                }).on('slide', function(e) {
                    monarchGeoJSON.eachLayer(function(layer) {
                        if (layer.feature.properties.id == parseFloat(e[0])) {
                            $('#displayLocation').html(layer.feature.properties.location);
                            $('#displayDate').html(layer.feature.properties.time);
                            layer.addTo(map);
                        } else {
                            map.removeLayer(layer);
                        }
                    });
                });
            }
        })
        .catch(error => console.log(error.message));

    function destroySlider() {
        $('.sliderContainer').attr('class', 'sliderContainer');
        $('.noUi-base').remove();
        delete slider.noUiSlider;
        slider = document.getElementById('slider');
    }
};