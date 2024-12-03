async function fetchParkingData() {
    const response = await fetch('https://raw.githubusercontent.com/Jsaking11/SD330/main/parking.json');
    if (!response.ok) {
        throw new Error('Failed to fetch parking data');
    }
    return response.json();
}

// Populate parking lots on `list_lots.html`
async function displayParkingLots() {
    try {
        const data = await fetchParkingData();
        const lotsContainer = document.getElementById('lots-container');

        data.parkingLots.forEach(lot => {
            const lotCard = document.createElement('div');
            lotCard.classList.add('lot-card');
            lotCard.innerHTML = `
                <h2>${lot.name}</h2>
                <p><strong>Location:</strong> ${lot.location}</p>
                <p><strong>Total Spaces:</strong> ${lot.totalSpaces}</p>
                <p><strong>Comments:</strong> ${lot.comments}</p>
                <p><strong>Security Cameras:</strong> ${lot.securityCameras ? 'Yes' : 'No'}</p>
                <p><strong>Lighting:</strong> ${lot.lighting}</p>
                <a href="spaces.html?lot=${encodeURIComponent(lot.name)}">View Spaces</a>
            `;
            lotsContainer.appendChild(lotCard);
        });
    } catch (error) {
        console.error('Error displaying parking lots:', error);
        const lotsContainer = document.getElementById('lots-container');
        lotsContainer.innerHTML = '<p>Failed to load parking lots. Please try again later.</p>';
    }
}

// Populate spaces for a specific lot on `spaces.html`
async function displayLotSpaces() {
    try {
        const params = new URLSearchParams(window.location.search);
        const lotName = params.get('lot');

        if (!lotName) {
            document.body.innerHTML = '<h1>Error: No lot specified!</h1>';
            return;
        }

        const data = await fetchParkingData();
        const lot = data.parkingLots.find(l => l.name === lotName);

        if (!lot || !lot.spaces) {
            document.body.innerHTML = '<h1>Error: Lot not found or no spaces available!</h1>';
            return;
        }

        const spacesContainer = document.getElementById('spaces-container');
        spacesContainer.innerHTML = `<h2>Spaces for ${lot.name}</h2>`;

        lot.spaces.forEach(space => {
            const spaceCard = document.createElement('div');
            spaceCard.classList.add('space-card');
            spaceCard.innerHTML = `
                <p><strong>Space ID:</strong> ${space.spaceID}</p>
                <p><strong>Type:</strong> ${space.type}</p>
                <p><strong>Status:</strong> ${space.status}</p>
                <p><strong>Reserved Date:</strong> ${space.reservedDateTime || 'N/A'}</p>
                <p><strong>Filled Date:</strong> ${space.filledDateTime || 'N/A'}</p>
            `;
            spacesContainer.appendChild(spaceCard);
        });
    } catch (error) {
        console.error('Error displaying lot spaces:', error);
        const spacesContainer = document.getElementById('spaces-container');
        spacesContainer.innerHTML = '<p>Failed to load parking spaces. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lots-container')) {
        displayParkingLots();
    } else if (document.getElementById('spaces-container')) {
        displayLotSpaces();
    }
});

