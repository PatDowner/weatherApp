

// for (let i = 0; i < 5; i++) {

//   let forecastDay = document.createElement('div')
//   forecastDay.className = 'card text-white bg-primary days'
//   forecastDay.id = `day${i}`
//   forecastDay.innerHTML = `
//   <div class="card-body">
//   <h1 id="day${i}-day" class="card-title">${forecast[i].dt_txt}</h1>

//   <h2 class="card-subtitle mb-2 text-white">Sunny</h2>

//   <p class="card-text">
//   <p id="day${i}-icon" class="text-center"><i class="fas fa-sun"></i></p>
//   <p id="day${i}-temp">Temp:x</p>
//   <p id="day${i}-humidity">Humidity: x</p>
//   </p>
//   </div>
//   `
//   document.getElementById('forecastCard').append(forecastDay)
// }

let searches = []

document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()
  console.log('clicked')
  let city = document.getElementById('city').value

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      console.log(res.data)
      document.getElementById('weather').innerHTML = `
          <div class="card-header bg-primary">
            <h1 id="searchedCity">${res.data.name}</h1>
            <h2 id="date">${forecast[i].dt_txt}</h2>
          </div>
          <div class="card-body">
            <h2 class="card-title">Today's Forecast:</h2>
            <p id="today" class="card-text">
              <h3 id="today-weather">Weather: ${res.data.weather[0].description}</h3>
              <h4 id="today-temp">Temperature: ${res.data.main.temp}</h4>
              <h4 id="today-humidity">Humidity: ${res.data.main.humidity}</h4>
              <h4 id="today-wind">Wind Speed: ${res.data.wind.speed}</h4>
            </p>
          </div>
        `
    })
    .catch(err => { console.log(err) })

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      let forecast = res.data.list

      for (let i = 5; i < forecast.length; i += 8) {
        console.log(forecast[i])
        let forecastElem = document.createElement('div')
        forecastElem.className = 'card text-white bg-primary days'
        forecastElem.id = `day${i}`
        forecastElem.innerHTML = `
        <div class="card-body">
          <h1 id="day${i}-day" class="card-title">${forecast[i].dt_txt}</h1>

          <h2 id="day${i}-weather" class="card-subtitle mb-2 text-white">Weather: ${forecast[i].weather[i].description}</h2>
          
          <div class="card-text">
            <p id="day${i}-icon" class="text-center">${forecast[i].weather[i].icon}</p>
            <h3 id="day${i}-temp">Temperature: ${forecast[i].main.temp}</h3>
            <h3 id="day${i}-humidity">Humidity: ${forecast[i].main.humidity}</h3>
            <h3 id="day${i}-wind">Wind Speed: ${forecast[i].wind.speed}</h3>
          </div>
        </div>
        `

        document.getElementById('forecastCards').append(forecastElem)
      }
      document.getElementById('5-day').classList.remove('hide')
    })
    .catch(err => { console.log(err) })
})
