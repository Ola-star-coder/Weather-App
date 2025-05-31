let weather = {
    "appKey": "b24e43fd1958b3fb6488583885d4c6ac",
    fetchWeather: function(city){
       fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="
        + city
        + "&units=metric&appid=" 
        + this.appKey
       ) 
       .then((response) => response.json())
       .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
     const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        // console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity:" + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function(){
       this.fetchWeather(document.querySelector(".search-bar").value); 
      // Clear the input field after search
      document.querySelector(".search-bar").value = "";
    }
};

let geocode = {
   reverseGeocode: function(latitude, longitude){
      var api_key = '6371594750c14167878c1657ca04926a';

      // reverse geocoding example (coordinates to address)
      var query = latitude + ',' + longitude;
    
      // forward geocoding example (address to coordinate)
      // var query = 'Pappelallee 78/79, 10437 Berlin, Germany';
      // note: query needs to be URI encoded (see below)
    
      var api_url = 'https://api.opencagedata.com/geocode/v1/json'
    
      var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent(query)
        + '&pretty=1'
        + '&no_annotations=1';
    
      // see full list of required and optional parameters:
      // https://opencagedata.com/api#required-params
    
      var request = new XMLHttpRequest();
      request.open('GET', request_url, true);
    
      request.onload = function() {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
    
        if (request.status === 200){
          // Success!
          var data = JSON.parse(request.responseText);
          weather.fetchWeather(data.results[0].components.state);
        } else if (request.status <= 500){
          // We reached our target server, but it returned an error
    
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log('error msg: ' + data.status.message);
        } else {
          console.log("server error");
        }
      };
    
      request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");
      };
    
      request.send();  // make the request
   },
   getLocation: function(){
      function success(data){
         geocode.reverseGeocode(data.coords.latitude, data.coords.longitude)
      }
      if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else{
         weather.fetchWeather("Tokyo");
      }
   }
}

document.querySelector(".search button").addEventListener("click", function(){
 weather.search();
})

document.querySelector(".search-bar").addEventListener("keypress", function(event){
   if(event.key === "Enter" ){
    event.preventDefault();
    weather.search();
   }
})

geocode.getLocation();