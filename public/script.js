// Handle the form submission to fetch weather data
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");

cityForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value;

  // Fetch weather data (this will trigger the /v1 API route)
  try {
    const response = await fetch(`/v1?city=${city}`, {
      headers: { 'Accept': 'application/json' } // Ensure JSON is returned
    });

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Display weather data and warnings in the HTML
    displayWeather(data.weather);
    displayWarning(data.warning);
    displayAlertMessage(data.alertMessage);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("There was an issue fetching the weather data. Please try again later.");
  }
});

// Update the weather display with the fetched data
function displayWeather(weather) {
  const weatherDataDiv = document.getElementById("weather-data");

  // Check if the element exists
  if (!weatherDataDiv) return;

  const temp = weather.current.temp_f;
  const condition = weather.current.condition.text;
  const windSpeed = weather.current.wind_mph;

  weatherDataDiv.innerHTML = `
    <p><i class="fas fa-house-user"></i> ${weather.location.name}</p>
    <p><i class="fas fa-thermometer-half"></i> Temperature: ${temp}°F</p>
    <p><i class="fas fa-cloud"></i> Condition: ${condition}</p>
    <p><i class="fas fa-wind"></i> Wind Speed: ${windSpeed} mph</p>
  `;
}

// Display any warnings (e.g., high wind speed) if they exist
function displayWarning(warning) {
  const warningDiv = document.getElementById("warning");

  // Check if the element exists
  if (!warningDiv) return;

  if (warning) {
    warningDiv.innerHTML = `<p style="color: orange;"><i class="fas fa-exclamation-triangle"></i> ${warning}</p>`;
  } else {
    warningDiv.innerHTML = ""; // Clear warning if none
  }
}

// Display any weather alerts (e.g., extreme heat, storm)
function displayAlertMessage(alertMessage) {
  const alertMessageDiv = document.getElementById("alert-message");

  // Check if the element exists
  if (!alertMessageDiv) return;

  if (alertMessage) {
    alertMessageDiv.innerHTML = `<p style="color: red;"><i class="fas fa-exclamation-circle"></i> ${alertMessage}</p>`;
  } else {
    alertMessageDiv.innerHTML = ""; // Clear alert message if none
  }
}