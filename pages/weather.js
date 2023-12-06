class WeatherWidget extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      const widgetContainer = document.createElement('div');
  
      widgetContainer.innerHTML = `
        <h2>Current Weather</h2>
        <div class="weather-info">
          <div class="weather-condition" style = "display:flex;">
            <img class="condition-icon" src="" alt="Weather Icon">
            <div class = "info-container" style = "display: flex; flex-direction: column;">
            <span class="condition-text"></span>
            <span class="wind"></span>
            <span class="humidity"></span>
            </div>
          </div>
        </div>
      `;
      shadow.appendChild(widgetContainer);
      this.fetchWeatherData();
    }
  
    async fetchWeatherData() {
      try {
        const response = await fetch('https://api.weather.gov/points/32.8801,-117.2340');
        const data = await response.json();
  
        const forecastURL = data.properties.forecast;
        const forecastResponse = await fetch(forecastURL);
        const forecastData = await forecastResponse.json();
  
        const currentObservation = forecastData.properties.periods[0];

        const conditionIcon = this.shadowRoot.querySelector('.condition-icon');
        const conditionText = this.shadowRoot.querySelector('.condition-text');
        const windText = this.shadowRoot.querySelector('.wind');
        const humidityText = this.shadowRoot.querySelector('.humidity');

        conditionIcon.src = currentObservation.icon;
        conditionText.textContent += currentObservation.shortForecast;
        conditionText.textContent += " " + currentObservation.temperature;
        conditionText.textContent += "\u00b0" + currentObservation.temperatureUnit;
        windText.textContent += "wind speed: " + currentObservation.windSpeed;
        humidityText.textContent += "\n humidity: " + currentObservation.relativeHumidity.value + "%";
      } catch (error) {
        console.error('Error fetching weather:', error);
        const widgetContainer = this.shadowRoot.querySelector('.weather-widget');
        widgetContainer.textContent = 'Current Weather Conditions Unavailable';
      }
    }
  }
  
  window.customElements.define('weather-widget', WeatherWidget);