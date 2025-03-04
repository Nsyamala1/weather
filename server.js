const express = require("express");
const { faker } = require("@faker-js/faker");

const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Function to generate mock weather data
const generateMockWeather = (city) => {
  const radarImageUrl = faker.image.imageUrl();
    return {
        location: {
            name: city,
            region: faker.location.state(),
            country: faker.location.country(),
        },
        current: {
            temp_f: faker.number.float({ min: 30, max: 100, precision: 0.1 }), // Temperature in Fahrenheit
            // temp_f: 105.0,
            humidity: faker.number.int({ min: 10, max: 90 }), // Humidity %
            wind_mph: faker.number.float({ min: 10, max: 50, precision: 0.1 }), // Wind speed in mph
            condition: {
                text: faker.word.sample(["Sunny", "Cloudy", "Rainy", "Stormy", "Snowy"]), // Random condition
            },
        },
        radarImageUrl,
    };
};

// Render the index template with default values for weather and error
app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null, warning: null });
});

// Handle the weather route for both API and HTML responses
app.get("/v1", (req, res) => {
  const city = req.query.city || "Unknown";

  // Generate mock weather data
  const weather = generateMockWeather(city);
  let warning = null;
  let alertMessage = null;

  // Check wind speed and set a warning if it exceeds 10 mph
  if (weather.current.wind_mph > 50) {
      warning = `Warning: High wind speed of ${weather.current.wind_mph} miles/h detected!`;
  }

  // Extreme Weather Alerts
  if (weather.current.temp_f > 100) {
      alertMessage = "Extreme Heat Alert! Stay hydrated and avoid direct sunlight.";
  } else if (weather.current.temp_f < 32) {
      alertMessage = "Freezing Temperature Alert! Wear warm clothes and be cautious on icy roads.";
  } else if (weather.current.condition.text.includes("Stormy")) {
      alertMessage = "Storm Alert! Stay indoors and avoid unnecessary travel.";
  }

  // If the request expects JSON (e.g., from the frontend JavaScript), return JSON
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.json({
      weather,
      warning,
      alertMessage,
    });
  }

  // Otherwise, render the view with the weather data
  res.render("index", { weather, error: null, warning, alertMessage });
});


// Start the server and automatically use an available port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App is running on port ${server.address().port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use. Trying another port...`);
        const dynamicServer = app.listen(0, () => {
            console.log(`App is running on port ${dynamicServer.address().port}`);
        });
    } else {
        console.error(err);
    }
});