const link = "http://api.weatherstack.com/current?access_key=39293f99d82967a7bf6cbc63a22b0348"

const root = document.getElementById('root')
const popup = document.getElementById('popup')
const textInput = document.getElementById('text-input')
const form = document.getElementById('form')

let store = {
    city: "London",
    feelslike: 0,
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    descriptions: "",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed: {},
        pressure: {},
        uvIndex: {},
        visibility: {},
    }
}

const fetchData = async() => {
    try{
        const query = localStorage.getItem('query') || store.city
        const result = await fetch(`${link}&query=${store.city}`)
        const data = await result.json()

        const { 
            current: { 
                feelslike, 
                cloudcover, 
                temperature, 
                humidity,
                observation_time: observationTime, 
                pressure, 
                uv_index: uvIndex, 
                visibility, 
                is_day: isDay, 
                weather_descriptions: descriptions, 
                wind_speed: windSpeed 
            },
            location: { 
                name, 
                country 
            } 
        } = data

        console.log(data)

        store = {
            ...store,
            isDay,
            feelslike,
            temperature,
            observationTime,
            descriptions: descriptions[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover}%`,
                    icon: 'cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png'
                },
                windSpeed: {
                    title: 'wind speed',
                    value: `${windSpeed} km/h`,
                    icon: 'wind.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure}%`,
                    icon: 'gauge.png'
                },
                uvIndex: {
                    title: 'uv-index',
                    value: `${uvIndex} / 100`,
                    icon: 'uv-index.png'
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility}%`,
                    icon: 'visibility.png'
                },
            }
        }
        render()
    }
    catch(err){
        console.log(err)
    }
}

const getImage = (descriptions) => {
    const value = descriptions.toLowerCase()

    switch(value){
        case "partly cloudy":
            return 'partly.png'
        case "cloud":
            return 'cloud.png'
        case "fog":
            return 'fog.png'
        case "sunny":
            return 'sunny.png'
        default:
            return 'the.png'
    }

}

const renderProperties = (properties) => {
    return Object.values(properties).map(({ title, value, icon }) => {
        return `
            <div class="property">
                <div class="property-icon">
                <img src="./img/icons/${icon}" alt="">
                </div>
                <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
                </div>
            </div>
        `
    }).join("")
}

const markup = () => {

    const { city, descriptions, observationTime, temperature, isDay, properties } = store

    const containerClass = isDay === 'yes' ? "is-day" : ""

    return `<div class="container ${containerClass}">
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today in</div>
                        <div class="city-title" id="city">
                            <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                            <img class="icon" src="img/${getImage(descriptions)}" alt="" />
                        <div class="description">${descriptions}</div>
                    </div>
                    
                    <div class="top-right">
                        <div class="city-info__subtitle">as of ${observationTime}</div>
                        <div class="city-info__title">${temperature}°</div>
                    </div>
                </div>
            </div>
            <div id="properties">${renderProperties(properties)}</div>
            </div>`
}

const handleClick = () => {
    popup.classList.toggle('active')
}

const render = () => {
    root.innerHTML = markup()

    const city = document.getElementById('city')
    city.addEventListener('click', handleClick)
}

const handleInput = (event) => {
    store = {
        ...store,
        city: `${event.target.value}`
    }
}

const handleSubmit = (event) => {
    event.preventDefault()

    const value = store.city

    if(!store.city) return null

    localStorage.setItem('query', value)

    fetchData()
    handleClick()
}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput)

fetchData()