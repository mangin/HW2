/*global $, manager, ymaps, schema */

(function () {
    'use strict';
    var myMap;
    function clearAll() {
        var pos = {x: $("#x-pos").val(), y: $("#y-pos").val()},
            myPlacemark = new ymaps.Placemark([pos.y / 1000.0, pos.x / 1000.0], {
                hintContent: 'Student',
                balloonContent: 'Student'
            }),
            myCircle = new ymaps.GeoObject({
                geometry: {
                    type: "Circle",
                    coordinates: [pos.y / 1000.0, pos.x / 1000.0],
                    radius: $("#max-distance").val() * 110
                }
            });
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(myPlacemark);
        myMap.geoObjects.add(myCircle);
        myMap.geoObjects.add(new ymaps.Placemark([0 / 1000.0, 0 / 1000.0], {
            hintContent: 'border',
            balloonContent: 'border'
        }));
        myMap.geoObjects.add(new ymaps.Placemark([1000 / 1000.0, 1000 / 1000.0], {
            hintContent: 'border',
            balloonContent: 'border'
        }));
        myMap.geoObjects.add(new ymaps.Placemark([0 / 1000.0, 1000 / 1000.0], {
            hintContent: 'border',
            balloonContent: 'border'
        }));
        myMap.geoObjects.add(new ymaps.Placemark([1000 / 1000.0, 0 / 1000.0], {
            hintContent: 'border',
            balloonContent: 'border'
        }));
    }
    function process (time) {
        var pos = {x: $("#x-pos").val(), y: $("#y-pos").val()},
            defer = $.Deferred(),
            ob,
            re = /\r\n/g,
            cinemaPosition;

        defer.then(function () {
            ob = manager.findByFilmName($("#film-name").val());
        }).then(function () {
            if (ob) {
                ob = ob.filterByTime(time);
            } else {
                return $.Deferred().reject();
            }
        }).then(function () {
            ob = ob.filterByCinemaRating($("#cinema-rating").val());
        }).then(function () {
            ob = ob.filterByHallRating($("#hall-rating").val());
        }).then(function () {
            ob = ob.filterByPosition(pos, $("#max-distance").val());
        }).then(function () {
            if (ob.cinemaSchedules.length === 0) {
                return $.Deferred().reject();
            }
        }).then(function () {
            $('#s-div').html(ob.sortByUserPosition(pos).getTop(5).toString().replace(re, '<br />'));
            clearAll();
            ob.cinemaSchedules.map(function (cinemas) { 
                cinemaPosition = schema.cinemas[cinemas.cinemaId].position;
                myMap.geoObjects.add(new ymaps.Placemark([cinemaPosition.y / 1000.0, cinemaPosition.x / 1000.0], {
                    hintContent: cinemas.cinemaId,
                    balloonContent: cinemas.cinemaId
                }));
            
            });
        }, function () {
            $('#s-div').html("Nothing found");
            clearAll();
        });

        defer.resolve();
    }

    function init() {     
        myMap = new ymaps.Map("map", {
            center: [0.5, 0.5],
            zoom: 9
        });
        clearAll();
    }

    $("#apply-future-button").bind("click", function () {
        process('future');
    });
    $("#apply-past-button").bind("click", function () {
        process('past');
    });

    ymaps.ready(init);



}());

