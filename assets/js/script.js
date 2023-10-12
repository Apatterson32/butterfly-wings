const currentDay = dayjs();
$('#current-day').text(currentDay.format('MMMM D, YYYY'));

const app = {
  init: () => {
    document.addEventListener('DOMContentLoaded', () => {
      const fetchButton = document.getElementById('fetch-button');
      if (fetchButton) {
        fetchButton.addEventListener('click', app.fetchWeather);
      }
    });
  },

  fetchWeather: () => {
    const apiKey = '5e92f49814b3677b10291eeca8f832e7'; 
    const units = 'imperial';
    const cityName = document.getElementById('search').value;

    const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;

    // Fetch current weather data
    fetch(currentWeatherApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Current Weather Data:', data);

        const currentDayElement = document.getElementById('current-day');
        const cityNameElement = document.querySelector('.card-title');
        const temperatureElement = document.querySelector('.card-text.temperature');
        const windElement = document.querySelector('.card-text.wind');
        const humidityElement = document.querySelector('.card-text.humidity');

        currentDayElement.textContent = currentDay.format('MMMM D, YYYY');
        cityNameElement.textContent = data.name;
        temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)} °F`; // Rounded to integer
        windElement.textContent = `Wind: ${data.wind.speed.toFixed()} MPH`;
        humidityElement.textContent = `Humidity: ${data.main.humidity.toFixed()}%`;
      })
      .catch(error => {
        console.error('Error fetching current weather data:', error.message);
      });

    // Fetch and display the 5-day forecast
    fetch(forecastApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(forecastData => {
        console.log('5-Day Forecast Data:', forecastData);

        // Processing data into a daily grouping
        const dailyForecast = {};

        forecastData.list.forEach(data => {
          const dateAndTime = data.dt_txt.split(' ');
          const date = dateAndTime[0];

          if (!dailyForecast[date]) {
            dailyForecast[date] = {
              date,
              temperatures: [],
              wind: [],
              humidity: [],
              icons: [],
            };
          }

          dailyForecast[date].temperatures.push(data.main.temp);
          dailyForecast[date].wind.push(data.wind.speed);
          dailyForecast[date].humidity.push(data.main.humidity);
          dailyForecast[date].icons.push(data.weather[0].icon);
        });

        const forecastContainer = document.getElementById('forecastData');
        let i = 1;

        for (const date in dailyForecast) {
          if (i > 5) {
            break; // Only populates data for the next 5 days
          }

          const dayData = dailyForecast[date];
          const dayElement = forecastContainer.querySelector(`.day${i} h3`);
          const iconElement = forecastContainer.querySelector(`.day${i} img.weather-icon`);
          const temperatureElement = forecastContainer.querySelector(`.day${i} .temperature`);
          const windElement = forecastContainer.querySelector(`.day${i} .wind`);
          const humidityElement = forecastContainer.querySelector(`.day${i} .humidity`);

          const avgTemperature = dayData.temperatures.reduce((acc, temp) => acc + temp, 0) / dayData.temperatures.length;
          const avgWind = dayData.wind.reduce((acc, wind) => acc + wind, 0) / dayData.wind.length;
          const avgHumidity = dayData.humidity.reduce((acc, humidity) => acc + humidity, 0) / dayData.humidity.length;

                // Formats date to look nice
        const formattedDate = dayjs(date).format('MMMM D, YYYY');
        dayElement.textContent = formattedDate;
          
          iconElement.src = `https://openweathermap.org/img/w/${dayData.icons[0]}.png`;
          temperatureElement.textContent = `Temperature: ${avgTemperature.toFixed(0)} °F`;
          windElement.textContent = `Wind: ${avgWind.toFixed(0)} mph`;
          humidityElement.textContent = `Humidity: ${avgHumidity.toFixed(0)}%`;

          i++;
        }
      })
      .catch(error => {
        console.error('Error fetching 5-day forecast data:', error.message);
      });
  },
};

app.init();




