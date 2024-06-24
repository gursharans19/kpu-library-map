let map, userMarker, libraryMarker;
const KPU_SURREY_LIBRARY_COORDS = { lat: 49.134575, lng: -122.871006  }; // KPU Surrey Library coordinates

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: KPU_SURREY_LIBRARY_COORDS,
        zoom: 15
    });

    // Create marker for KPU Surrey Library
    libraryMarker = new google.maps.Marker({
        position: KPU_SURREY_LIBRARY_COORDS,
        map: map,
        title: "KPU Surrey Library"
    });

    // Get users location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Create marker for users location
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location"
                });

                // Center map to show both the markers
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(userLocation);
                bounds.extend(KPU_SURREY_LIBRARY_COORDS);
                map.fitBounds(bounds);

                // Calculate distance using Haversine formula
                const distance = haversineDistance(userLocation, KPU_SURREY_LIBRARY_COORDS);
                
                
                showDistance(distance);
            },
            function(error) {
                console.error("Error getting geolocation:", error);
                const distanceContainer = document.getElementById("distance-container");
                distanceContainer.textContent = "Unable to determine distance.";
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to calculate distance using Haversine formula
function haversineDistance(mk1, mk2) {
    const R = 6371.0710; // Radius of the Earth in kilometers
    const lat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
    const lat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
    const dLat = lat2 - lat1; // Radian diff
    const dLon = (mk2.lng - mk1.lng) * (Math.PI/180); // Radian diff

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kms

    return distance;
}
