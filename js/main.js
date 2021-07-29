function navBar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function resetInformation() {
    $('#displayLocation').text('Location');
    $('#displayDate').text('Date');
};

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
        .setView([50.546352605448064, 0.9171352255804207, ], 6);

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
                        fillOpacity: 1,
                        fillColor: 'blue',
                        color: '#000',
                        opacity: 1
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

            // L.circle.on('mouseover', function(e) {
            //     this.openPopup();
            // });
            // circle.on('mouseout', function(e) {
            //     this.closePopup();
            // });
            callSlider();

            function callSlider() {
                destroySlider();

                var slider = document.getElementById('slider');

                noUiSlider.create(slider, {
                    start: [min],
                    step: 1,
                    animate: false,
                    animationDuration: 5000,
                    range: {
                        'min': min,
                        'max': max
                    },
                })

                $('#all').on('click', function() {
                    {
                        monarchGeoJSON.eachLayer(function(layer) {
                            slider.noUiSlider.reset()
                            layer.addTo(map);
                            resetInformation();
                        })
                    }
                });

                function displayData(values) {
                    monarchGeoJSON.eachLayer(function(layer) {
                        if (layer.feature.properties.id == values) {
                            $('#displayLocation').html(layer.feature.properties.location);
                            $('#displayDate').html(layer.feature.properties.time);
                            layer.addTo(map);
                        } else {
                            map.removeLayer(layer);
                        }
                    })
                };

                slider.noUiSlider.on('slide', function() {
                    var values = slider.noUiSlider.get();
                    displayData(values);
                });

                $('#restart').on('click', function() {
                    slider.noUiSlider.reset()
                    var values = slider.noUiSlider.get();
                    displayData(values);
                });

                $('#next').on('click', function() {
                    var values = slider.noUiSlider.get();
                    if (values <= max) {

                        values++;
                        slider.noUiSlider.set(values);
                        displayData(values);
                    }
                });

                $('#prev').on('click', function() {
                    var values = slider.noUiSlider.get();
                    if (values > min) {
                        values--;
                        slider.noUiSlider.set(values);
                        displayData(values);
                    }
                });

                $('#pause').on('click', function(e) {
                    clearInterval(timer);
                    timer = null
                });

                $('#monarch').on('click', function(e) {
                    clearInterval(timer);
                    timer = null
                });

                $('#play').on('click', function(e) {
                    if (timer !== null) return;
                    timer = setInterval(function() {
                        var values = slider.noUiSlider.get()
                        values++;
                        slider.noUiSlider.set(values);
                        displayData(values);
                    }, interval);
                });

                function clearTimeout() {
                    clearInterval(timer);
                    timer = null
                }

                var timer = null,
                    interval = 1000;

                // function timeInterval() {
                //     var interval = setInterval(timer, 1000);
                // }

                // function timer() {
                //     var values = slider.noUiSlider.get()
                //     console.log(values);
                //     values++;
                //     slider.noUiSlider.set(values);
                //     displayData(values);
                // }

                // function myStopFunction() {
                //     clearInterval(interval);
                // }

                // function play() {
                //     if (!isPaused) {
                //         var values = slider.noUiSlider.get()
                //         for (var values = slider.noUiSlider.get(); values <= max; values++) {
                //             (function(values) {
                //                 timeoutHandle = setTimeout(function() {
                //                     slider.noUiSlider.set(values);
                //                     displayData(values);
                //                 }, 1000 * values);

                //             })(values);
                //         }
                //     }
                // }

                function exit() {
                    return;
                }
            }
        })
        .catch(error => console.log(error.message));

    function destroySlider() {
        $('.sliderContainer').attr('class', 'sliderContainer');
        $('.noUi-base').remove();
        delete slider.noUiSlider;
        slider = document.getElementById('slider');
        resetInformation();
    }
};