( function( window, undefined ) {
  /*
  The module pattern improves the reduction of globally scoped variables,
  thus decreasing the chances of collision with other
  code throughout an application.
  */
  function WeatherModule() {

    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    function getId(id){
      return document.getElementById(id);
    }

    this.localWeather = function localWeather() {

      navigator.geolocation.getCurrentPosition( function(pos){

        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;
        var accuracy = pos.coords.accuracy;

        var weatherUrl = "http://api.openweathermap.org/data/2.5/weather";
        var iconUrl = "http://openweathermap.org/img/w/";
        var weatherKey = "e276abfa164dc936a0df70fead6e209a";
        var unitsFormat = 'imperial'; // metric (C) or imperial (F)
        var weatherApi = weatherUrl + '?lat=' + lat + '&lon=' + long + '&appid=' + weatherKey + '&units=' + unitsFormat;

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){

              var weatherData = JSON.parse(xmlhttp.responseText);
              var weatherPath = weatherData.weather[0];

              getId("temp").innerHTML = Math.round(weatherData.main.temp);

              getId("weather-details").innerHTML =
              "<p id='city'>" + weatherData.name +"</p>" +
              "<p id='description'>" + weatherPath.description + "</p>" +
              "<img id='icon' src='" + iconUrl + weatherPath.icon + '.png' + "' />";

              getId('unitToggle').addEventListener('click', function(){
                var currentUnit = getId('unit').innerHTML;
                var currentTemp = getId('temp').innerHTML;
                if( currentUnit === 'F'){
                  getId('unit').innerHTML = "C";
                  getId('temp').innerHTML = Math.round((currentTemp - 32) * 5 / 9);
                } else {
                  getId('unit').innerHTML = "F";
                  getId('temp').innerHTML = Math.round(currentTemp * 9 / 5 + 32);
                }
              });

            }
            else if(xmlhttp.status == 400) {
              alert('There was an error 400');
            }
            else {
              alert('something else other than 200 was returned');
            }
          }
        };

        xmlhttp.open("GET", weatherApi, true);
        xmlhttp.send();

      }, error, options);

    };

  }

  // expose access to the constructor
  window.WeatherModule = WeatherModule;

} )( window );

var WeatherModule = new WeatherModule();
WeatherModule.localWeather();
