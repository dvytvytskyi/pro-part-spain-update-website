
export const sortProperties = (props, sortType) => {
    return [...props].sort((a, b) => {
        const getPrice = (p) => p.price || 0;
        const getSize = (p) => p.built_area || p.total_area || p.size || 0;
        const getDate = (p) => new Date(p.created_at || p.createdAt || 0).getTime();

        switch (sortType) {
            case 'price_asc': return getPrice(a) - getPrice(b);
            case 'price_desc': return getPrice(b) - getPrice(a);
            case 'size_asc': return getSize(a) - getSize(b);
            case 'size_desc': return getSize(b) - getSize(a);
            case 'date_desc': return getDate(b) - getDate(a);
            default: return 0;
        }
    });
};
