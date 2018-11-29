// Initialize Firebase
var config = {
    apiKey: "AIzaSyDCwEnmqMtEVEnUcdQ9Vfj2lD6RNqACzVc",
    authDomain: "elevationfinder-df17a.firebaseapp.com",
    databaseURL: "https://elevationfinder-df17a.firebaseio.com",
    projectId: "elevationfinder-df17a",
    storageBucket: "elevationfinder-df17a.appspot.com",
    messagingSenderId: "774592182127"
};
firebase.initializeApp(config);

// Create a variable to reference he database
var database = firebase.database();

//------------------------
// Global Variables     //
//------------------------

//------------------------
// Function Definitions //
//------------------------
var APIkey = "AIzaSyAC6L0vkMTgQkS6VHpY2kbhcJZp8BI2hSg";
var address1 = "204 Brook Rd";
var address2 = "";
var city = "Evergreen";
var state = "CO";
var zip = "";
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1 + address2 + city + state + zip + "&key=" + APIkey;


function getGeometry() {
    var location = "204 Brook Rd Evergreen CO";
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
        $("#address").text(address1 + " " + address2 + ", " + city + " " + state + " " + zip);
        $("#geometry").html("<h4>Latitude: " + responseLatitude + "</h4>");
        $("#geometry").append("<h4>Longitude: " + responseLongitude + "</h4>");

        getElevation(responseLatitude, responseLongitude);
    })

}

function getElevation(lat, lng) {
    var queryURL = "https://api.open-elevation.com/api/v1/lookup\?locations\=" + lat + "," + lng
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (result) {
        var elevation = result.results[0].elevation;
        elevation = Math.floor(elevation * 3.28084);
        $("#elevation").text(elevation + " ft")
    })
}

//------------------------
// Script               //
//------------------------

getGeometry();