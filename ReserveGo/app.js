// Global variables to store restaurant data
let allRestaurants = [];
let currentMap;
let currentUserLocation;
let allMarkers = [];

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentUserLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            currentMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: currentUserLocation,
            });
            
            // User's location marker
            new google.maps.Marker({
                position: currentUserLocation,
                map: currentMap,
                title: "Tu ubicación",
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
            
            const service = new google.maps.places.PlacesService(currentMap);
            
            service.nearbySearch({
                location: currentUserLocation,
                radius: 1500,
                type: ['restaurant']
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Reset arrays
                    allRestaurants = [];
                    allMarkers.forEach(marker => marker.setMap(null));
                    allMarkers = [];
                    
                    const cardsContainer = document.querySelector('.cards-container');
                    cardsContainer.innerHTML = '';
                    
                    // Process and store details for each restaurant
                    results.slice(0, 6).forEach(restaurant => {
                        service.getDetails(
                            {
                                placeId: restaurant.place_id,
                                fields: ['formatted_phone_number', 'website', 'opening_hours', 'photos', 'types']
                            },
                            (placeDetails, detailStatus) => {
                                if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
                                    const distance = google.maps.geometry.spherical.computeDistanceBetween(
                                        new google.maps.LatLng(currentUserLocation),
                                        restaurant.geometry.location
                                    ) / 1000;
                                    
                                    // Categorize cuisine type
                                    const cuisineType = determineCuisineType(placeDetails.types);
                                    
                                    // Determine price level
                                    const priceLevel = getPriceLevel(restaurant.price_level);
                                    
                                    const restaurantData = {
                                        ...restaurant,
                                        details: placeDetails,
                                        distance: distance,
                                        cuisineType: cuisineType,
                                        priceLevel: priceLevel
                                    };
                                    
                                    allRestaurants.push(restaurantData);
                                    
                                    // Render restaurant card
                                    renderRestaurantCard(restaurantData, currentMap);
                                }
                            }
                        );
                    });
                    
                    // Setup filter event listeners after restaurants are loaded
                    setupFilterListeners();
                } else {
                    console.error('Error en la búsqueda de lugares:', status);
                }
            });
        }, function() {
            alert('Error: No se pudo obtener tu ubicación.');
        });
    } else {
        alert('Error: Tu navegador no soporta geolocalización.');
    }
}

function determineCuisineType(types) {
    const cuisineMap = {
        // Cocina internacional
        'mexican': 'mexicana',
        'italian': 'italiana', 
        'chinese': 'china',
        'japanese': 'japonesa',
        'korean': 'coreana',
        'indian': 'india',
        'thai': 'tailandesa',
        'vietnamese': 'vietnamita',
        'spanish': 'española',
        'french': 'francesa',
        'greek': 'griega',
        'turkish': 'turca',
        'mediterranean': 'mediterránea',

        // Tipos específicos de comida
        'pizza': 'pizzería',
        'sushi': 'sushi',
        'burger': 'hamburguesas',
        'barbecue': 'barbacoa',
        'sandwich': 'sandwiches',
        'seafood': 'mariscos',
        'steak': 'carnes',
        'vegetarian': 'vegetariana',
        'vegan': 'vegana',
        'salad': 'ensaladas',
        'cafe': 'cafetería',
        'bakery': 'panadería',
        'dessert': 'postres',

        // Cocina regional americana
        'american': 'americana',
        'texmex': 'tex-mex',
        'southern': 'cocina sureña',

        // Cocina latinoamericana
        'brazilian': 'brasileña',
        'peruvian': 'peruana',
        'argentinian': 'argentina',

        // Otros tipos
        'fast_food': 'comida rápida',
        'grill': 'parrilla'
    };

    // Verificación de tipos más flexible
    if (types) {
        for (let type of types) {
            // Convertir a minúsculas para comparación
            type = type.toLowerCase();
            
            // Verificar si el tipo está en el mapa de cocinas
            for (let cuisineKey in cuisineMap) {
                if (type.includes(cuisineKey)) {
                    return cuisineMap[cuisineKey];
                }
            }
        }
    }
    return 'otros';
}

function getPriceLevel(level) {
    switch(level) {
        case 1: return '$';
        case 2: return '$$';
        case 3: return '$$$';
        default: return '$';
    }
}

