
const apiKey = "a44ab2fdacd210645b4aeb0710e463e4";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const ipApiUrl = "https://ipapi.co/json/";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function getWeatherByCity(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) {
        throw new Error('City not found');
    }
    return response.json();
}

async function getWeatherByCoords(latitude, longitude) {
    const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    return response.json();
}

async function getUserLocation() {
    try {
        const response = await fetch(ipApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch IP location data');
        }
        const data = await response.json();
        return { latitude: data.latitude, longitude: data.longitude };
    } catch (error) {
        console.error('Error fetching user location:', error);
        return null;
    }
}

async function getDefaultWeather() {
    const location = await getUserLocation();
    if (location) {
        try {
            const data = await getWeatherByCoords(location.latitude, location.longitude);
            updateWeather(data);
        } catch (error) {
            console.error('Error fetching weather for user location:', error);
            getWeatherByCity("Brasília").then(data => {
                updateWeather(data);
            }).catch(error => {
                console.error('Error fetching default city weather:', error);
            });
        }
    } else {
        console.error('Unable to fetch user location.');
        getWeatherByCity("Brasília").then(data => {
            updateWeather(data);
        }).catch(error => {
            console.error('Error fetching default city weather:', error);
        });
    }
}

function updateWeather(data) {
    if (data.name === undefined) {
        document.querySelector(".city").innerHTML = "Cidade Inválida";
        document.querySelector(".temp").innerHTML = "";
        document.querySelector(".humidity").innerHTML = "";
        document.querySelector(".wind").innerHTML = "";
        weatherIcon.src = "";
        document.querySelector(".details").style.display = "none";
    } else {
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "./img/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "./img/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "./img/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "./img/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "./img/mist.png";
        }

        document.querySelector(".details").style.display = "flex";
    }
}

getDefaultWeather();

searchBtn.addEventListener("click", () => {
    getWeatherByCity(searchBox.value).then(data => {
        updateWeather(data);
    }).catch(error => {
        console.error('Error fetching weather for searched city:', error);
        updateWeather({ name: undefined });
    });
});

searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeatherByCity(searchBox.value).then(data => {
            updateWeather(data);
        }).catch(error => {
            console.error('Error fetching weather for searched city:', error);
            updateWeather({ name: undefined });
        });
    }
});


