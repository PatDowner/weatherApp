// If first visit: establishes searches array for data storage. If subsequent visit, will recall the info from previous visit.
let searches = JSON.parse(localStorage.getItem('searches')) || []

// sets up necessary variables for later access
let city = ''
let state = ''
let itemObj = ''

// function to add search terms to recent searches list on side bar
const recentSearchesList = (x) => {
  // picks up the i-value from the loop below in the if statement that's about searches.length
  i = x

  // Create a link item to store new search in
  let recentSearch = document.createElement('a')

  // set classes for the link to become a list item for recentSearches
  recentSearch.className = 'list-group-item list-group-item-action recentSrc'

  // sets text to appear in the link list item
  recentSearch.textContent = `${searches[i].city}, ${searches[i].state}`

  // puts the link in the list
  document.getElementById('recentSearches').append(recentSearch)

  // shows the list (hidden if searches[] is blank)
  document.getElementById('srcList').classList.remove('hide')
}

// function to populate today's current weather info. Gets x and y from the loop below in the if statement that's about searches.length
const todayWeather = (x, y) => {
  // sets up necessary variables
  city = x
  state = y

  // reference to the Open Weather API for current weather data
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},us&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {

      // setting part of the request as a variable to reduce repetition
      let forecast = res.data.list

      // Set last 5 rows of today's forecast in a left column and set the right column with the corresponding weather icon
      // also sets the city & date in 2 columns as well as the forecast & icon in two columns
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
              <h4 id="today-temp">Temperature: ${Math.round(res.data.main.temp)}&#176;F</h4>
              <h4 id="today-humidity">Humidity: ${Math.round(res.data.main.humidity)}%</h4>
              <h4 id="today-wind">Wind: ${Math.round(res.data.wind.speed)} mph</h4>
              <h4>UV Index: <span id="uvIndex" class ="px-2"></span></h4>
            </p>
          </div>
          <div class="col-sm-6">
            <p>
            <img id="today-icon" src="https://openweathermap.org/img/w/${res.data.weather[0].icon}.png"
            </p>
          </div>
        </div>
      </div>
      `

      // sets longitude and latitude for pulling the UV Index
      let lon = res.data.coord.lon
      let lat = res.data.coord.lat

      // reference to Open Weather API that contains UV Index info
      axios.get(`http://api.openweathermap.org/data/2.5/uvi?appid=1dd25ac798a84daed3b612ef4b3c9a3e&lat=${lat}&lon=${lon}`)
        .then(res => {
          // setting part of the request as a variable to reduce repetition
          let uv = Math.round(res.data.value)

          // sets text content of uvIndex to the value from the API
          document.getElementById('uvIndex').textContent = uv

          // Colors and color ranges below taken from: https://www.epa.gov/sites/production/files/documents/uviguide.pdf are used to indicate levels
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

// function to populate the 5-day forecast info. Gets x and y from the loop below in the if statement that's about searches.length
const forecastWeather = (x, y) => {
  // sets up necessary variables for later access
  city = x
  state = y

  // reference to Open Weather API for forecasted data
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},us&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      // setting part of the request as a variable to reduce repetition
      let forecast = res.data.list
      // prevents it from duplicating the 5-day forecast if the search button is clicked again (because the loop appends instead of replacing)
      document.getElementById('forecastCards').innerHTML = ''

      // loop to create the 5-day forecast
      // it seems like this data isn't accurate. I think the forecast one counts based on current time. I don't think we can set a static i value to start with. Is this a problem?
      for (let i = 0; i < forecast.length; i++) {
        // create a div forecastElem
        if (forecast[i].dt_txt.indexOf('15:00:00') !== -1) {


          let forecastElem = document.createElement('div')
          // set the class names for that div
          forecastElem.className = 'card text-white bg-primary days'
          // give the div an id
          forecastElem.id = `day${i}`

          // set the html for the div. Contains day of the week, date, general weather description, an icon representing the weather, temperature, humidity, and wind
          forecastElem.innerHTML = `
        <div class="card-body px-2">
          <h5 id="day${i}-day" class="card-title day${i}-day">${moment(forecast[i].dt_txt).format('dddd')}, ${moment(forecast[i].dt_txt).format('l')}</h5>
          <h6 id="day${i}-weather" class="card-subtitle mb-2 text-white">${forecast[i].weather[0].description}</h6>
          <div class="card-text">
            <p id="day${i}-icon" class="text-center icon mb-1"><img src="http://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png"</p>
            <p id="day${i}-temp" class="mb-1">Temperature: ${Math.round(forecast[i].main.temp_max)}&#176;F</p>
            <p id="day${i}-humidity" class="mb-1">Humidity: ${Math.round(forecast[i].main.humidity)}%</p>
            <p id="day${i}-wind" class="mb-1">Wind: ${Math.round(forecast[i].wind.speed)} mph</p>
          </div>
        </div>
        `
          // place the forecastElem div at the end of the item with the id forecastCards
          document.getElementById('forecastCards').append(forecastElem)
        }
      }
      // shows item with the id 5-day (hidden if searches[] is blank)
      document.getElementById('5-day').classList.remove('hide')
    })
    .catch(err => { console.log(err) })
}

