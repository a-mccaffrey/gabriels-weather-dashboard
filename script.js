// var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// var APIKey = "&appid=95bb3d64f0b9a132feede210ed2ba803";

// .on("click") function associated with the Search Button
$("#search-button").on("click", function (event) {
  event.preventDefault();

  var city = $("#search-term").val().trim();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=de5403af016e920e87f6c36c31b6b26e";

  console.log(queryURL);
  // $.ajax({
  //   url: queryURL,
  //   method: "GET"
  // }).then(function(response) {
  //   var tBody = $("tbody");
  //   var tRow = $("<tr>");
  //   // Methods run on jQuery selectors return the selector they we run on
  //   // This is why we can create and save a reference to a td in the same statement we update its text
  //   var titleTd = $("<td>").text(response.Title);
  //   var yearTd = $("<td>").text(response.Year);
  //   var actorsTd = $("<td>").text(response.Actors);
  //   // Append the newly created table data to the table row
  //   tRow.append(titleTd, yearTd, actorsTd);
  //   // Append the table row to the table body
  //   tBody.append(tRow);
  // });
});

function initialize(event2){
    event2.preventDefault();
}


//Things I need: name, temp, humidity, wind.speed,