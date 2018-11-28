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
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1 + address2 + city + state+ zip + "&key=" + APIkey;


    function getGeometry() {
        var location = "204 Brook Rd Evergreen CO";
        var responseLatitude = "";
        var responseLongitude = "";

        $.ajax({
            url: queryURL,
            method: "GET"

        }).then (function(response) {
            responseLatitude = response.results[0].geometry.location.lat;
            responseLongitude = response.results[0].geometry.location.lng;
            console.log("Latitude at this address: " + responseLatitude);
            console.log("Longitude at this address: " + responseLongitude);
            $("#address").html("<h3>" + address1 + " " + address2 + ", " + city + " " + state + " " + zip + "</h3>");
            $("#geometry").html("<h4>Latitude: " + responseLatitude + "</h4>");
            $("#geometry").append("<h4>Longitude: " + responseLongitude + "</h4>");

            // call Chris's open elevation function inside here after the results from the first call is received
        })

    }

//------------------------
// Script               //
//------------------------

    getGeometry();