document.addEventListener('DOMContentLoaded', () => {
    const transportationInput = document.getElementById('transportation');
    const energyInput = document.getElementById('energy');
    const wasteInput = document.getElementById('waste');
    const impactScoreElement = document.getElementById('impact-score');
    const impactFeedbackElement = document.getElementById('impact-feedback');
    const suggestedActionsElement = document.getElementById('suggested-actions');
    const newsFeed = document.getElementById('news-feed'); 
    const mapContainer = document.getElementById('map-container');

    const apiKey = '502aa99f2e9fd89a656f67ce11c616b9'; 
    const newsApiKey = 'bf729c8658cbff8ced30e6fb2e754c9d'; 

    const locations = [
    { lat: 41.9981, lon: 21.4254, name: 'Skopje', country: 'North Macedonia' },   
    { lat: 46.0569, lon: 14.5058, name: 'Ljubljana', country: 'Slovenia' },
    { lat: 52.5200, lon: 13.4050, name: 'Berlin', country: 'Germany' },
    { lat: 41.3275, lon: 19.8189, name: 'Tirana', country: 'Albania' },    
    { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'France' },
    { lat: 41.9028, lon: 12.4964, name: 'Rome', country: 'Italy' },
    { lat: 50.8503, lon: 4.3517, name: 'Brussels', country: 'Belgium' },
    { lat: 55.6761, lon: 12.5683, name: 'Copenhagen', country: 'Denmark' },
    { lat: 60.1695, lon: 24.9354, name: 'Helsinki', country: 'Finland' },
    { lat: 59.9139, lon: 10.7522, name: 'Oslo', country: 'Norway' },
    { lat: 64.1355, lon: -21.8954, name: 'Reykjavik', country: 'Iceland' },
    { lat: 40.4168, lon: -3.7038, name: 'Madrid', country: 'Spain' },
    { lat: 47.4979, lon: 19.0402, name: 'Budapest', country: 'Hungary' },
    { lat: 59.4370, lon: 24.7536, name: 'Tallinn', country: 'Estonia' },
    { lat: 56.9496, lon: 24.1052, name: 'Riga', country: 'Latvia' },
    { lat: 54.6872, lon: 25.2797, name: 'Vilnius', country: 'Lithuania' },
    { lat: 51.1657, lon: 10.4515, name: 'Berlin', country: 'Germany' },
    { lat: 53.9006, lon: 27.5590, name: 'Minsk', country: 'Belarus' },
    { lat: 49.6117, lon: 6.1319, name: 'Luxembourg City', country: 'Luxembourg' },
    { lat: 46.2044, lon: 6.1432, name: 'Geneva', country: 'Switzerland' },
    { lat: 50.0755, lon: 14.4378, name: 'Prague', country: 'Czech Republic' },
    { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
    { lat: 53.3498, lon: -6.2603, name: 'Dublin', country: 'Ireland' },
    { lat: 47.3769, lon: 8.5417, name: 'Bern', country: 'Switzerland' },
    { lat: 42.6977, lon: 23.3219, name: 'Sofia', country: 'Bulgaria' }
];


    const calculateEcoFootprint = (transportation, energy, waste) => {
        const transportationFactor = Math.min(transportation * 0.4, 100);
        const energyFactor = Math.min(energy * 0.35, 100);
        const wasteFactor = Math.min(waste * 0.25, 100);
        return (transportationFactor + energyFactor + wasteFactor) / 3;
    };

    const getFeedback = (score) => {
        if (score < 30) return 'Excellent! Your environmental impact is minimal.';
        if (score < 60) return 'Good job! There\'s room for improvement.';
        return 'Consider taking significant steps to reduce your environmental impact.';
    };

    const getSuggestedActions = (score) => {
        if (score < 30) return [
            'Continue your sustainable practices.',
            'Explore advanced eco-friendly technologies.',
            'Share your tips with others.'
        ];
        if (score < 60) return [
            'Use public transportation or carpool.',
            'Switch to energy-efficient appliances.',
            'Implement home recycling system.',
            'Reduce single-use plastic consumption.'
        ];
        return [
            'Drastically reduce carbon footprint.',
            'Invest in renewable energy solutions.',
            'Minimize waste through conscious consumption.',
            'Consider carbon offset programs.',
            'Educate yourself on sustainable living.'
        ];
    };

    const updateCalculator = () => {    
        const transportation = parseFloat(transportationInput.value) || 0;
        const energy = parseFloat(energyInput.value) || 0;
        const waste = parseFloat(wasteInput.value) || 0;

        const score = calculateEcoFootprint(transportation, energy, waste);
        impactScoreElement.textContent = score.toFixed(1);
        impactFeedbackElement.textContent = getFeedback(score);

        const suggestedActions = getSuggestedActions(score);
        suggestedActionsElement.innerHTML = suggestedActions
            .map(action => `<li>${action}</li>`)
            .join('');
    };

    const initMap = async () => {
        const map = L.map(mapContainer).setView([20, 0], 2); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        try {
            for (const location of locations) {
                const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.list && data.list.length > 0) {
                    const aqi = data.list[0].main.aqi;
                    const aqiDescription = getAQIDescription(aqi);

                    L.marker([location.lat, location.lon]).addTo(map)
                        .bindPopup(`<strong>${location.name}</strong><br>Air Quality Index: ${aqi} (${aqiDescription})`)
                        .openPopup();
                }
            }
        } catch (error) {
            console.error('Error fetching pollution data:', error);
            mapContainer.innerHTML = '<p class="text-center text-red-600">Failed to load map. Try again later.</p>';
        }
    };

    const getAQIDescription = (aqi) => {
        switch (aqi) {
            case 1: return 'Good';
            case 2: return 'Fair';
            case 3: return 'Moderate';
            case 4: return 'Poor';
            case 5: return 'Very Poor';
            default: return 'Unknown';
        }
    };

    const fetchNews = async () => {
        const query = 'ecology,nature,environment,sustainability'; 
        const url = `https://api.mediastack.com/v1/news?access_key=${newsApiKey}&languages=en&keywords=${encodeURIComponent(query)}&limit=6`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                newsFeed.innerHTML = data.data.map(article => `
                    <div class="news-card">
                        <h3>${article.title || 'No title available'}</h3>
                        <p>${article.description || 'No description available.'}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                `).join('');
            } else {
                newsFeed.innerHTML = '<p class="text-center text-red-600">No news articles found.</p>';
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            newsFeed.innerHTML = '<p class="text-center text-red-600">Failed to load news. Try again later.</p>';
        }
    };

    [transportationInput, energyInput, wasteInput].forEach(input => {
        input.addEventListener('input', updateCalculator);
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();

    initMap();
    fetchNews();
});
