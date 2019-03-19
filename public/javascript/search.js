window.onload = function() {
 
  var startLat;
  var startLng;


  function distance(startLng, startLat, lon2, lat2, cb) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - startLat).toRad(); // Javascript functions in radians
    var dLon = (lon2 - startLng).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(startLat.toRad()) * Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log("Distance to user:")
    console.log(d)
    return d;
  }

  /** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }

  function getLocation() {
    function showPosition(position) {
      console.log("getting location")

      startLat = position.coords.latitude;
      startLng = position.coords.longitude;
      console.log(startLat)
      console.log(startLng)
    };
    //if geolocation is supported, the getCurrentPosition will be called
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      lattitude.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  //Call getLocation 
  getLocation();

  //Click handler for search submit button 
  $("#searchUser").on("click", function(event) {
    event.preventDefault();

    $("#cardDiv").empty();
    $(".carousel").empty();
    $('.carousel').removeClass('initialized');
    console.log($("#test5").val())


    var username = $("#profileSearchInput").val();
    console.log($("#profileSearchInput").val())
    var isBand = $("input[name=group2]:checked").val();
    var instrumentsPlayed = $("input[name=group1]:checked").val();
    var distanceAllowed
    if (parseInt($("#test5").val()) == 100) {
      distanceAllowed = 6371
    } else {
      distance = parseInt($("#test5").val())
    }
    console.log("++++++")
    console.log(distanceAllowed)

    var params = {
      "username": username,
      "isBand": isBand,
      "instrumentsPlayed": instrumentsPlayed,
    }
    
  


    $.get('/api/users/search', params, function(data) {
      let newData = []
      for (let i = 0; i < data.length; i++) {
        let resultLatLng = JSON.parse(data[i].userLocation)
        let resultLat = resultLatLng.lat
        let resultLng = resultLatLng.lng

        let d = distance(startLng, startLat, resultLng, resultLat)
        console.log("distance from click handler:")
        console.log(d)
        if (d < (distanceAllowed * 1.60934)) {
          let obj = data[i]
          let miles = (d * 0.621371).toFixed(2)
          obj["distance"] = miles
          newData.push(obj)
        }

      }
      console.log(newData)
      renderUsers(newData);
      renderCards(newData);
         document.forms['maxRange'].reset();
      document.forms['bandSearch'].reset();
      document.forms['instrumentSearched'].reset();
      $("#profileSearchInput").val("");


    });
  });

  // function to initialize our carousel
  function carouselInit() {
    $('.carousel').carousel({
      height: 600,
      width: 600,
      padding: 200,
      shift: 50,
     
    })

  }

 

  function renderUsers(data) {
    if (data.length !== 0) {
      $("#siteInfo").hide();


      $("#carouselDiv").show();

      var carousel = $("<div class='carousel section scrollspy'>"); //create brand new carousel div element
      $("#carouselDiv").append(carousel);
      data.forEach(function(result) {
        var div = $("<a class='carousel-item' href='#" + result.id + "'>").append(


          "<div class='card card-stacked-on-med-and-down horizontal-on-large userCard' id ='userCard'>" + "<div class='card-image'>" + "<img id='searchImage' src=" + result.userImage + ">" +

          "</div>" +
          "<div class='card-content'>" +
          "<h5>" + result.username + "</h5>" +
          "<p> Primary Instrument: " + result.instrumentsPlayed + "<br>" +
          " User is: " + result.distance + ' miles away' + "<br>" +
          "<p> Looking to jam with someone who plays: " + result.searchingFor + "</p>" +
          "<button data-target='contactModal' class='btn modal-trigger contact'  data-id='" + result.email + "'>Contact User</button>" +
          "<button data-target='viewProfileModal' class='btn modal-trigger view'  data-id='" + result.username + "'>View Profile</button>" +
          "</div>" +
          "</div>" +

          "</a>"
        );

        $(".carousel").append(div);
         
        //End for loop
      })
      carouselInit()

    }
  }



  function renderCards(data) {
    if (data.length !== 0) {
      $("#siteInfo").hide();
  
      data.forEach(function(result) {

        var div = $("<div class='hide-on-large-only'>").append(
          "<div class='row'>" +
          "<div class='col l10 s12'>" + "<div class='card searchCard'>" + "<div class='card-image col l4 s12'>" + "<img id='searchImage' src=" + result.userImage + ">" +
          "</div>" +
          "<div class='card-stacked'>" + "<div class='card-content'>" +
          "<h2>" + result.userFirstName + "</h2>" +
          "<p> Primary Instrument: " + result.instrumentsPlayed + "</p>" +
          "<p> User is: " + result.distance + ' miles away' + "</p>" +
          "<p> Looking to jam with someone who plays: " + result.searchingFor + "</p>" +
          "<button data-target='contactModal' class='btn modal-trigger contact'  data-id='" + result.email + "'>Contact User</button>" +
          "<button data-target='viewProfileModal' class='btn modal-trigger view'  data-id='" + result.username + "'>View Profile</button>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
        
        $("#cardDiv").append(div);
        
        //End for loop


      })

    }
  }




  // route to search in nav
  $("#searchNav").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/search';
  });

  // route to main in nav
  $("#main").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/main';
  });

  // button to logout
  $("#logout").on("click", function(event) {
    // event.preventDefault();
    $.get("/logout", function(data) {
      window.location.href = '/login';
    });
  });



  // view profile button
  $("#myProfile").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/userProfile';
  });



  // when you click on the view user profile button
  $('select').material_select();
  $('#viewProfileModal').modal({
    ready: function(modal, trigger) {
      console.log("modal ready: ")
      // gets the reciever email and hides it in #toEmail

      const username = trigger.data('id');
      $.get("api/users/username/" + username, function(data) {

        console.log("console logging data: " + data);

        $("#username").text(data.username);
        $("#name").text((data.userFirstName) + " " + (data.userLastName));
        $("#email").text(data.email);
        $("#instrument").text(data.instrumentsPlayed);
        $("#genre").text(data.genre);
        $("#inBand").text(data.isBand);
        $("#about").text(data.about);
        $(".profilePic").attr("src", data.userImage);
        $("#userStuff1").html("<a href='" + data.faceBook + "'>" + "FaceBook" + '</a>' + "<br>");
        $("#userStuff2").html("<a href='" + data.reverbNation + "'>" + "Reverb Nation" + '</a>' + "<br>");
        $("#userStuff3").html("<a href='" + data.soundCloud + "'>" + "SoundCloud" + '</a>');

      });
    }

  });


  //End onload
};