function renderRestaurantCard(restaurant, map) {
    const cardsContainer = document.querySelector('.cards-container');
    
    // Get restaurant photo or use placeholder
    const restaurantPhoto = restaurant.details.photos && restaurant.details.photos.length > 0
        ? restaurant.details.photos[0].getUrl({maxWidth: 400, maxHeight: 250})
        : 'https://via.placeholder.com/400x250?text=Restaurante';
    
    const phoneInfo = restaurant.details.formatted_phone_number 
        ? `<div class="restaurant-contact">
            <i class="fas fa-phone"></i> ${restaurant.details.formatted_phone_number}
           </div>` 
        : '';
    
    const websiteLink = restaurant.details.website
        ? `<a href="${restaurant.details.website}" target="_blank" class="website-link">
            <i class="fas fa-globe"></i> Sitio Web
           </a>`
        : '';
    
    const openStatus = restaurant.details.opening_hours
        ? (restaurant.details.opening_hours.open_now 
            ? '<span class="open-status open">Abierto Ahora</span>' 
            : '<span class="open-status closed">Cerrado</span>')
        : '<span class="open-status unknown">Estado Desconocido</span>';
    
    const card = document.createElement('div');
    card.classList.add('restaurant-card', 'modern-card');
    card.dataset.cuisine = restaurant.cuisineType;
    card.dataset.priceLevel = restaurant.priceLevel;
    card.dataset.rating = restaurant.rating || 0;
    
    card.innerHTML = `
        <div class="restaurant-card-image">
            <img src="${restaurantPhoto}" alt="${restaurant.name}">
            ${openStatus}
        </div>
        <div class="restaurant-card-content">
            <div class="restaurant-card-header">
                <h3>${restaurant.name}</h3>
                <div class="restaurant-rating">
                    <i class="fas fa-star"></i> 
                    ${restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                </div>
            </div>
            <div class="restaurant-card-details">
                <p class="restaurant-address">
                    <i class="fas fa-map-marker-alt"></i> ${restaurant.vicinity}
                </p>
                <div class="restaurant-meta">
                    <span class="restaurant-distance">
                        <i class="fas fa-route"></i> ${restaurant.distance.toFixed(2)} km
                    </span>
                    ${phoneInfo}
                </div>
            </div>
            <div class="restaurant-card-actions">
                ${websiteLink}
                <button class="reserve-btn" data-name="${restaurant.name}">
                    <i class="fas fa-calendar-check"></i> Reservar
                </button>
            </div>
        </div>
    `;
    
    // Create marker
    const marker = new google.maps.Marker({
        position: restaurant.geometry.location,
        map: map,
        title: restaurant.name,
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Store marker for potential future filtering
    allMarkers.push(marker);
    
    // Add reserve button event listener to redirect to reservar.html
    const reserveBtn = card.querySelector('.reserve-btn');
    reserveBtn.addEventListener('click', () => {
        // Redirige a reservar.html con el nombre del restaurante en la URL
        window.location.href = `reservar.html?restaurant=${encodeURIComponent(restaurant.name)}`;
    });
    
    cardsContainer.appendChild(card);
}

function setupFilterListeners() {
    const searchInput = document.getElementById('restaurant-search');
    const cuisineFilter = document.getElementById('cuisine-filter');
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');
    
    function applyFilters() {
        const searchTerm = searchInput.value.trim().toLowerCase(); // Trim whitespace
        const selectedCuisine = cuisineFilter.value;
        const selectedPrice = priceFilter.value;
        const selectedRating = parseFloat(ratingFilter.value) || 0;
        
        const cards = document.querySelectorAll('.restaurant-card');
        
        cards.forEach((card, index) => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const rating = parseFloat(card.dataset.rating);
            const cuisine = card.dataset.cuisine;
            const priceLevel = card.dataset.priceLevel;
            
            // Use a more flexible search with term splitting
            const nameMatch = searchTerm === '' || 
                searchTerm.split(' ').every(term => name.includes(term));
            
            const cuisineMatch = !selectedCuisine || cuisine === selectedCuisine;
            const priceMatch = !selectedPrice || priceLevel === selectedPrice;
            const ratingMatch = rating >= selectedRating;
            
            if (nameMatch && cuisineMatch && priceMatch && ratingMatch) {
                card.style.di
                
                
                
                
                splay = 'flex';
                // Show corresponding marker
                if (allMarkers[index]) {
                    allMarkers[index].setMap(currentMap);
                }
            } else {
                card.style.display = 'none';
                // Hide corresponding marker
                if (allMarkers[index]) {
                    allMarkers[index].setMap(null);
                }
            }
        });
    }
    
    // Add event listeners to filter inputs
    searchInput.addEventListener('input', applyFilters);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if in a form
            applyFilters();
        }
    });
    
    cuisineFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
}


function handleReservationSubmit(restaurantName) {
    const form = document.getElementById('reservation-form');
    const formData = new FormData(form);
    
    // Collect form data
    const reservationDetails = {
        restaurante: restaurantName,
        nombre: formData.get('name'),
        email: formData.get('email'),
        telefono: formData.get('phone'),
        fecha: formData.get('date'),
        hora: formData.get('time'),
        personas: formData.get('guests'),
        notas: formData.get('notes') || 'Sin notas adicionales'
    };

    // Here you can add logic to send the reservation 
    // For example, save to localStorage or send to a backend
    console.log('Detalles de la Reserva:', reservationDetails);
    
    // Show confirmation message
    alert(`¡Reserva confirmada para ${restaurantName}!\nFecha: ${reservationDetails.fecha}\nHora: ${reservationDetails.hora}`);
    
    // Close modal
    const modal = document.getElementById('reservation-modal');
    modal.style.display = 'none';
}
