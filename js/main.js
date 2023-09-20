'use strict'

const $input = document.querySelector('.input') 
const $button = document.querySelector('.button')

const $ip = document.querySelector('.ip')
const $location = document.querySelector('.location')
const $timezone = document.querySelector('.timezone')
const $isp = document.querySelector('.isp')

async function createMap(ipOrDomain) {
    const API = `https://geo.ipify.org/api/v2/country,city?apiKey=at_6gvXZtImjQ0uYdFPA7pSY1mwKwLwR`

    const suffix = (() => {
        return (
            /^(\d{1,3}\.){3}\d{1,3}$/.test(ipOrDomain)
            ? '&ipAddress='
            :'&domain='
        )
    })()

    try {
        const res = await fetch(ipOrDomain ? API + suffix + ipOrDomain : API)
        const data = await res.json()

        const { ip } = data
        const { lat, lng, city, region, timezone } = data.location
        const { isp } = data

        let mapContainer = document.querySelector('#map')
        document.querySelector('.main').removeChild(mapContainer)
        mapContainer = document.createElement('div')
        mapContainer.setAttribute('id', 'map')
        document.querySelector('.main').appendChild(mapContainer)

        const map = L.map('map').setView([lat, lng], 13)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        L.marker([lat, lng]).addTo(map)

        $ip.textContent = ip
        $location.textContent = `${city}, ${region}`
        $timezone.textContent = 'UTC ' + timezone
        $isp.textContent = isp
    } catch (error) {
        alert('Ha ocurrido un problema')
    }
}

createMap()

$button.addEventListener('click', () => createMap($input.value))

window.addEventListener('keydown', event => {
    if (event.key === 'Enter')
        createMap($input.value)
})