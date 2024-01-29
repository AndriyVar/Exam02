'use strict'

const search = document.querySelector('.header__search button');
const fail = document.querySelector('.error');
const currentTemp = document.querySelector('.current__temp');
const otherList = document.querySelector('.other__list');
const box = document.querySelector('.content');
const nearby = document.querySelector('.nearby');
const week = document.querySelector('.week')

const menuItems = document.querySelectorAll('.menu__item');
const tabContents = document.querySelectorAll('.tab__contetn');
const hourlyList = document.querySelector('.hourly__list');
const hourlyHeader = document.querySelector('.hourly__header');



function handleMenuItemClick(index) {
  tabContents.forEach(tab => tab.classList.remove('active__block'));
  menuItems.forEach(item => item.classList.remove('active'));

  tabContents[index].classList.add('active__block');
  menuItems[index].classList.add('active');
}

menuItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    handleMenuItemClick(index);
  });
});




search.addEventListener('click', () => {
  const apiKey = 'd98ebbf74e9f2c07eb21d0a9d4ceced4';
  const cityName = document.querySelector('.header__search input').value;

  const weatherIcon = (data) => {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    return iconUrl;
  }

  const weatherTime = (data) => {
    const dateTime = new Date(data.dt * 1000);
    const monthNumber = dateTime.getMonth() + 1;

    let monthName;

    switch (monthNumber) {
      case 1:
        monthName = 'Jan';
        break;
      case 2:
        monthName = 'Feb';
        break;
      case 3:
        monthName = 'Mar';
        break;
      case 4:
        monthName = 'Apr';
        break;
      case 5:
        monthName = 'May';
        break;
      case 6:
        monthName = 'Jun';
        break;
      case 7:
        monthName = 'Jul';
        break;
      case 8:
        monthName = 'Aug';
        break;
      case 9:
        monthName = 'Sep';
        break;
      case 10:
        monthName = 'Oct';
        break;
      case 11:
        monthName = 'Nov';
        break;
      case 12:
        monthName = 'Dec';
        break;
      default:
        monthName = 'Inv';
    }

    return monthName;
  }



  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {

        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    })
    .then(json => {


      console.dir(json)
      const weatherDescription = json.weather[0].description;
      const currentTemperature = parseInt(json.main.temp);
      const feelsLikeTemperature = parseInt(json.main.feels_like);

      currentTemp.innerHTML = ``

      const currentTempContent = `
      <h3 class="current__title">CURRENT WEATHER</h3>
      <div class="forecast">
      <img src="${weatherIcon(json)}" alt="${weatherDescription}">
      <p>${weatherDescription}</p>
      </div>
      <div class="temperature">
      <p class="feel">${currentTemperature}&deg;C</p>
      <p class="real__feel">Real feel ${feelsLikeTemperature}&deg;C</p>
      </div>
      `;

      const headerTime = new Date(json.dt * 1000);

      hourlyHeader.innerHTML = ``;

      const header = `
          <p class="hourly__header--title">HOURLY</p>
          <p class="hourly__header--data">${weatherTime(json)} ${headerTime.getDate()}</p
          `;

      hourlyHeader.insertAdjacentHTML("afterbegin", header);

      currentTemp.insertAdjacentHTML('beforeend', currentTempContent);

      let sunriseTimestamp = json.sys.sunrise;

      let sunriseDate = new Date(sunriseTimestamp * 1000);

      let hoursSunrise = sunriseDate.getHours();
      let minutesSunrise = sunriseDate.getMinutes();

      let sunsetTimestamp = json.sys.sunset;

      let sunsetDate = new Date(sunsetTimestamp * 1000);

      let hoursSunset = sunsetDate.getHours();
      let minutesSunset = sunsetDate.getMinutes();

      let durationMilliseconds = sunsetDate - sunriseDate;

      let durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
      let durationMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

      otherList.innerHTML = ``

      const otherStr = `
      <li class="other__list--item">
            <div class="text wind">Wind:</div>
            <div class="stat wind__stat">${parseInt(json.wind.speed)} m/s</div>
        </li>
        <li class="other__list--item">
            <div class="text sunr">Sunrise:</div>
            <div class="stat sunr__stat">${hoursSunrise}:${minutesSunrise < 10 ? '0' : ''}${minutesSunrise} hr</div>
        </li>
        <li class="other__list--item">
            <div class="text suns">Sunset:</div>
            <div class="stat suns__stat">${hoursSunset}:${minutesSunset < 10 ? '0' : ''}${minutesSunset} hr</div>
        </li>
        <li class="other__list--item">
            <div class="text dur">Duration:</div>
            <div class="stat dur__stat">${durationHours}:${durationMinutes < 10 ? '0' : ''}${durationMinutes} hr</div>
        </li>
        `;

      otherList.insertAdjacentHTML("beforeend", otherStr);
    })
    .catch(error => {
      fail.innerHTML = ``;

      const failStr = `
      <div class="error__content">
          <img src="img/error.svg" alt="">
          <p>${cityName} could not be found.</p>
          <p>Please enter a different location.</p>
      </div>
      `;

      fail.insertAdjacentHTML("afterbegin", failStr);

      fail.classList.add('active__block');
      box.classList.add('unactive__block');
    });


  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}&hourly=2`)
    .then(response => response.json())
    .then(data => {

      console.dir(data)


      const hourlyData = data.list;
      hourlyList.innerHTML = '';

      const today = new Date(hourlyData[0].dt * 1000).getDate();

      for (let i = 0; i < hourlyData.length; i++) {
        const hour = hourlyData[i];
        const time = new Date(hour.dt * 1000);

        if (today == time.getDate()) {
          const listItemHTML = `
          <li class="hourly__list--item">
            <p class="time">${time.getHours()} hr</p>
            <div class="forec">
              <img src="${weatherIcon(hour)}" alt="${hour.weather[0].description}">
              <p>${hour.weather[0].description}</p>
            </div>
            <p class="temper">${parseInt(hour.main.temp)}&deg;</p>
          </li>
        `;

          hourlyList.insertAdjacentHTML('beforeend', listItemHTML);
        }

      }
    })
    .catch(error => {
      fail.innerHTML = ``;

      const failStr = `
          <div class="error__content">
              <img src="img/error.svg" alt="">
              <p>${cityName} could not be found.</p>
              <p>Please enter a different location.</p>
          </div>
      `;

      fail.insertAdjacentHTML("afterbegin", failStr);

      fail.classList.add('active__block');
      box.classList.add('unactive__block');
    });

  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Геолокація не підтримується браузером.'));
      }
    });
  }

  async function getWeatherForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.list;

    } catch (error) {
      console.error('Помилка при отриманні прогнозу погоди:', error);
      throw error;
    }
  }

  async function getWeatherForNearestCities() {
    try {
      const location = await getCurrentLocation();
      const weatherForecast = await getWeatherForecast(location.lat, location.lon);

      nearby.innerHTML = ``

      weatherForecast.forEach((city) => {

        const nearbyStr = `
            <div class="nearby__city">
                <p class="city__name">${city.name}</p>
                <div class="city__stat">
                    <img src="${weatherIcon(city)}" alt="${city.weather[0].description}">
                    <p>${parseInt(city.main.temp)}&deg;C</p>
                </div>
            </div>
            `

        nearby.insertAdjacentHTML("beforeend", nearbyStr)
      });

    } catch (error) {
      console.error('Помилка:', error.message);
    }
  }

  getWeatherForNearestCities();

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      console.dir(data);

      const days = data.list

      const daysTime = new Date(days[0].dt * 1000)

      const today = week.querySelector('.today');
      const weekDay = week.querySelector('.days');

      today.innerHTML = ``;

      const todayStr = `
      <div class="date">
          <p class="date__title"></p>
          <p class="date__data">${weatherTime(days[0])} ${daysTime.getDate()}</p>
      </div>
      <div class="temperature">
          <p class="feel">${parseInt(days[0].main.temp_max)}&deg;C</p>
          <p class="real__feel">Max temp</p>
      </div>
      <div class="temperature">
          <p class="feel">${parseInt(days[0].main.temp_min)}&deg;C</p>
          <p class="real__feel">Min temp</p>
      </div>
      <div class="forecast">
          <img src="${weatherIcon(days[0])}" alt="${days[0].weather[0].description}">
          <p>${days[0].weather[0].description}</p>
      </div>
      `

      today.insertAdjacentHTML("beforeend", todayStr);

      weekDay.innerHTML = ``;

      for (let i = 7; i <= 35; i += 8) {
        const week = days[i];
        const weekTime = new Date(week.dt * 1000);

        const daysItem = `
        <div class="days__item">
            <div class="date">
                <p class="date__title"></p>
                <p class="date__data">${weatherTime(week)} ${weekTime.getDate()}</p>
            </div>
            <div class="days__forecast">
                <img src="${weatherIcon(week)}" alt="${week.weather[0].description}">
                <p>${week.main.temp_max}</p>
                <p>${week.main.temp_min}</p>
            </div>
        </div>
        `

        weekDay.insertAdjacentHTML("beforeend", daysItem);
      }

    })
    .catch(error => {

    })

})
