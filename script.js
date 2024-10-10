function initMap() {
    const defaultLocation = { lat: 42.6977, lng: 23.3219 }; // Sofia, Bulgaria
    const map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 8,
    });

    window.addFishingSpots = function (spots) {
        spots.forEach(spot => {
            new google.maps.Marker({
                position: spot.location,
                map: map,
                title: spot.name,
            });
        });
    };

    window.map = map;
}

async function fetchFishingSpots() {
    const fishType = document.getElementById("fishSelect").value;
    const location = document.getElementById("locationInput").value || "Sofia";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=385ab843e31a9f9df599012cd79fe930`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Displaying weather information
        document.getElementById("weatherInfo").innerHTML = `
            <p>Weather in ${location}: ${data.weather[0].description}, Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
        `;

        // Dummy fishing spot data based on location (in real implementation, use data to determine best spots)
        const spots = [
            { name: "Spot 1", location: { lat: data.coord.lat + 0.05, lng: data.coord.lon + 0.05 } },
            { name: "Spot 2", location: { lat: data.coord.lat - 0.05, lng: data.coord.lon - 0.05 } }
        ];

        addFishingSpots(spots);
    } catch (error) {
        console.error("Error fetching fishing spots:", error);
    }
}

function searchLocation() {
    const location = document.getElementById("locationInput").value;
    if (location) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, function (results, status) {
            if (status == 'OK') {
                window.map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: window.map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}
