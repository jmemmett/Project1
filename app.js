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

//----------------------
// Global Variables
//----------------------

var database = firebase.database();
var ftElevation;
var address1;
var city;
var state;
var zip;
var responseLatitude = "";
var responseLongitude = "";
var responseElevation = "";
var mymap = ""

//-----------------------
// Function Definitions
//-----------------------

// Listener Event for the Submit Button
$("#submit").on("click", function (event) {

    event.preventDefault();

    ftElevation = "";
    address1 = "";
    city = "";
    state = "";
    zip = "";
    responseLatitude = "";
    responseLongitude = "";
    responseElevation = "";

    // empty previous map contents (in case of a subsequent address entered)
    $("#map-holder").empty();

    address1 = $("#inputAddress").val().trim();
    city = $("#inputCity").val().trim();
    state = $("#inputState").val().trim();
    zip = $("#inputZip").val().trim();
    $("#results").show();
    $("#address").html("<h3>" + address1 + "<br>" + city + ", " + state + " " + zip + "</h3>");
    getGeometry(address1, city, state, zip);
    playJeopardy = document.createElement("audio");
    playJeopardy.setAttribute("src", "assets/audio/jeopardy.mp3")
    playJeopardy.play();
    removeAddressInfo();
    // clearVariables();
});

// remove previous address information entered by the user
function removeAddressInfo() {
    $("#inputAddress").val("");
    $("#inputCity").val("");
    $("#inputState").val("State");
    $("#inputZip").val("");
}

// First API call using the address information entered by the user, returning longitude and latitude
function getGeometry(address1, city, state, zip) {
    var APIkey = "AIzaSyAC6L0vkMTgQkS6VHpY2kbhcJZp8BI2hSg";
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address1 + city + state + zip + "&key=" + APIkey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        responseLatitude = response.results[0].geometry.location.lat;
        responseLongitude = response.results[0].geometry.location.lng;
        mapGenerator(responseLatitude, responseLongitude);
        getElevation(responseLatitude, responseLongitude);
        setInterval(factGenerator, 5000);
    })
}

// Function to take the latitude and longitude from the previous API call to get the elevation at those coordinates
function getElevation(lat, lng) {
    console.log('get elevation');
    var queryURL = "https://api.open-elevation.com/api/v1/lookup\?locations\=" + lat + "," + lng
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (result) {
        ftElevation = (result.results[0].elevation) * 3.28084;
        var inchElevation = (Math.floor(parseInt(JSON.stringify(ftElevation).split(".")[1]) * 0.00012));
        responseElevation = ((JSON.stringify(ftElevation).split(".")[0]) + " ft " + (JSON.stringify(inchElevation)) + " inches");
        $("#elevation").show();
        $("#elevation").text(responseElevation);
        playJeopardy.pause();
        $("#submit").show();
        musicGenerator(ftElevation);

        // Pushes user input + elevation to Firebase
        database.ref().push({
            address1: address1,
            city: city,
            state: state,
            zip: zip,
            elevation: ftElevation
        });
        
    })
}

// Display of highest previous elevations from Firebase
database.ref().orderByChild("elevation").limitToLast(5).on("child_added", function (snapshot) {

    city = snapshot.val().city;
    state = snapshot.val().state;
    elevation = snapshot.val().elevation;
    // NEED TO DO: EXCLUDE REPEAT RESULTS FROM PRINTING TO PAGE
    // DISPLAY IN DESCENDING ORDER
    // STYLIZE ELEVATION (COMES DEFAULT WITH A BUNCH OF DECIMAL PLACES)
    $("#highestPlaces").append("<div>" + city + ", " + state + ": " + elevation + " feet");
});

// Functon to determine which stone quote to play based on the elevation returned
function musicGenerator(elevation) {
    var audioElement = document.createElement("audio");
    if (elevation > 10000) {
        // Super duper high
        audioElement.setAttribute("src", "assets/audio/acid.mp3");
        audioElement.play();
    } else if (elevation > 9000) {
        // Super high
        audioElement.setAttribute("src", "assets/audio/hairgrowing.mp3");
        audioElement.play();
    } else if (elevation > 8000) {
        // Extremely high
        audioElement.setAttribute("src", "assets/audio/imwasted.mp3");
        audioElement.play();
    } else if (elevation > 7000) {
        // Very high
        audioElement.setAttribute("src", "assets/audio/wasted.mp3");
        audioElement.play();
    } else if (elevation > 6000) {
        // High
        audioElement.setAttribute("src", "assets/audio/badAssWeed.mp3");
        audioElement.play();
        // Slightly high
        audioElement.setAttribute("src", "assets/audio/booboo.mp3");
        audioElement.play();
    } else {
        // Sober
        audioElement.setAttribute("src", "assets/audio/hey_bud.mp3");
        audioElement.play();
    }
}

// Map Functionality
function mapGenerator(lat, long) {
    console.log(lat, long);
    mymap = "";
    mymap = L.map('map-holder').setView([lat, long], 15);
    console.log("1");
    L.marker([lat, long]).addTo(mymap).bindPopup("<h3>" + address1 + "</br>" + city + " " + state + " " + zip + "</h3>").openPopup();
    console.log("2");
    $("#map-holder").css("height", "500px");
    console.log("3");
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
    $(document).ready(function () {
        L.Util.requestAnimFrame(mymap.invalidateSize, mymap, !1, mymap._container);
    });
    console.log("4");
    }

//-------------------
// Script
//-------------------

$("#results").hide();
$("#elevation").hide();