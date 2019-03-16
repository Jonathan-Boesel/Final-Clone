window.onload = function() {


  var userAddress;
  var myLatLng;

  function getLocation() {
    function showPosition(position) {
      console.log("getting location")

      var startLat = position.coords.latitude;
      var startLng = position.coords.longitude;
      myLatLng = { lat: startLat, lng: startLng }
      userAddress = JSON.stringify(myLatLng)

      // 	//Once the user's address is saved in the userAddress variable, call the initMap function to load the map
      console.log(myLatLng)


    };
    //if geolocation is supported, the getCurrentPosition will be called
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      lattitude.innerHTML = "Geolocation is not supported by this browser.";
    }

  }

  getLocation();


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


    event.preventDefault();
    // Don't submit unless the form is complete
    if (!password || !email) {
      return;
    }
    // Constructing a newMessage
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


  }

  function submitToApi(user) {
    console.log("about to create user");
    $.post("/api/users", user, function(data, err) {

      console.log(JSON.stringify(data));
      console.log(JSON.stringify(err));
      if (err != "success") {
        console.log(err)
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
