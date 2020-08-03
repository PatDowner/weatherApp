let searches = JSON.parse(localStorage.getItem('searches')) || []
let city = ''
let state = ''
let itemObj = ''
const recentSearchesList = (x) => {
  i = x
  // make new city an link item
  let recentSearch = document.createElement('a')

  // set classes for the link to become a list item for recentSearches
  recentSearch.className = 'list-group-item list-group-item-action recentSrc'

  // sets text to appear in the link list item
  recentSearch.textContent = `${searches[i].city}, ${searches[i].state}`

  document.getElementById('recentSearches').append(recentSearch)

  document.getElementById('srcList').classList.remove('hide')
}

const todayWeather = (x, y) => {
  city = x
  state = y
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},us&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      console.log(res.data)

      let forecast = res.data.list

      // Set last 4 rows of today's forecast in a left column and set the right column with the corresponding icon
      // also set the city & date in 2 columns. Left column city left-aligned, right column date right-aligned
      document.getElementById('weather').innerHTML = `
      <div class="card-header bg-primary row">
        <div class="col-sm-6 px-0">
          <h1 id="searchedCity">${res.data.name}</h1>
        </div>
        <div class="col-sm-6 text-right">
          <h2 id="date">${moment().format('l')}</h2>
        </div>
      </div>
      <div class="card-body">
        <h2 class="card-title">Current Weather:</h2>
        <div class ="row">
          <div class="col-sm-6">
            <p id="today" class="card-text">
              <h3 id="today-weather">${res.data.weather[0].description}</h3>
              <h4 id="today-temp">Temperature: ${res.data.main.temp}</h4>
              <h4 id="today-humidity">Humidity: ${res.data.main.humidity}</h4>
              <h4 id="today-wind">Wind Speed: ${res.data.wind.speed}</h4>
              <h4>UV Index: <span id="uvIndex" class ="px-2"></span></h4>
            </p>
          </div>
          <div class="col-sm-6">
            <p>
            <img id="today-icon" src="http://openweathermap.org/img/w/${res.data.weather[0].icon}.png"
            </p>
          </div>
        </div>
      </div>
      `

      let lon = res.data.coord.lon
      let lat = res.data.coord.lat
      axios.get(`http://api.openweathermap.org/data/2.5/uvi?appid=1dd25ac798a84daed3b612ef4b3c9a3e&lat=${lat}&lon=${lon}`)
        .then(res => {
          let uv = res.data.value
          document.getElementById('uvIndex').textContent = uv

          // Colors and color ranges taken from: https://www.epa.gov/sites/production/files/documents/uviguide.pdf
          if (uv >= 0 && uv < 3) { document.getElementById("uvIndex").style.backgroundColor = "green" }
          else if (uv >= 3 && uv < 6) { document.getElementById("uvIndex").style.backgroundColor = "yellow" }
          else if (uv >= 6 && uv < 8) { document.getElementById("uvIndex").style.backgroundColor = "orange" }
          else if (uv >= 8 && uv < 11) { document.getElementById("uvIndex").style.backgroundColor = "red" }
          else { document.getElementById("uvIndex").style.backgroundColor = "blueviolet" }
        })
        .catch(err => { console.log(err) })
    })
    .catch(err => { console.log(err) })
}



const forecastWeather = (x, y) => {
  city = x
  state = y
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},us&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      let forecast = res.data.list
      // prevents it from duplicating the 5-day forecast if the search button is clicked again (because the loop appends instead of replacing)
      document.getElementById('forecastCards').innerHTML = ''

      // loop to create the 5-day forecast
      for (let i = 3; i < forecast.length; i += 8) {
        console.log('forecast')
        let forecastElem = document.createElement('div')
        forecastElem.className = 'card text-white bg-primary days'
        forecastElem.id = `day${i}`
        forecastElem.innerHTML = `
        <div class="card-body px-2">
          <h5 id="day${i}-day" class="card-title day${i}-day">${moment(forecast[i].dt_txt).format('dddd')}, ${moment(forecast[i].dt_txt).format('l')}</h5>
          <h6 id="day${i}-weather" class="card-subtitle mb-2 text-white">${forecast[i].weather[0].description}</h6>
          <div class="card-text">
            <p id="day${i}-icon" class="text-center icon mb-1"><img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png"</p>
            <p id="day${i}-temp" class="mb-1">Temperature: ${forecast[i].main.temp}</p>
            <p id="day${i}-humidity" class="mb-1">Humidity: ${forecast[i].main.humidity}</p>
            <p id="day${i}-wind" class="mb-1">Wind Speed: ${forecast[i].wind.speed}</p>
          </div>
        </div>
        `

        document.getElementById('forecastCards').append(forecastElem)
      }
      document.getElementById('5-day').classList.remove('hide')
    })
    .catch(err => { console.log(err) })
}

const storeSearch = (x, y) => {
  let cityState = {
    city: city = x,
    state: state = y
  }
  // store search in searches
  searches.push(cityState)
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
  city = searches[searches.length - 1].city
  state = searches[searches.length - 1].state
  console.log(city, state)
  todayWeather(city, state)
  forecastWeather(city, state)
  for (let i = (searches.length) - 1; i >= 0; i--) {
    recentSearchesList(i)
  }
} else {
  city = searches[searches.length - 1].city
  state = searches[searches.length - 1].state
  console.log(city, state)
  todayWeather(city, state)
  forecastWeather(city, state)
  for (let i = (searches.length); i > (searches.length) - 9; i--) {
    recentSearchesList(i)
  }
}


// if click search button
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  console.log('clicked')

  city = document.getElementById('citySrc').value
  state = document.getElementById('stateSrc').value

  todayWeather(city, state)
  forecastWeather(city, state)
  storeSearch(city, state)
})

// if click enter while in search bar
document.getElementById('citySrc').addEventListener('keyup', event => {

  event.preventDefault()

  console.log(event.keyCode)

  if (event.keyCode === 13) {

    console.log('clicked')

    city = document.getElementById('citySrc').value
    state = document.getElementById('stateSrc').value


    todayWeather(city, state)
    forecastWeather(city, state)
    storeSearch(city, state)
  }
})

document.addEventListener('click', event => {
  if (event.target.classList.contains('recentSrc')) {
    console.log('clicked')
    const splitCity = () => {
      let str = event.target.textContent
      let res = str.split(", ")

      city = res[0]
      console.log(city)
      state = res[1]
      console.log(state)
    }

    splitCity()

    todayWeather(city, state)
    forecastWeather(city, state)
    storeSearch(city, state)
  }
})