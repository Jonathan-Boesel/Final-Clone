window.onload = function() {

  $("#locationCheck").on("click", function() {
        if ($("#locationCheck").prop("checked")) {
            console.log("checked");
            $("#userLocationParent").hide();
        }
        if (!$("#locationCheck").prop("checked")) {
            console.log("unchecked");
            $("#userLocationParent").show();
        }
    });
  var userAddress;
  var startLocation
  var myLatLng;

  function getLocation() {
    function showPosition(position) {
      console.log("getting location")

      var startLat = position.coords.latitude;
      var startLng = position.coords.longitude;
      myLatLng = { lat: startLat, lng: startLng }
      userAddress = JSON.stringify(myLatLng)
      console.log(userAddress)
      // 	//Once the user's address is saved in the userAddress variable, call the initMap function to load the map
      console.log(myLatLng)


    };
    //if geolocation is supported, the getCurrentPosition will be called
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
    function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation, please refresh and try again or use destination.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable for your device, please refresh and try again or use destination.")
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out, please refresh and try again or use destination.")
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred, please refresh and try again or use destination.")
                    break;
            }
        }
  }
  // getLocation();
  var getUserLocation = function() {
      //var destinationAddress = $("#destination").val().trim();
      var geoLocURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + startLocation + "&key=AIzaSyB6P6KfBWOmNmMk9IRDVgl8OTmVtMmSEQk";
      var d = new $.Deferred();
      $.ajax({
          url: geoLocURL,
          method: "GET"
      }).done(function(results) {
          console.log("startLat: " + results.results["0"].geometry.location.lat);
          console.log("startlng: " + results.results["0"].geometry.location.lng);
          var startLat = results.results["0"].geometry.location.lat;
          console.log("startLat var: " + startLat);
          var startLng = results.results["0"].geometry.location.lng;
          console.log("startLng var: " + startLng);
          // var startAd1 = results.results["0"].address_components["0"].short_name;
          // var startAd2 = results.results["0"].address_components["1"].short_name;
          // startAddress = (startAd1 + " " + startAd2);
          // console.log("starting address: " + startAddress);
          var tmpLatLng = {
              startLat: startLat,
              startLng: startLng,
          };
          myLatLng = { lat: startLat, lng: startLng }
          userAddress = JSON.stringify(myLatLng)
          d.resolve(tmpLatLng);
      });
      return d.promise();

  };

  /// its in meters that is the  compared lon and lat

  // Adding an event listener for when the form is submitted
  $("#registerUser").on('click', handleFormSubmit);

  // A function for handling what happens when the form to create a new user
  function handleFormSubmit(event) {
    
    var about = $("#about").val().trim();
    var firstName = $("#userFirstName").val().trim();
    var lastName = $("#userLastName").val().trim();
    var email = $("#registerEmail").val().trim();
    var genre = $("#genre").val();
    var isBand = $("#isBand").val();
    var password = $("#registerPassword").val().trim();
    var instrumentsPlayed = $("#instrumentsPlayed").val();
    var searchingFor = $("#searchingFor").val();
    var username = $("#username").val();
    var userImage = "./images/chicken.png";
    var faceBook = $("#faceBook").val();
    var reverbNation = $("#reverbNation").val();
    var soundCloud = $("#soundCloud").val();
    var userLocation = $("#userLocation").val().trim();

    
    event.preventDefault();
    
    // Don't submit unless the form is complete
    if (!password || !email) {
      return;
    }
    // Constructing a newMessage
    
    if ((userLocation != "") || $("#locationCheck").prop("checked")) {
      if ($("#locationCheck").prop("checked")) {
        getLocation().done(function(){
          var newUser = {
            email: email,
            password: password,
            username: username,
            userFirstName: firstName,
            userLastName: lastName,
            isBand: isBand,
            instrumentsPlayed: instrumentsPlayed,
            searchingFor: searchingFor,
            genre: genre,
            about: about,
            userLocation: userAddress,
            userImage: userImage,
            faceBook: faceBook,
            reverbNation: reverbNation,
            soundCloud: soundCloud
          };
            
          // submit the new user 
          submitToApi(newUser);
      
          // empty out the input fields
          $("#about").val("")
          $("#userFirstName").val("")
          $("#userLastName").val("")
          $("#registerEmail").val("")
          $("#genre").val("")
          $("#isBand").val("")
          $("#registerPassword").val("")
          $("#instrumentsPlayed").val("")
          $("#searchingFor").val("")
          $("#soundCloud").val("")
          $("#faceBook").val("")
          $("#reverbNation").val("")
        })
      }
      else {
        getUserLocation().done(function() {
          var newUser = {
            email: email,
            password: password,
            username: username,
            userFirstName: firstName,
            userLastName: lastName,
            isBand: isBand,
            instrumentsPlayed: instrumentsPlayed,
            searchingFor: searchingFor,
            genre: genre,
            about: about,
            userLocation: userAddress,
            userImage: userImage,
            faceBook: faceBook,
            reverbNation: reverbNation,
            soundCloud: soundCloud
      
      
          }; // submit the new user 
          submitToApi(newUser);
      
          // empty out the input fields
          $("#about").val("")
          $("#userFirstName").val("")
          $("#userLastName").val("")
          $("#registerEmail").val("")
          $("#genre").val("")
          $("#isBand").val("")
          $("#registerPassword").val("")
          $("#instrumentsPlayed").val("")
          $("#searchingFor").val("")
          $("#soundCloud").val("")
          $("#faceBook").val("")
          $("#reverbNation").val("")
      
      
              })
            }
    } else {
      alert("No location, Geolocation may not be working or you did not input your location in the location field")
    }
  }

  function submitToApi(user) {
    console.log("about to create user");
    $.post("/api/users", user, function(data, err) {

      console.log(JSON.stringify(data));
      console.log(JSON.stringify(err));
      if (err != "success") {
        console.log(err)
        console.log(err.message)
      }
      // else {

      //   window.location.href = '/login';
      // }
      // If there's an error, handle it by throwing up an alert
    }).catch(handleErr);
  }



  // function to handle errors
  function handleErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  // login button up in nav
  $("#loginNav").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/login';
  });


};
