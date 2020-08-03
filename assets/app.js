let searches = JSON.parse(localStorage.getItem('searches')) || []
let city = ''
let itemObj = ''

const recentSearchesList = (x) => {
  i = x
  // make new city an link item
  let recentSearch = document.createElement('a')

  // set classes for the link to become a list item for recentSearches
  recentSearch.className = 'list-group-item list-group-item-action recentSrc'

  // sets text to appear in the link list item
  recentSearch.textContent = searches[i]

  document.getElementById('recentSearches').append(recentSearch)

  document.getElementById('srcList').classList.remove('hide')
}

const todayWeather = (x) => {
  city = x
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      console.log(res.data)

      let forecast = res.data.list

      // Set last 4 rows of today's forecast in a left column and set the right column with the corresponding icon
      // also set the city & date in 2 columns. Left column city left-aligned, right column date right-aligned
      document.getElementById('weather').innerHTML = `
          <div class="card-header bg-primary">
            <h1 id="searchedCity">${res.data.name}</h1>
            <h2 id="date">${moment().format('l')}</h2>
          </div>
          <div class="card-body">
            <div class ="row">
              <div class="col-sm-6">
                <h2 class="card-title">Today's Forecast:</h2>
                <p id="today" class="card-text">
                  <h3 id="today-weather">Weather: ${res.data.weather[0].description}</h3>
                  <h4 id="today-temp">Temperature: ${res.data.main.temp}</h4>
                  <h4 id="today-humidity">Humidity: ${res.data.main.humidity}</h4>
                  <h4 id="today-wind">Wind Speed: ${res.data.wind.speed}</h4>
                </p>
              </div>
              <div class="col-sm-6">
                <p id="today-icon" class="text-center">
                  <img src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png"
                </p>
              </div>
          </div>
        `
    })
    .catch(err => { console.log(err) })
}

const forecastWeather = (x) => {
  city = x
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      let forecast = res.data.list
      // prevents it from duplicating the 5-day forecast if the search button is clicked again (because the loop appends instead of replacing)
      document.getElementById('forecastCards').innerHTML = ''

      // loop to create the 5-day forecast
      for (let i = 5; i < forecast.length; i += 8) {
        console.log('forecast')
        let forecastElem = document.createElement('div')
        forecastElem.className = 'card text-white bg-primary days'
        forecastElem.id = `day${i}`
        forecastElem.innerHTML = `
        <div class="card-body">
          <h5 id="day${i}-day" class="card-title day${i}-day">${moment(forecast[i].dt_txt).format('dddd')}, ${moment(forecast[i].dt_txt).format('l')}</h5>
          <h6 id="day${i}-weather" class="card-subtitle mb-2 text-white">Weather: ${forecast[i].weather[0].description}</h6>
          <div class="card-text">
            <p id="day${i}-icon" class="text-center"><img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png"</p>
            <p id="day${i}-temp">Temperature: ${forecast[i].main.temp}</p>
            <p id="day${i}-humidity">Humidity: ${forecast[i].main.humidity}</p>
            <p id="day${i}-wind">Wind Speed: ${forecast[i].wind.speed}</p>
          </div>
        </div>
        `

        document.getElementById('forecastCards').append(forecastElem)
      }
      document.getElementById('5-day').classList.remove('hide')
    })
    .catch(err => { console.log(err) })
}

const storeSearch = (x) => {
  let city = x
  // store search in searches
  searches.push(city)
  console.log(searches)
  localStorage.setItem('searches', JSON.stringify(searches))
  location.reload()
}

console.log(searches)
console.log(searches.length)
console.log(searches.length - 9)

if (searches.length === 0) {
  console.log(0)
} else if (searches.length <= 9) {
  city = searches[searches.length - 1]
  console.log(city)
  todayWeather(city)
  forecastWeather(city)
  for (let i = (searches.length) - 1; i >= 0; i--) {
    recentSearchesList(i)
  }
} else {
  console.log(city)
  todayWeather(city)
  forecastWeather(city)
  for (let i = (searches.length); i > (searches.length) - 9; i--) {
    recentSearchesList(i)
  }
}


// if click search button
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  console.log('clicked')

  city = document.getElementById('citySrc').value

  todayWeather(city)
  forecastWeather(city)
  storeSearch(city)
})

// if click enter while in search bar
document.getElementById('citySrc').addEventListener('keyup', event => {

  event.preventDefault()

  console.log(event.keyCode)

  if (event.keyCode === 13) {

    console.log('clicked')

    city = document.getElementById('citySrc').value


    todayWeather(city)
    forecastWeather(city)
    storeSearch(city)
  }
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('recentSrc')) {
    console.log('clicked')

    city = event.target.textContent
    console.log(city)

    todayWeather(city)
    forecastWeather(city)
    storeSearch(city)
  }
})