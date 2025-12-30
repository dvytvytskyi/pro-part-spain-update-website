const API_URL = import.meta.env.VITE_API_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-api-secret': API_SECRET
};

async function fetcher(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    console.log('[API Request]', url);
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

export async function getProperties(params = {}) {
    try {
        let query;
        if (params instanceof URLSearchParams) {
            query = params.toString();
        } else {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v));
                } else if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            });
            query = searchParams.toString();
        }
        return await fetcher(`/api/properties?${query}`);
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    }
}

export async function getPropertiesForMap(params = {}) {
    try {
        let query;
        if (params instanceof URLSearchParams) {
            query = params.toString();
        } else {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v));
                } else if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            });
            query = searchParams.toString();
        }
        // Use the new optimized endpoint for map data with filters
        const response = await fetcher(`/api/properties/map?${query}`);
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch map properties:', error);
        // Fallback mock data with filtering fields
        const mocks = [];
        const types = ['apartment', 'villa', 'penthouse', 'townhouse'];
        const markets = ['new-building', 'secondary', 'rent'];
        const images = [
            'https://images.unsplash.com/photo-1600596542815-6ad4c721326d?auto=format&fit=crop&w=300&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'
        ];

        for (let i = 1; i <= 40; i++) {
            const lat = 36.45 + Math.random() * 0.15;
            const lng = -5.0 + Math.random() * 0.2;
            mocks.push({
                id: i,
                coordinates: [lng, lat],
                latitude: lat,
                longitude: lng,
                price: Math.floor(200000 + Math.random() * 3000000),
                bedrooms: Math.floor(1 + Math.random() * 5),
                property_type: markets[Math.floor(Math.random() * markets.length)],
                development_name: `Luxury Property ${i}`,
                town: ['Marbella', 'Puerto Banus', 'Nueva Andalucia'][Math.floor(Math.random() * 3)],
                images: [{ image_url: images[i % images.length] }]
            });
        }
        return mocks;
    }
}

export async function getProperty(id) {
    try {
        return await fetcher(`/api/properties/${id}`);
    } catch (error) {
        console.error(`Failed to fetch property ${id}:`, error);
        return null;
    }
}

export async function getNews() {
    try {
        const data = await fetcher('/api/news');
        // Filter published and sort by date descending
        const publicNews = (Array.isArray(data) ? data : [])
            .filter((item) => item.published === true)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return publicNews;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return [];
    }
}

export async function getNewsById(id) {
    try {
        return await fetcher(`/api/news/${id}`);
    } catch (error) {
        console.error(`Failed to fetch news article ${id}:`, error);
        return null;
    }
}

export async function getFilterOptions() {
    try {
        const [locations, amenities] = await Promise.all([
            fetcher('/api/settings/locations'),
            fetcher('/api/settings/amenities')
        ]);
        return { locations, amenities };
    } catch (error) {
        console.error('Failed to fetch filter options:', error);
        return { locations: [], amenities: [] };
    }
}
