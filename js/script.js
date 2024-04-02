const apiKey = 'key';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapeamento de códigos de condições climáticas para nomes de classes de ícones
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherData(location) {
    // Construa o URL da API com a localização e a chave da API
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Buscar dados meteorológicos da API
    fetch(apiUrl).then(response => response.json()).then(data => {
        // Atualize as informações de hoje
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('br', { weekday: 'long' });
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('br', { day: 'numeric', month: 'long', year: 'numeric' });
        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;

        // Atualize a localização e a descrição do clima na seção "left-info"
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        // Atualize as informações de hoje na seção "day-info"
        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = `

            <div>
                <span class="title">PRECIPITAÇÃO</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">UMIDADE</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">VELOCIDADE DO VENTO</span>
                <span class="value">${todayWindSpeed}</span>
            </div>

        `;

        // Atualizar o clima dos próximos 4 dias
        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('br', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            // Certificando que o dia não seja duplicado e hoje
            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += `
                
                    <li>
                        <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    </li>

                `;
                count++;
            }

            // Obter 4 dias distintos
            if (count === 4) break;
        }
    }).catch(error => {
        alert(`Error fetching weather data: ${error} (Api Error)`);
    });
}

// Buscar dados meteorológicos no carregamento de documentos para localização padrão (Brasil)
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Brasil';
    fetchWeatherData(defaultLocation);
});

locButton.addEventListener('click', () => {
    const location = prompt('Enter a location :');
    const location = prompt('Busque sua localização');
    if (!location) return;

    fetchWeatherData(location);
});

console.log(location);