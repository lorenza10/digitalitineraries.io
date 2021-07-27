function navBar() {
    console.log('success')
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function end() {
//     // Something to the effect of while x less than max, increment+1
//     slider.noUiSlider.set(50);
//     value = slider.noUiSlider.get();
//     while (value < 79) {

//         console.log(value)
//         value++;
//         await sleep(2000);
//     }
// }

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

                $('#next').on('click', function() {
                    var values = slider.noUiSlider.get();
                    values++;
                    slider.noUiSlider.set(values);
                    displayData(values);
                });

                $('#prev').on('click', function() {
                    var values = slider.noUiSlider.get();
                    values--;
                    slider.noUiSlider.set(values);
                    displayData(values);
                });



                // $('#play').on('click', function() {
                //     var values = slider.noUiSlider.get();
                //     // slider.noUiSlider.set(50);
                //     console.log(values);
                //     setInterval(function() {
                //         while (values < max) {
                //             monarchGeoJSON.eachLayer(function(layer) {
                //                 if (layer.feature.properties.id == max) {
                //                     $('#displayLocation').html(layer.feature.properties.location);
                //                     $('#displayDate').html(layer.feature.properties.time);
                //                     layer.addTo(map);
                //                 } else {
                //                     map.removeLayer(layer);
                //                 }
                //             });
                //             console.log(values)
                //             values++;
                //         }
                //     }, 500);

                // });


                // var counter = min;

                // $('#btn-run').on('click', function() {
                //     console.log('success')
                //     if (counter < max) { //if counter less than max value
                //         counter += 1; //increment counter
                //         $slider.slider("value", counter)
                //     }
                // });

                // $(".btn-stop").on("click", function() {
                //     //Call clearInterval to stop the animation.
                //     clearInterval(sliderInterval);
                // });
            }

            slider.addEventListener('change', function() {
                sliderFormat.noUiSlider.set(this.value);
                console.log('success')
            });

            $('slider').on('change', function() {
                alert(this.value);
            });
        })
        .catch(error => console.log(error.message));

    function destroySlider() {
        $('.sliderContainer').attr('class', 'sliderContainer');
        $('.noUi-base').remove();
        $('#displayLocation').text('Location');
        $('#displayDate').text('Date');
        delete slider.noUiSlider;
        slider = document.getElementById('slider');
    }
};