document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()

  let city = document.getElementById('city').value

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      console.log(res.data)
      document.getElementById('weather').innerHTML = `
          <h1>${res.data.name}</h1>
          <h2>Weather: ${res.data.weather[0].description}</h2>
          <h3>Temperature: ${res.data.main.temp}</h3>
          <h3>Humidity: ${res.data.main.humidity}</h3>
          <h3>Wind Speed: ${res.data.wind.speed}</h3>
        `
    })
    .catch(err => { console.log(err) })

  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=1dd25ac798a84daed3b612ef4b3c9a3e`)
    .then(res => {
      let forecast = res.data.list

      for (let i = 5; i < forecast.length; i += 8) {
        console.log(forecast[i])
        let forecastElem = document.createElement('div')
        forecastElem.innerHTML = `
            <h1>${forecast[i].dt_txt}</h1>
            <h2>Weather: ${forecast[i].weather[0].description}</h2>
            <h3>Temperature: ${forecast[i].main.temp}</h3>
            <h3>Humidity: ${forecast[i].main.humidity}</h3>
            <h3>Wind Speed: ${forecast[i].wind.speed}</h3>
            `
        document.getElementById('forecast').append(forecastElem)
      }
    })
    .catch(err => { console.log(err) })
})