// Function to place the search info into localStorage to be recalled later. Gets x and y from the loop below in the if statement that's about searches.length
const storeSearch = (x, y) => {
  // sets up object for storing in searches[] with a city value and a state value
  let cityState = {
    city: city = x,
    state: state = y
  }
  // adds object for this search to searches[]
  searches.push(cityState)

  // store searches in localStorage
  localStorage.setItem('searches', JSON.stringify(searches))

  // refreshes page to show most recent search on the recent searches list
  location.reload()
}

// if there's nothing in the searches array, do nothing
if (searches.length === 0) {
  console.log(0)
  // if there's less than or equal to 9 items in the searches array...
} else if (searches.length <= 9) {
  // set the value for city and state
  city = searches[searches.length - 1].city
  state = searches[searches.length - 1].state

  // display today's weather for most recently searched city
  todayWeather(city, state)
  // display 5-day forecast for most recently searched city
  forecastWeather(city, state)
  // runs function to populate the searches list
  for (let i = (searches.length) - 1; i >= 0; i--) {
    recentSearchesList(i)
  }
} else {
  // set the value for city and state
  city = searches[searches.length - 1].city
  state = searches[searches.length - 1].state

  // display today's weather for most recently searched city
  todayWeather(city, state)
  // display 5-day forecast for most recently searched city
  forecastWeather(city, state)
  // runs function to populate the searches list
  for (let i = (searches.length) - 1; i >= (searches.length) - 9; i--) {
    recentSearchesList(i)
  }
}


// if search button is clicked...
document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault()

  // if search empty or incomplete
  if (document.getElementById('citySrc').value === '') {
    alert('Error: Enter a city name.')
  } else if (document.getElementById('citySrc').value === '') {
    alert('Error: Choose a state.')
  }
  // set the value for city and state
  city = document.getElementById('citySrc').value
  state = document.getElementById('stateSrc').value

  // display today's weather for searched city
  todayWeather(city, state)
  // display 5-day forecast for searched city
  forecastWeather(city, state)
  // store searched city in localStorage
  storeSearch(city, state)

})

// listen for a certain key entry while in search bar... (currently not working)
document.getElementById('citySrc').addEventListener('keyup', event => {
  event.preventDefault()


  console.log(event.keyCode)

  // if enter is hit while in search bar...
  if (event.keyCode === 13) {

    console.log('clicked')

    // set the value for city and state
    city = document.getElementById('citySrc').value
    state = document.getElementById('stateSrc').value

    // display today's weather for searched city
    todayWeather(city, state)
    // display 5-day forecast for searched city
    forecastWeather(city, state)
    // store searched city in localStorage
    storeSearch(city, state)
  }
})

// global click listener
document.addEventListener('click', event => {
  // if one of the items in the recent searches list is clicked...
  if (event.target.classList.contains('recentSrc')) {
    // splits the text value of the list item into city and state
    const splitCity = () => {
      let str = event.target.textContent
      let res = str.split(", ")

      city = res[0]
      console.log(city)
      state = res[1]
      console.log(state)
    }
    splitCity()

    // display today's weather for searched city
    todayWeather(city, state)
    // display 5-day forecast for searched city
    forecastWeather(city, state)
    // store searched city in localStorage
    storeSearch(city, state)
  }
})