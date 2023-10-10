const currentDay = dayjs();
$('#current-day').text(currentDay.format('MMMM D, YYYY'));

// Define weatherIcons object
const weatherIcons = {
    '01d': 'sun-icon.png',
    '02d': 'partly-cloudy-icon.png',
    '03d': 'cloudy-icon.png',
    '04d': 'cloudy-icon.png',
    '09d': 'rain-icon.png',
    '10d': 'rain-icon.png',
};

const app = {
    forecastApiUrl: '', 

    init: () => {
        document.addEventListener('DOMContentLoaded', () => {
            // Event listener to the "fetch-button"
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
        app.forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;

        fetch(currentWeatherApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Process and display the current weather data here
                console.log('Current Weather Data:', data);

                const currentDayElement = document.getElementById('current-day');
                const cityNameElement = document.querySelector('.card-title');
                const temperatureElement = document.querySelector('.card-text.temperature');
                const windElement = document.querySelector('.card-text.wind');
                const humidityElement = document.querySelector('.card-text.humidity');

                currentDayElement.textContent = currentDay.format('MMMM D, YYYY');
                cityNameElement.textContent = data.name;
                temperatureElement.textContent = `Temperature: ${data.main.temp} °F`;
                windElement.textContent = `Wind: ${data.wind.speed} mph`;
                humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error.message);
            });

        // Fetch and display the 5-day forecast
        fetch(app.forecastApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(forecastData => {
                console.log('5-Day Forecast Data:', forecastData);

                const forecastContainer = document.getElementById('forecastData');

                for (let i = 1; i <= 5; i++) {
                    const dayElement = forecastContainer.querySelector(`.day${i} h3`);
                    const iconElement = forecastContainer.querySelector(`.day${i} img.weather-icon`);
                    const temperatureElement = forecastContainer.querySelector(`.day${i} .temperature`);
                    const windElement = forecastContainer.querySelector(`.day${i} .wind`);
                    const humidityElement = forecastContainer.querySelector(`.day${i} .humidity`);

                    // Extract the data from the forecastData for this day
                    const dayData = forecastData.list[i - 1];
                    const date = dayData.dt_txt; // Extract the needed date
                    const temperature = dayData.main.temp; // Extract temperature
                    const weatherConditionCode = dayData.weather[0].icon; // Extract weather condition code
                    const wind = dayData.wind.speed;
                    const humidity = dayData.main.humidity;

                    // Set elements content based on the extracted data
                    dayElement.textContent = date;

                    const iconUrl = `https://openweathermap.org/img/w/${weatherConditionCode}.png`;

                    // Set the source attribute of iconElement to load the weather icon from the URL
                    iconElement.src = iconUrl;

                    temperatureElement.textContent = `Temperature: ${temperature} °F`;
                    windElement.textContent = `Wind: ${wind} mph`;
                    humidityElement.textContent = `Humidity: ${humidity}%`;
                }
            })
            .catch(error => {
                console.error('Error fetching 5-day forecast data:', error.message);
            });
    },
};

app.init();
