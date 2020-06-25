// Get the document loaded before doing anything
$(document).ready(function () {
  // add a keyup event to listen for "enter"
  $("#search-term").keyup(function (event) {
    if (event.which === 13) {
      $("#search-button").click();
    }
  });
  // add a listener for actual clicking
  $("#search-button").click(function () {
    // use the input as the city name

    var cityName = $("#search-term").val();
    // remove the text from the field
    $("#search-term").val("");
    // invoke my functions (make the magic happen)
    todayWeather(cityName);
    fiveDayWeather(cityName);
  });
  // find what's in the local storage and show the most recent search daiily weather
  var prevSearched = JSON.parse(localStorage.getItem("prevSearched")) || [];

  // if there is anything saved in prevSearched (if it's more than 0)
  if (prevSearched.length > 0) {
    // then I'll pass the prevSearched item at the correct position to the todayWeather box so that the most recent search loads first
    todayWeather(prevSearched[prevSearched.length - 1]);
    fiveDayWeather(prevSearched[prevSearched.length - 1]);
  }
  // counts how many items are in the prevsearched category to display once the function is invoked
  for (var i = 0; i < prevSearched.length; i++) {
    storeCity(prevSearched[i]);
  }
  // invoked the storeCity function to make it add items to the list
  function storeCity(cityName) {
    var listItem = $("<li>").addClass("list-group-item").text(cityName);
    $(".appended-cities").append(listItem);
  }
  // Listen to clicks of the city names on the side
  $(".appended-cities").on("click", "li", function () {
    todayWeather($(this).text());
    fiveDayWeather($(this).text());
  });

  // the todayWeather function (top card)
  function todayWeather(cityName) {
    // ajax call
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=95bb3d64f0b9a132feede210ed2ba803&units=metric",
    }).then(function (output) {
      // I could either make the search on the side only store unique variables, or have the
      // localstorage remember the last item search (whether clicked or entered). So I went
      // with the less messy looking option.
      if (prevSearched.indexOf(cityName) == -1) {
        prevSearched.push(cityName);
        localStorage.setItem("prevSearched", JSON.stringify(prevSearched));
        storeCity(cityName);
      }

      // empty the now-weather for a new query
      $("#now-weather").empty();
      // make some divs to append later
      var column = $("<div>").addClass("col");
      var card = $("<div>").addClass("card");
      var cardBody = $("<div>").addClass("card-body");
      // title div that will display the name and date
      var title = $("<h2>")
        .addClass("card-title")
        .text(
          output.name + "'s weather for " + new Date().toLocaleDateString()
        );
      // img div for the emoticon
      var img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + output.weather[0].icon + ".png"
      );
      // make some more divs for appending later
      var wind = $("<p>").text("Wind Speed: " + output.wind.speed + " MPH");
      var humid = $("<p>").text("Humidity: " + output.main.humidity + "%");
      var temp = $("<p>").text(
        "Average Temperature: " + output.main.temp + " °C"
      );
      // set the longitude from the first API to use with the one that will give us humidity
      var longitude = output.coord.lon;
      var latitude = output.coord.lat;
      // second ajax call
      $.ajax({
        type: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/uvi?appid=95bb3d64f0b9a132feede210ed2ba803&lat=" +
          latitude +
          "&lon=" +
          longitude,
      }).then(function (response) {
        // Make elements for the UV stuff
        var uvResponse = response.value;
        var uvIndex = $("<p>").text("UV Index: ");
        var indicator = $("<span>").addClass("badge").text(uvResponse);
        // Make little coloured badges for the different levels of UV
        if (uvResponse < 3) {
          indicator.addClass("badge-success");
        } else if (uvResponse >= 3 && uvResponse < 7) {
          indicator.addClass("badge-warning");
        } else if (uvResponse >= 7 && uvResponse < 11) {
          indicator.addClass("badge-danger light-danger");
        } else {
          indicator.addClass("badge-danger");
        }
        // Append everything together
        cardBody.append(uvIndex);
        $("#now-weather .card-body").append(uvIndex.append(indicator));
      });
      title.append(img);
      cardBody.append(title, temp, humid, wind);
      card.append(cardBody);
      column.append(card);
      // Finally add it all to the page
      $("#now-weather").append(column);
    });
  }
  //  Make the forecast function
  function fiveDayWeather(cityName) {
    // ajax call
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=95bb3d64f0b9a132feede210ed2ba803&units=metric",
    }).then(function (output) {
      // Have to make a somewhat complicated title area because I want the text to align properly with the title in the above area
      $("#future-weather").html(
        "<div class='col-12'> <div class='card' id='forecast-title'> <div class='card-title'><h2>5 Day Forecast</h2></div> </div> </div>"
      );
      // Figured out that a card deck is the way to go for lining everything up nicely
      var cardDeck = $("<div>").addClass("card-deck");
      // Loop based on the number of outputs we get from the ajax call which is 5
      for (var i = 0; i < output.list.length; i++) {
        if (output.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          // Make a title area for the forecast
          var futureTitle = $("<h5>")
            .addClass("card-title")
            // make the title (date)
            .text(new Date(output.list[i].dt_txt).toLocaleDateString());
          // make the emoticon
          var futureImage = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              output.list[i].weather[0].icon +
              ".png"
          );
          // make cards and contents
          var futureCard = $("<div>").addClass("card");
          var futureCardBody = $("<div>").addClass("card-body");
          var futureHumid = $("<p>").text(
            "Humidity: " + output.list[i].main.humidity + "%"
          );
          var futureTemp = $("<p>").text(
            "Average Temperature: " + output.list[i].main.temp + " °C"
          );
          // append it all
          futureCard.append(
            futureCardBody.append(
              futureTitle,
              futureImage,
              futureTemp,
              futureHumid
            )
          );
          cardDeck.append(futureCard);
        }
        $("#future-weather").append(cardDeck);
      }
    });
  }
});
