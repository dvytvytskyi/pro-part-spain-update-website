
// Generate Price Options for Buy (New Building, Secondary)
export const generateBuyPriceOptions = () => {
    const options = [];
    let current = 200000;

    // Step 100K until 1.5M
    while (current <= 1500000) {
        options.push({ value: current, label: `€${(current / 1000).toLocaleString()}k` });
        current += 100000;
    }

    // Step 200K until 2.5M
    // First step after 1.5M becomes 1.7M
    // Logic: if current is 1.6M (1.5 + 100k), we should be stepping by 200k from 1.5M?
    // User said "until 1.5M, then 200K step until 2.5M". 
    // Assuming 1.5M is included. Next is 1.7M.

    // Adjust current if needed to align? current is 1.6M now. 
    // Let's reset loop logic slightly to be safe.
    // Reset current to last pushed? No.
    // 1.5M was pushed. now current = 1.6M.
    // Logic: The "step" changes.
    // Let's rewrite cleaner.

    // We can just refill options to be sure
    const prices = [];

    // 200k to 1.5M (step 100k)
    for (let p = 200000; p <= 1500000; p += 100000) {
        prices.push(p);
    }

    // 1.5M to 2.5M (step 200k)
    // Start from 1.7M
    for (let p = 1700000; p <= 2500000; p += 200000) {
        prices.push(p);
    }

    // 1M until 10M
    // Next after 2.5M + 200k = 2.7M. But we want step 1M.
    // "then step 1M to 10M".
    // Start from 3M? Or 3.5M?
    // Usually round numbers. Let's start from 3M.
    for (let p = 3000000; p <= 10000000; p += 1000000) {
        prices.push(p);
    }

    // 10M to 50M (step 10M) -- Wait, Step 10M?
    // "then step 10M to €50M"
    for (let p = 20000000; p <= 50000000; p += 10000000) {
        prices.push(p);
    }

    return prices.map(p => ({
        value: p,
        label: p >= 1000000 ? `€${(p / 1000000).toLocaleString()}M` : `€${(p / 1000).toLocaleString()}k`
    }));
};

// Generate Price Options for Rent
export const generateRentPriceOptions = () => {
    const prices = [];

    // 1500 to 5000, step 200
    for (let p = 1500; p <= 5000; p += 200) {
        prices.push(p);
    }

    // 5000 to 20000+, step 1K
    for (let p = 6000; p <= 20000; p += 1000) {
        prices.push(p);
    }

    // "and more" - maybe add a higher cap or just stop at 20k? 
    // User said "to 20 000 and more step is 1K".
    // I'll stop at 20k for filter list, or add 25k, 30k?
    // I'll add up to 50k with larger steps just in case?
    // User instruction was specific "step is 1K". I'll stop at 20k as explicit top.

    return prices.map(p => ({
        value: p,
        label: `€${p.toLocaleString()}`
    }));
};

// Generate Size Options
export const generateSizeOptions = () => {
    const sizes = [];

    // 30 to 150, step 10
    for (let s = 30; s <= 150; s += 10) {
        sizes.push(s);
    }

    // 150 to 450, step 30
    for (let s = 180; s <= 450; s += 30) {
        sizes.push(s);
    }

    // 450 to 1000
    // "finish till to 1000". Assuming step 50 or 100.
    // 450 + 50 = 500. Nice round number.
    for (let s = 500; s <= 1000; s += 50) {
        sizes.push(s);
    }

    return sizes.map(s => ({
        value: s,
        label: `${s} m²`
    }));
};

export const bedroomOptions = [
    { value: 'studio', label: 'Studio' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6+' }
];

export const propertyTypes = [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'House', label: 'House' },
    { value: 'Plot', label: 'Plot' },
    { value: 'Commercial', label: 'Commercial' }
];

export const areaGroups = [
    {
        name: 'Estepona',
        areas: [
            'Benavista', 'Costalita', 'Valle Romano', 'El Padrón',
            'Hacienda del Sol', 'Selwo', 'Atalaya', 'Benamara',
            'El Presidente', 'Bel Air'
        ]
    },
    {
        name: 'Marbella',
        areas: [
            'Puerto Banus', 'Nueva Andalucia', 'San Pedro', 'Elviria',
            'Golden Mile', 'Nagüeles', 'Sierra Blanca', 'Los Monteros',
            'Rio Real', 'La Chapas'
        ]
    },
    {
        name: 'Benahavís',
        areas: [
            'La Zagaleta', 'El Madroñal', 'La Quinta', 'Los Arqueros',
            'Monte Mayor', 'Marbella Club', 'Los Flamingos', 'La Alquería',
            'Capanes del Golf', 'Paraiso Alto'
        ]
    },
    {
        name: 'Mijas',
        areas: [
            'Mijas Pueblo', 'Las Lagunas', 'Calahonda', 'Riviera del Sol',
            'La Cala', 'El Chaparral', 'Miraflores', 'Torrenueva',
            'La Sierrezuela', 'Campo Mijas'
        ]
    },
    {
        name: 'Sotogrande',
        areas: [
            'Sotogrande Alto', 'Sotogrande Costa', 'La Reserva', 'Valderrama',
            'Kings and Queens', 'Paniagua', 'Torreguadiaro', 'San Roque Club',
            'Alcaidesa', 'Santa Margarita'
        ]
    }
];

export const sortOptions = [
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'size_asc', label: 'Size (Smallest)' },
    { value: 'size_desc', label: 'Size (Largest)' },
    { value: 'date_desc', label: 'Newest First' }
];
