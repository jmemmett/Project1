// Initialize Firebase
var config = {
    apiKey: "AIzaSyBDfVYlkT1YhC6fHJV8fQS0iHzPg-WD9Ow",
    authDomain: "project-elevation-df0b8.firebaseapp.com",
    databaseURL: "https://project-elevation-df0b8.firebaseio.com",
    projectId: "project-elevation-df0b8",
    storageBucket: "project-elevation-df0b8.appspot.com",
    messagingSenderId: "360955956682"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// CLICK FUNCTION TO ADD FORM DATA TO DB
$("#submit").on("click", function (event) {

    event.preventDefault();

    var address1 = $("#address").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zip = $("#zip").val();
    // var elevation = $("elevation")

    console.log(address1 + city + state + zip);

    getGeometry(address1, city, state, zip);

    database.ref().push({
        address1: address1,
        city: city,
        state: state,
        zip: zip
    });

});

database.ref().on("child_added", function (childSnapshot) {

    console.log("hello!");
    city = childSnapshot.val().city;
    console.log(city);
    state = childSnapshot.val().state;
    console.log(state);

    $("#top10places").append("<div>" + city + ", " + state);
});

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
////////////////  E  /////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
////////////////  N  /////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
////////////////  D  /////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

//------------------------
// Global Variables     //
//------------------------

//------------------------
// Function Definitions //
//------------------------


// $("#submit").on("click", function () {
//     if (all fields are enterred properly) {
//     var address1 = $("#address").val();
//     var city = $("#city").val();
//     var state = $("#state").val();
//     var zip = $("#zip").val();
//     $("#address").val("");
//     $("#city").val("");
//     $("#state").val("");
//     $("#zip").val("");
//     getGeometry(address1, city, state, zip);
// } else {
//      modal
// }

// })

function getGeometry(address1, city, state, zip) {
    var APIkey = "AIzaSyAC6L0vkMTgQkS6VHpY2kbhcJZp8BI2hSg";
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1 + city + state + zip + "&key=" + APIkey;
    var responseLatitude = "";
    var responseLongitude = "";

    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {
        responseLatitude = response.results[0].geometry.location.lat;
        responseLongitude = response.results[0].geometry.location.lng;
        console.log("Latitude at this address: " + responseLatitude);
        console.log("Longitude at this address: " + responseLongitude);

        $("#address").html("<h3>" + address1 + ", " + city + " " + state + " " + zip + "</h3>");
        $("#geometry").html("<h4>Latitude: " + responseLatitude + "</h4>");
        $("#geometry").append("<h4>Longitude: " + responseLongitude + "</h4>");

        getElevation(responseLatitude, responseLongitude);
    })

}

function getElevation(lat, lng) {
    console.log("run");
    var queryURL = "https://api.open-elevation.com/api/v1/lookup\?locations\=" + lat + "," + lng
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (result) {

        var ftElevation = (result.results[0].elevation) * 3.28084;
        var inchElevation = (Math.floor(parseInt(JSON.stringify(ftElevation).split(".")[1]) * 0.00012));
        $("#elevation").text("Elevation: " + Math.floor(ftElevation) + " ft " + inchElevation + " inches");
        musicGenerator(ftElevation);
    })
}

function musicGenerator(elevation) {
    var audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "assets/Pony.mp3");
    if (elevation > 10000) {
// Super duper high
    } else if (elevation > 9000) {
// Super high
    } else if (elevation > 8000) {
        audioElement.setAttribute("src", "Pony.mp3");
        audioElement.play();
// Extremely high
    } else if (elevation > 7000) {
// Very high
    } else if (elevation > 6000) {
// High
    } else if (elevation > 5280) {
// Slightly high
    } else {
// Sober
    }
}

//------------------------
// Script               //
//------------------------
