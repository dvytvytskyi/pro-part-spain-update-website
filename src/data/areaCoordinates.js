export const townCoordinates = {
    "Marbella": { lat: 36.51, lng: -4.88 },
    "Estepona": { lat: 36.42, lng: -5.14 },
    "Benahavís": { lat: 36.52, lng: -5.04 },
    "Mijas": { lat: 36.60, lng: -4.64 },
    "Fuengirola": { lat: 36.54, lng: -4.62 },
    "Benalmadena": { lat: 36.60, lng: -4.53 },
    "Benalmádena": { lat: 36.60, lng: -4.53 },
    "Torremolinos": { lat: 36.62, lng: -4.50 },
    "Málaga": { lat: 36.72, lng: -4.42 },
    "Manilva": { lat: 36.38, lng: -5.25 },
    "Casares": { lat: 36.44, lng: -5.27 },
    "Sevilla": { lat: 37.39, lng: -5.99 },
    "Sotogrande": { lat: 36.29, lng: -5.28 }
};

/**
 * Returns jittered coordinates centered around a town's base coordinates.
 * This prevents markers from overlapping when multiple properties are in the same town.
 */
export const getJitteredCoordinates = (townName, index = 0) => {
    // Normalize town name to match our keys
    const normalized = townName || "Marbella";
    const base = townCoordinates[normalized] || townCoordinates["Marbella"];

    // Use index to create a deterministic spiral jitter, combined with a bit of randomness
    const angle = (index * 137.5) * (Math.PI / 180); // Golden angle for even distribution
    const radius = 0.001 * Math.sqrt(index) + (Math.random() * 0.002);

    return {
        lng: base.lng + radius * Math.cos(angle),
        lat: base.lat + radius * Math.sin(angle)
    };
};
