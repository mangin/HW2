/*global schema, manager */

(function () {
    'use strict';
    function makeTestDb() {
        var i, j, time, rating, x, y;
        for (i = 0; i < 20; i = i + 1) {
            rating = (i % 5) + 1;
            x = Math.floor(Math.random() * (1000));
            y = Math.floor(Math.random() * (1000));
            schema.cinemas[i] = schema.createCinema({x: x, y: y}, {rating: rating});
        }

        for (i = 0; i < 20; i = i + 1) {
            schema.movies[i] = schema.createMovie("Film N" + i);
            time = "future";
            schema.linkMovieToCinema(i, i, {time: time, hallRating: Math.floor(Math.random() * 5) + 1});
            for (j = 0; j < 25; j = j + 1) {
                if ((j % 2) === 1) {
                    time = "past";
                } else {
                    time = "future";
                }
                schema.linkMovieToCinema(i, Math.floor(Math.random() * 20), schema.createSchedule(time, Math.floor(Math.random() * 5) + 1));
            }
        }
    }

    makeTestDb();
}());
