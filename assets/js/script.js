const currentDay = dayjs();
$('#current-day').text(currentDay.format('MMMM D,YYYY'));

const app = {
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

        // API URL for 5-day forecast
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
                // Process and display the current weather data here
                console.log('Current Weather Data:', data);

                const cityNameElement = document.querySelector('.card-title');
                const temperatureElement = document.querySelector('.card-text.temperature');
                const windElement = document.querySelector('.card-text.wind');
                const humidityElement = document.querySelector('.card-text.humidity');

                
                // Update the elements with the weather data
                cityNameElement.textContent = data.name;
                temperatureElement.textContent = `Temperature: ${data.main.temp} °F`;
                windElement.textContent = `Wind: ${data.wind.speed} mph`;
                humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            })
            .catch(error => {
                console.error('Error fetching current weather data:', error.message);
            });

        // Fetch and display the 5-day forecast outside of the first catch block
        fetch(forecastApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(forecastData => {
                console.log('5-Day Forecast Data:', forecastData);
            })
            .catch(error => {
                console.error('Error fetching 5-day forecast data:', error);
            });
    }
};

// Initialize the app
app.init();


