document.addEventListener("DOMContentLoaded", () => {
  var latitude;
  var longitude;
  // Geolocation is available
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Get the latitude and longitude from the position object
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const apiKey = "";
      console.log(apiKey);

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      console.log(latitude + " " + longitude);

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setIcon(data.weather[0].main);
          setTemperature(data.main.temp, data.name);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    },
    function (error) {
      // Handle any errors that occur during the process
      console.error("Error getting geolocation:", error);
    }
  );
});

//I get all the other conditions from this link https://openweathermap.org/weather-conditions
function setIcon(weatherCondition) {
  let weatherIcon = document.getElementById("weatherImage");
  if (weatherCondition == "Mist") {
    weatherIcon.src =
      "https://png.pngtree.com/png-clipart/20230823/original/pngtree-daytime-foggy-weather-clouds-illustration-picture-image_8201381.png";
  }
}
function setTemperature(temperature, cityName) {
  let temperatureParagraph = document.getElementById("temperature");
  temperatureParagraph.textContent =
    cityName + " " + Math.round(temperature) + "°";
}
