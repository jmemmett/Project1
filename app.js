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
var over10000elevationAddress = ["505 Harrison Ave", "Leadville", "CO", "80461"];
var over9000elevationAddress = ["23044 US-6", "Keystone", "CO", "80435"];
var over8000elevationAddress = ["204 Brook Rd", "Evergreen", "CO", "80439"];
var over7000elevationAddresss = ["845 Meadows Rd", "Aspen", "CO", "81611"];
var over6000elevationAddress = ["106 E Main St", "Aguilar", "CO", "81020"];
var over5280elevationAddress = ["7481 Knox Pl", "Westminster", "CO", "80030"];
var under5280elevationAddress = ["719 Poxson Ave", "Lansing", "MI", "48910"];

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
    var responseElevation = "";
    


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
        responseElevation = ((JSON.stringify(ftElevation).split(".")[0]) + " ft " + (JSON.stringify(inchElevation)) + " inches");
        console.log(responseElevation);
        $("#elevation").text(responseElevation);
        musicGenerator(ftElevation);
    })
}

function musicGenerator(elevation) {
    var audioElement = document.createElement("audio");
    if (elevation > 10000) {
// Super duper high
        audioElement.setAttribute("src", "assets/audio/imwasted.mp3");
        audioElement.play();
    } else if (elevation > 9000) {
        audioElement.setAttribute("src", "assets/audio/wasted.mp3");
        audioElement.play();
// Super high
    } else if (elevation > 8000) {
        audioElement.setAttribute("src", "assets/audio/badAssWeed.mp3");
        audioElement.play();
// Extremely high
    } else if (elevation > 7000) {
        audioElement.setAttribute("src", "#");
        audioElement.play();
// Very high
    } else if (elevation > 6000) {
        audioElement.setAttribute("src", "#");
        audioElement.play();
// High
    } else if (elevation > 5280) {
        audioElement.setAttribute("src", "#");
        audioElement.play();
// Slightly high
    } else {
        audioElement.setAttribute("src", "#");
        audioElement.play();
// Sober
    }
}

//------------------------
// Script               //
//------------------------

getGeometry("204 Brook Rd, Evergreen, CO 80439");