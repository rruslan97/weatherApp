let arr = [];
const searchInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
const heartBtn = document.querySelector('.heartImage');
const weatherCity = document.querySelector('.weather__city');
const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = '8da8194e62aaeafeb77b5dff4eee24fe';


const renderLocalStorage = (arr) => {
  localStorage.setItem('city', JSON.stringify(arr))
}
const addFavoriteСity = (content) => {
  const favoriteCities = document.querySelector('.city');
  const cityContainer = document.createElement('div');
  const favoriteCity = document.createElement('li');
  const deleteBtn = document.createElement('button')

  if (arr.includes(weatherCity.textContent)) {
    return alert('Такой город уже существует')
  }

  cityContainer.className = 'city__container'
  favoriteCity.textContent = content;
  deleteBtn.className = 'delete__city'
  deleteBtn.textContent = '✖';
  favoriteCity.className = 'city__link';

  favoriteCities.appendChild(cityContainer);
  cityContainer.appendChild(favoriteCity);
  cityContainer.appendChild(deleteBtn)

  // добавление города в массив
  arr.push(favoriteCity.textContent)
  console.log(arr);

  // удаление города из избранного
  deleteBtn.addEventListener('click', () => {
    cityContainer.remove()
    arr = arr.filter(city => city != favoriteCity.textContent)
    console.log(arr);
    delete localStorage.city
    if (arr != localStorage.city) {
      renderLocalStorage(arr)
    }
  })

  // показ статистики по нажатию на город из избранного
  favoriteCity.addEventListener('click', () => {
    addCity(favoriteCity.textContent)
    addPrediction(favoriteCity.textContent)
  })
  // добавление города в локальное хранилище
  renderLocalStorage(arr)

  // анимация добавления в избранное
  heartBtn.src = 'img/heartRed.png'
  setTimeout(() => {
    heartBtn.src = 'img/heart.png'
  }, 200);
}
const addCity = (city) => {
  // проверка на пустой инпут
  if (!city) {
    return alert('ошибка')
  }
  // актуальная информация погоды
  fetch(`${serverUrl}?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const weatherTemp = document.querySelector('.weather__num');
      const weatherImage = document.querySelector('.weather__cloud');
      const sunrise = document.querySelector('.sunset__sunrise')
      const sunset = document.querySelector('.sunset__sunset')
      const feelsLike = document.querySelector('.sunset__feels')
      // узнаем температуру и вносим ее в DOM
      let temperature = Math.round(data.main.temp)
      weatherCity.textContent = data.name;
      // меняем картинку состояния погоды
      const iconId = data.weather['0'].icon;
      weatherImage.src = `https://openweathermap.org/img/wn/${iconId}@4x.png`;
      weatherTemp.textContent = temperature;
      //
      let feelseLikeTemp = Math.round(data.main.feels_like)
      feelsLike.textContent = `Ощущается как: ${feelseLikeTemp}°`
      // получаем рассвет и закат из api и забираем от туда часы и минуты
      let sunriseDate = new Date(data.sys.sunrise * 1000);
      getFormatTime(sunriseDate);
      sunrise.textContent = `Рассвет: ${getFormatTime(sunriseDate)}`

      let sunsetDate = new Date(data.sys.sunset * 1000);
      getFormatTime(sunsetDate);
      sunset.textContent = `Закат: ${getFormatTime(sunsetDate)}`
    });

}
const addPrediction = (city) => {
  // проверка на пустой инпут
  if (!city) {
    return alert('ошибка')
  }

  // прогнозы погоды на 9 часов вперед
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // элементы DOM для вноски информации с прогнозами API
      const temp12 = document.querySelector('.prediction__temp12');
      const feels12 = document.querySelector('.prediction__feels12');
      const stats12 = document.querySelector('.weather__cloud12');
      const imageIcon12 = data.list[6].weather[0].icon

      const temp15 = document.querySelector('.prediction__temp15');
      const feels15 = document.querySelector('.prediction__feels15');
      const stats15 = document.querySelector('.weather__cloud15');
      const imageIcon15 = data.list[7].weather[0].icon

      const temp18 = document.querySelector('.prediction__temp18');
      const feels18 = document.querySelector('.prediction__feels18');
      const stats18 = document.querySelector('.weather__cloud18');
      const imageIcon18 = data.list[8].weather[0].icon

      // присваем температуру для 12:00 переменной и округляем ее
      temperature12 = Math.round(data.list[6].main.temp)
      feelsLike12 = Math.round(data.list[6].main.feels_like)
      // присваем температуру для 15:00 переменной и округляем ее
      temperature15 = Math.round(data.list[7].main.temp)
      feelsLike15 = Math.round(data.list[7].main.feels_like)
      // присваем температуру для 18:00 переменной и округляем ее
      temperature18 = Math.round(data.list[8].main.temp)
      feelsLike18 = Math.round(data.list[8].main.feels_like)

      // вносим показатели в UI для 12:00
      temp12.textContent = `Температура: ${temperature12}°`
      feels12.textContent = `Ощущается как: ${feelsLike12}°`
      stats12.src = `https://openweathermap.org/img/wn/${imageIcon12}@4x.png`
      // вносим показатели в UI для 15:00
      temp15.textContent = `Температура: ${temperature15}°`
      feels15.textContent = `Ощущается как: ${feelsLike15}°`
      stats15.src = `https://openweathermap.org/img/wn/${imageIcon15}@4x.png`
      // вносим показатели в UI для 18:00
      temp18.textContent = `Температура: ${temperature18}°`
      feels18.textContent = `Ощущается как: ${feelsLike18}°`
      stats18.src = `https://openweathermap.org/img/wn/${imageIcon18}@4x.png`
    })
}
const submitCity = (e) => {
  e.preventDefault();

  addCity(searchInput.value)
  addPrediction(searchInput.value)

  searchInput.value = '';
  searchInput.focus()
}
const submitFavoriteCity = (e) => {
  e.preventDefault();

  // добавление города в избранное 
  addFavoriteСity(weatherCity.textContent)
}
const getFormatTime = (time) => {
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  return `${hours}:${minutes}`
}


searchBtn.addEventListener('click', submitCity)
heartBtn.addEventListener('click', submitFavoriteCity)
addEventListener('DOMContentLoaded', () => {
  let citiesArr = JSON.parse(localStorage.getItem('city'));
  for (let i = 0; i < citiesArr.length; i++) {
    addFavoriteСity(citiesArr[i])
  }
  if (citiesArr[0]) {
    addCity(citiesArr[0])
    addPrediction(citiesArr[0])
  } 
})




