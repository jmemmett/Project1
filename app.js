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
var count = 0;

//-----------------------
// Function Definitions
//-----------------------

// Listener Event for the Submit Button
$("#submit").on("click", function (event) {
    var x = $("#inputZip").val()
    event.preventDefault();
    if (x.length !== 5) {
        $('#missingZipModal').modal('toggle');
    } else {
        address1 = $("#inputAddress").val().trim();
        city = $("#inputCity").val().trim();
        state = $("#inputState").val().trim();
        zip = $("#inputZip").val().trim();
        $("#results").show();
        $("#address").html("<h3>" + address1 + "<br>" + city + ", " + state + " " + zip + "</h3>");
        $("#elevation").empty();
        removeAddressInfo();
        getGeometry(address1, city, state, zip);
    }

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
    var responseLatitude = "";
    var responseLongitude = "";
    playJeopardy = document.createElement("audio");
    playJeopardy.setAttribute("src", "assets/audio/jeopardy.mp3")
    playJeopardy.play();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        count++;
        responseLatitude = response.results[0].geometry.location.lat;
        responseLongitude = response.results[0].geometry.location.lng;
        $("#calculating-elevation").html("<h3> Calculating...</h3>");
        mapGenerator(responseLatitude, responseLongitude);
        getElevation(responseLatitude, responseLongitude);
    }).fail(function (err) {
        playJeopardy.pause();
        if (count >= 1) {
            $('#refreshPageModal').modal('toggle')
        } else {
            $('#badAddressModal').modal('toggle');
        }
        
    });
}

// Function to take the latitude and longitude from the previous API call to get the elevation at those coordinates
function getElevation(lat, lng) {
    var queryURL = "https://api.open-elevation.com/api/v1/lookup\?locations\=" + lat + "," + lng
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (result) {
        $("#elevation").show();
        $("#calculating-elevation").html("")
        ftElevation = (result.results[0].elevation) * 3.28084;
        var inchElevation = (Math.floor(parseInt(JSON.stringify(ftElevation).split(".")[1]) * 0.00012));
        var responseElevation = ((JSON.stringify(ftElevation).split(".")[0]) + " ft " + (JSON.stringify(inchElevation)) + " inches");
        $("#elevation").text(responseElevation);
        playJeopardy.pause();
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
    $("#highestPlaces").empty().append("<div>" + city + ", " + state + ": " + elevation + " feet");
});

// Display lowest elevation from Firebase
database.ref().orderByChild("elevation").limitToFirst(1).on("child_added", function (snapshot) {

    city = snapshot.val().city;
    state = snapshot.val().state;
    elevation = snapshot.val().elevation;
    $("#lowestPlaces").empty().append("<div>" + city + ", " + state + ": " + elevation + " feet");
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
    var mymap = L.map('map-holder').setView([lat, long], 15);
    L.marker([lat, long]).addTo(mymap).bindPopup("<h3>" + address1 + "</br>" + city + " " + state + " " + zip + "</h3>").openPopup();
    $("#map-holder").css("height", "500px");
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
    $(document).ready(function () {
        L.Util.requestAnimFrame(mymap.invalidateSize, mymap, !1, mymap._container);
    });
}

//-------------------
// Script
//-------------------

$("#results").hide();
$("#elevation").hide();