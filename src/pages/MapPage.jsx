import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { ExternalLink, Heart } from 'lucide-react';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { getProperties, getPropertiesForMap } from '../api/client';
import PropertyFilters from '../components/listing/PropertyFilters';
import usePropertyFilters from '../hooks/usePropertyFilters';
import useFavorites from '../hooks/useFavorites';
import { getJitteredCoordinates } from '../data/areaCoordinates';
import { useLanguage } from '../i18n/LanguageContext';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A';
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

const INITIAL_DEFAULTS = {
    search: '',
    type: [],
    priceMin: '',
    priceMax: '',
    bedrooms: [],
    sizeMin: '',
    sizeMax: '',
    sort: 'recommended',
    location: [],
    rentType: 'long',
    market: 'new-building',
    amenities: [],
    showMarketSelector: true
};

const DRAW_STYLES = [
    // ACTIVE (being drawn)
    {
        "id": "gl-draw-line",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
        "layout": { "line-cap": "round", "line-join": "round" },
        "paint": { "line-color": "#D20C0C", "line-width": 2 }
    },
    {
        "id": "gl-draw-polygon-fill",
        "type": "fill",
        "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        "paint": { "fill-color": "#D20C0C", "fill-outline-color": "#D20C0C", "fill-opacity": 0.1 }
    },
    {
        "id": "gl-draw-polygon-midpoint",
        "type": "circle",
        "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
        "paint": { "circle-radius": 3, "circle-color": "#fbb03b" }
    },
    {
        "id": "gl-draw-polygon-stroke-active",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        "layout": { "line-cap": "round", "line-join": "round" },
        "paint": { "line-color": "#D20C0C", "line-width": 2 }
    },
    {
        "id": "gl-draw-polygon-and-line-vertex-halo-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        "paint": { "circle-radius": 5, "circle-color": "#FFF" }
    },
    {
        "id": "gl-draw-polygon-and-line-vertex-active",
        "type": "circle",
        "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        "paint": { "circle-radius": 3, "circle-color": "#D20C0C" }
    },
    // INACTIVE (static)
    {
        "id": "gl-draw-polygon-fill-static",
        "type": "fill",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        "paint": { "fill-color": "#404040", "fill-outline-color": "#404040", "fill-opacity": 0.1 }
    },
    {
        "id": "gl-draw-polygon-stroke-static",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        "layout": { "line-cap": "round", "line-join": "round" },
        "paint": { "line-color": "#404040", "line-width": 2 }
    }
];

const SidePropertyCard = ({ property }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isLiked = isFavorite(property.id);

    const image = property.images && property.images.length > 0
        ? property.images[0]
        : (property.image || 'https://via.placeholder.com/100x70?text=No+Image');

    const { t } = useLanguage();
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const priceDisplay = property.price ? formatter.format(property.price) : t('property.callForPrice');

    const link = `/${property.market === 'rent' ? 'rent' : property.market === 'secondary' ? 'resale' : 'new-building'}/${property.id}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="side-property-card"
        >
            <div className="side-card-image-wrapper" style={{ position: 'relative' }}>
                <img src={image} alt={property.title} className="side-card-image" />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(property.id);
                    }}
                    style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        zIndex: 5
                    }}
                >
                    <Heart size={14} fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "#333"} />
                </button>
            </div>
            <div className="side-card-content">
                <div className="side-card-title">{property.title || property.name || 'Untitled Property'}</div>
                <div className="side-card-location">{property.location?.name || property.address || 'Unknown Location'}</div>
                <div className="side-card-price">{priceDisplay}</div>
            </div>
        </a>
    );
};

export default function MapPage() {
    const { t } = useLanguage();
    const [allProperties, setAllProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [polygonFilter, setPolygonFilter] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const [clusterProperties, setClusterProperties] = useState(null); // List of properties from a clicked cluster
    const [isDrawing, setIsDrawing] = useState(false);
    const drawRef = useRef(null);
    const mapRef = useRef(null);

    const { filters, setFilters, clearFilters } = usePropertyFilters('buy', INITIAL_DEFAULTS);
    const [displayLimit, setDisplayLimit] = useState(30);

    // Sync URL -> Polygon State (on mount or navigation)
    useEffect(() => {
        if (filters.polygon && typeof filters.polygon === 'string') {
            try {
                const poly = JSON.parse(filters.polygon);
                if (JSON.stringify(polygonFilter) !== filters.polygon) {
                    setPolygonFilter(poly);
                    if (drawRef.current) {
                        drawRef.current.deleteAll();
                        drawRef.current.add(poly);
                    }
                }
            } catch (e) {
                console.error("Invalid polygon in URL", e);
            }
        } else if (!filters.polygon && polygonFilter) {
            setPolygonFilter(null);
            if (drawRef.current) drawRef.current.deleteAll();
        }
        // clear cluster selection when filters change (except just clicking cluster)
        if (!filters.polygon && !drawRef.current) {
            // Optional: reset clusterProperties if filter changes drastically 
            // but maybe user wants to keep it. Let's keep simpler logic for now.
        }
    }, [filters.polygon]);

    // Clear cluster selection when main filters change
    useEffect(() => {
        setClusterProperties(null);
    }, [filters]);

    useEffect(() => {
        setDisplayLimit(30);
    }, [filters, polygonFilter, allProperties]);



    useEffect(() => {
        setLoading(true);

        const {
            location: uiTowns = [],
            bedrooms: uiBeds = [],
            type: uiSubtypes = [],
            amenities: uiAmenities = [],
            market: uiMarket,
            ...rest
        } = filters;

        // Map frontend market values to backend expected values
        let backendMarket = uiMarket;
        if (uiMarket === 'new-building') backendMarket = 'off-plan';
        else if (uiMarket === 'secondary') backendMarket = 'resale';
        // 'rent' stays 'rent'

        const apiMapParams = {
            ...rest,
            market: backendMarket,
            subtype: uiSubtypes.length ? uiSubtypes.join(',') : undefined,
            amenities: uiAmenities.length ? uiAmenities.join(',') : undefined,
            town: uiTowns.length ? uiTowns : undefined,
            beds: uiBeds.length ? uiBeds.map(b => b === 'studio' ? 0 : b) : undefined,
            beds_exact: uiBeds.length ? 'true' : undefined
        };

        // Pass filters directly to map endpoint. Backend now handles it efficiently.
        getPropertiesForMap(apiMapParams)
            .then(data => {
                // Ensure data is array
                const rawList = Array.isArray(data) ? data : (data.data || []);
                const list = rawList.map((p) => {
                    // normalize coords
                    const lat = p.lat || p.latitude || (p.location?.coordinates?.[1]) || 0;
                    const lng = p.lng || p.longitude || (p.location?.coordinates?.[0]) || 0;

                    return {
                        ...p,
                        latitude: Number(lat),
                        longitude: Number(lng),
                        // Remap market for detail links if raw data differs
                        market: p.market === 'off-plan' ? 'new-building' : p.market === 'resale' ? 'secondary' : p.market
                    };
                });
                setAllProperties(list);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const inRange = (val, min, max) => {
        if (min && val < min) return false;
        if (max && val > max) return false;
        return true;
    };

    const filteredProperties = useMemo(() => {
        return allProperties.filter(property => {
            if (polygonFilter) {
                const lat = property.latitude;
                const lng = property.longitude;

                if (!lat || !lng) return false;

                try {
                    const pt = point([lng, lat]);
                    if (!booleanPointInPolygon(pt, polygonFilter)) return false;
                } catch (e) {
                    return false;
                }
            }

            if (filters.market && property.market && property.market !== filters.market) return false;

            if (filters.market === 'rent' && filters.rentType && property.rentType) {
                if (property.rentType !== filters.rentType) return false;
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const title = property.title || property.development_name || property.name || '';
                if (!title.toLowerCase().includes(searchLower)) return false;
            }
            if (filters.type?.length > 0) {
                const pType = (property.property_type || property.type || '').toLowerCase();
                if (!filters.type.some(t => pType.includes(t.toLowerCase()))) return false;
            }
            if (property.price && !inRange(property.price, filters.priceMin, filters.priceMax)) return false;

            if (filters.bedrooms?.length > 0) {
                const bedsData = property.beds || property.bedrooms;
                if (!bedsData) return false;
                const beds = String(bedsData);
                if (filters.bedrooms.includes('4+') && bedsData >= 4) {
                } else if (!filters.bedrooms.includes(beds)) {
                    return false;
                }
            }
            if (filters.location?.length > 0) {
                const locName = property.town || property.location?.name || property.address || '';
                if (!filters.location.some(l => locName.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(locName.toLowerCase()))) return false;
            }
            if (filters.amenities?.length > 0) {
                const pAmenities = property.amenities || [];
                // Check if property has ALL selected amenities (AND logic)
                const hasAll = filters.amenities.every(a => pAmenities.includes(a));
                if (!hasAll) return false;
            }
            return true;
        });
    }, [allProperties, filters, polygonFilter]);

    // Convert filtered properties to GeoJSON for Source
    const geoJsonData = useMemo(() => {
        return {
            type: 'FeatureCollection',
            features: filteredProperties.map(p => ({
                type: 'Feature',
                properties: {
                    ...p,
                    // Use simple fields for expression filtering if needed
                    marketType: p.market === 'new-building' || p.market === 'off-plan' ? 'new-building' : 'other'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [p.longitude, p.latitude]
                }
            }))
        };
    }, [filteredProperties]);

    const visibleProperties = clusterProperties || filteredProperties.slice(0, displayLimit);
    const hasMore = !clusterProperties && filteredProperties.length > displayLimit;
    const isClusterView = !!clusterProperties;

    // Keep filters ref updated for map callbacks
    const filtersRef = useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    // Update URL when Draw changes
    const onUpdate = useCallback(e => {
        const features = e.features;
        if (features.length > 0) {
            setPolygonFilter(features[0]);
            // Sync to URL using latest filters
            const currentFilters = filtersRef.current;
            setFilters({ ...currentFilters, polygon: JSON.stringify(features[0]) });
        }
    }, [setFilters]);

    const onDelete = useCallback(() => {
        setPolygonFilter(null);
        const currentFilters = filtersRef.current;
        setFilters({ ...currentFilters, polygon: null });
    }, [setFilters]);

    const onMapLoad = useCallback((e) => {
        const map = e.target;
        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: { polygon: true, trash: true },
            styles: DRAW_STYLES
        });
        map.addControl(draw, 'top-left');
        drawRef.current = draw;
        map.on('draw.create', onUpdate);
        map.on('draw.update', onUpdate);
        map.on('draw.delete', onDelete);
        map.on('draw.modechange', (e) => {
            setIsDrawing(e.mode === 'draw_polygon');
        });

        // Restore polygon if exists in state (from URL)
        // Check local state or ref? Local state polygonFilter is correct here as it might be set by parsing URL effect
        if (polygonFilter) {
            // Need to wait for style load? draw.add usually works if control added.
            try {
                draw.add(polygonFilter);
            } catch (err) { console.error("Error adding initial polygon", err); }
        }
        // Also if we have one in filtersRef but not in polygonFilter yet? (Race condition)
        // The effect syncs URL->polygonFilter.
        // If map loads first, polygonFilter might be null.
        // If URL loads first, polygonFilter is set.
        // But map style might not be ready.
    }, [onUpdate, onDelete, polygonFilter]); // Added polygonFilter dependency

    const filterPageType = filters.market === 'rent' ? 'rent' : 'buy';

    const handleDrawClick = () => {
        if (!drawRef.current) return;
        if (polygonFilter) {
            drawRef.current.deleteAll();
            setPolygonFilter(null);
            setFilters({ ...filters, polygon: null });
        } else {
            // Clear cluster view if drawing
            setClusterProperties(null);
            setSelectedProperty(null);
            try { drawRef.current.changeMode('draw_polygon'); } catch (err) { }
        }
    };

    const handleMapClick = (event) => {
        if (!mapRef.current) return;
        if (isDrawing) return;

        const feature = event.features?.[0];

        // If clicked on empty space (no feature), close the cluster list AND popup
        if (!feature) {
            setClusterProperties(null);
            setSelectedProperty(null);
            return;
        }

        const clusterId = feature.properties.cluster_id;

        if (clusterId) {
            const map = mapRef.current.getMap();
            const source = map.getSource('properties');
            const pointCount = feature.properties.point_count;

            if (pointCount > 100) {
                // If more than 100, zoom in to break the cluster
                source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) return;
                    map.easeTo({
                        center: feature.geometry.coordinates,
                        zoom: zoom
                    });
                });
            } else {
                // If 100 or less (but >= 20 due to minPoints), open side menu
                source.getClusterLeaves(clusterId, 100, 0, (err, features) => {
                    if (err) return;
                    const leaves = features.map(f => f.properties);
                    setClusterProperties(leaves);
                });
            }
        } else if (feature.layer.id === 'unclustered-point') {
            // Clicked a single point
            let p = { ...feature.properties };

            // Parse complex fields that Mapbox might have stringified
            ['images', 'location', 'coordinates'].forEach(key => {
                if (typeof p[key] === 'string') {
                    try { p[key] = JSON.parse(p[key]); } catch (e) { }
                }
            });

            setSelectedProperty(p);
            setClusterProperties(null); // Close the list view to focus on the popup

            setClusterProperties(null); // Close the list view to focus on the popup

            // Calculate offset based on screen height for better mobile experience
            const isMobile = window.innerWidth < 768;
            const yOffset = isMobile ? 150 : 100;

            // Center map on the property with a slight offset to accommodate the popup
            mapRef.current.getMap().flyTo({
                center: feature.geometry.coordinates,
                offset: [0, yOffset], // Shift point down so popup (above it) is centered
                zoom: 15,
                speed: 1.2,
                curve: 1
            });
        }
    };

    const handleOpenFullList = () => {
        // Determine which properties to show
        let propertiesToShow = [];
        if (clusterProperties) {
            propertiesToShow = clusterProperties;
        } else if (polygonFilter) {
            propertiesToShow = filteredProperties;
        }

        const params = new URLSearchParams();

        if (propertiesToShow.length > 0) {
            // If viewing a specific subset (Cluster or Area), pass their IDs
            // We'll use a special 'ids' param or 'id' param if creating a custom filter on listing page
            // Standard way: ?ids=1,2,3
            const ids = propertiesToShow.map(p => p.id).join(',');
            // If list is huge, URL might be too long. 
            // For now, let's assume reasonable size or use local storage approach?
            // "ids" is supported by our filter hooks? No, we need to check usePropertyFilters.
            // Actually, existing filters don't support 'ids'. 
            // Let's rely on Passing filters IF polygon/cluster is NOT set, 
            // OR if polygon is set, pass polygon.
            // But for Cluster, passing IDs is best. 
            // Let's use 'ids' and update usePropertyFilters if needed? 
            // Or simpler: The user wants to see "These properties". 
            // If it's a Cluster, we can't easily replicate "Cluster X" filter.
            // IDs is the only way for arbitrary cluster.
            if (ids.length < 2000) {
                params.set('ids', ids);
            } else {
                // If too many IDs, fallback to passing filters + polygon if exists
                if (polygonFilter) params.set('polygon', JSON.stringify(polygonFilter));
                // Copy other filters
                if (filters.search) params.set('search', filters.search);
                if (filters.type?.length) params.set('type', filters.type.join(','));
                if (filters.priceMin) params.set('priceMin', filters.priceMin);
                if (filters.priceMax) params.set('priceMax', filters.priceMax);
                if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
                if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
                if (filters.location?.length) params.set('location', filters.location.join(','));
            }
        } else {
            // Just global filters
            if (filters.search) params.set('search', filters.search);
            if (filters.type?.length) params.set('type', filters.type.join(','));
            if (filters.priceMin) params.set('priceMin', filters.priceMin);
            if (filters.priceMax) params.set('priceMax', filters.priceMax);
            if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
            if (filters.sort) params.set('sort', filters.sort);
            if (filters.location?.length) params.set('location', filters.location.join(','));
            if (filters.rentType) params.set('rentType', filters.rentType);
            if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
        }

        const targetInfo = filters.market === 'rent' ? 'rent' : filters.market === 'secondary' ? 'resale' : 'new-building';
        const url = `/${targetInfo}?${params.toString()}`;
        window.open(url, '_blank');
    };

    const onMouseEnter = useCallback(() => {
        if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
    }, []);
    const onMouseLeave = useCallback(() => {
        if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            <style>{`
                .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-attrib { display: none !important; }
                .map-filters-wrapper .filters-container-flex { flex-wrap: nowrap !important; gap: 0.4rem !important; justify-content: space-between; }
                .map-filters-wrapper .property-filters-container { padding: 0; margin: 0; background: transparent; border-bottom: none !important; }
                .map-filters-wrapper .filters-bottom-row { display: none !important; }
                .map-filters-wrapper .search-input-wrapper { min-width: 120px; flex: 1; }
                .map-filters-wrapper .rent-type-tabs { margin-right: 0.4rem !important; flex-shrink: 0; transform: scale(0.95); transform-origin: left center; }
                .map-filters-wrapper .filter-dropdown-wrapper { min-width: 100px !important; flex: 1 !important; }
                .map-filters-wrapper .filter-dropdown-trigger { padding: 0.5rem 0.7rem !important; gap: 0.4rem !important; }
                .map-filters-wrapper .trigger-label { font-size: 0.75rem !important; }
                .map-filters-wrapper .clear-filters-icon-btn { width: 36px !important; height: 36px !important; }
                
                .draw-area-btn {
                    position: absolute; 
                    bottom: calc(30px + env(safe-area-inset-bottom)); 
                    left: 50%; transform: translateX(-50%); z-index: 100;
                    background: #313131; color: white; border: none; padding: 0.8rem 2rem; border-radius: 50px;
                    font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.2s ease;
                }
                .draw-area-btn:hover { background: #1a1a1a; transform: translateX(-50%) translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
                
                @media (max-width: 1100px) {
                    .map-filters-wrapper {
                        top: 80px !important;
                        width: 95% !important;
                        padding: 0.8rem !important;
                    }
                    /* On mobile map, hide Rent Tabs (User uses Filter Modal) */
                    .map-filters-wrapper .rent-type-tabs {
                        display: none !important;
                    }
                    /* Ensure Mobile Filter Button is visible */
                    .mobile-filter-btn {
                        display: flex !important;
                    }

                    /* Lift Draw Button higher on mobile for browser toolbars */
                    .draw-area-btn {
                        bottom: calc(100px + env(safe-area-inset-bottom));
                        width: 90%;
                        max-width: 300px;
                        text-align: center;
                        z-index: 110;
                    }
                    .side-panel {
                        top: 220px;
                        left: 10px;
                        right: 10px;
                        width: auto;
                        max-height: 40vh;
                        padding: 1rem;
                    }
                }

                .side-panel {
                    position: absolute; top: 190px; left: 20px; bottom: 20px; width: 380px; background: white; z-index: 30;
                    padding: 1.5rem; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-radius: 16px;
                    transform: translateX(-120%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;
                }
                .side-panel.open { transform: translateX(0); }
                .side-panel-header { margin-bottom: 1rem; padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #f0f0f0; }
                .side-panel-title { font-size: 18px; font-weight: 700; color: #1a1a1a; font-family: 'Inter', sans-serif; }
                .side-property-card {
                    display: flex; align-items: center; padding: 0.8rem; background: white; border-radius: 8px; margin-bottom: 0.4rem;
                    transition: all 0.2s ease; border: 1px solid transparent; cursor: pointer; text-decoration: none; color: inherit;
                }
                .side-property-card:hover { background: #f9f9f9; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-color: #eee; transform: translateY(-1px); }
                .side-card-image-wrapper { width: 100px; height: 70px; border-radius: 6px; overflow: hidden; flex-shrink: 0; background-color: #eee; }
                .side-card-image { width: 100%; height: 100%; object-fit: cover; }
                .side-card-content { margin-left: 1rem; flex: 1; min-width: 0; }
                .side-card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1a1a1a; }
                .side-card-location { font-size: 12px; color: #666; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .side-card-price { font-size: 14px; font-weight: 700; color: #1a1a1a; }
                .side-panel::-webkit-scrollbar { width: 6px; }
                .side-panel::-webkit-scrollbar-thumb { background-color: #ddd; border-radius: 3px; }
                /* Popup Overrides */
                .mapboxgl-popup-content { padding: 0 !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important; }
                .mapboxgl-popup-tip { display: none !important; }
                .mapboxgl-popup-close-button { display: none !important; }
                .popup-link-btn:hover { transform: scale(1.1); }
            `}</style>

            <div className={`side-panel ${(polygonFilter || clusterProperties) ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <div>
                        <span className="side-panel-title">
                            {isClusterView ? t('map.clusterTitle') : t('map.areaTitle')}
                        </span>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                            {t('filters.resultsFound').replace('{count}', isClusterView ? visibleProperties.length : filteredProperties.length)}
                        </div>
                    </div>
                    <button
                        onClick={handleOpenFullList}
                        style={{
                            background: 'transparent', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px',
                            fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#333'
                        }}
                    >
                        {t('map.fullList')} <ExternalLink size={12} />
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredProperties.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontSize: '14px' }}>{t('map.noProperties')}</div>
                    ) : (
                        <>
                            {visibleProperties.map(p => <SidePropertyCard key={p.id} property={p} />)}
                            {hasMore && (
                                <button
                                    onClick={() => setDisplayLimit(prev => prev + 30)}
                                    style={{
                                        width: '100%', padding: '0.8rem', background: '#f5f5f5', border: 'none', borderRadius: '8px',
                                        color: '#333', cursor: 'pointer', fontWeight: 600, marginTop: '0.5rem', fontSize: '14px'
                                    }}
                                >
                                    {t('map.loadMore').replace('{count}', filteredProperties.length - displayLimit)}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="map-filters-wrapper" style={{
                position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)', width: '98%', maxWidth: '1800px',
                zIndex: 10, background: 'white', padding: '1.2rem 1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}>
                <PropertyFilters
                    pageType={filterPageType}
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={clearFilters}
                    totalCount={filteredProperties.length}
                />
            </div>

            <Map
                ref={mapRef}
                initialViewState={{ longitude: -4.9, latitude: 36.5, zoom: 11 }}
                style={{ width: '100%', height: '100%' }}
                mapStyle={MAP_STYLE}
                mapboxAccessToken={MAPBOX_TOKEN}
                minZoom={9}
                attributionControl={false}
                onLoad={onMapLoad}
                onClick={handleMapClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                interactiveLayerIds={['clusters', 'unclustered-point', 'cluster-count']}
            >
                <Source
                    id="properties"
                    type="geojson"
                    data={geoJsonData}
                    cluster={true}
                    clusterMaxZoom={16} // Cluster only up to this zoom
                    clusterRadius={60}  // Radius of each cluster
                >
                    {/* Cluster Circle Layer */}
                    <Layer
                        id="clusters"
                        type="circle"
                        filter={['has', 'point_count']}
                        paint={{
                            'circle-color': '#313131',
                            'circle-radius': [
                                'step',
                                ['get', 'point_count'],
                                15, // default px
                                10, 20, // count<10 -> 20px
                                50, 25  // count<50 -> 25px
                            ],
                            'circle-opacity': 0.9,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#fff'
                        }}
                    />
                    {/* Cluster Count Text Layer */}
                    <Layer
                        id="cluster-count"
                        type="symbol"
                        filter={['has', 'point_count']}
                        layout={{
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12
                        }}
                        paint={{
                            'text-color': '#ffffff'
                        }}
                    />
                    {/* Unclustered Points Layer */}
                    <Layer
                        id="unclustered-point"
                        type="circle"
                        filter={['!', ['has', 'point_count']]}
                        paint={{
                            'circle-color': '#000000',
                            'circle-radius': 8,
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#fff'
                        }}
                    />
                </Source>

                {selectedProperty && (
                    <Popup
                        longitude={selectedProperty.longitude}
                        latitude={selectedProperty.latitude}
                        anchor="bottom"
                        onClose={() => setSelectedProperty(null)}
                        closeButton={false}
                        closeOnClick={false} // We handle closing manually in handleMapClick to avoid event conflicts
                        offset={15}
                        maxWidth="300px"
                    >
                        <div style={{ padding: '0', display: 'flex', flexDirection: 'column', width: '280px' }}>
                            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                                <img
                                    src={(selectedProperty.images && selectedProperty.images[0]) || selectedProperty.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={selectedProperty.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(selectedProperty.id);
                                    }}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px',
                                        borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Heart size={18} fill={isFavorite(selectedProperty.id) ? "red" : "none"} color={isFavorite(selectedProperty.id) ? "red" : "#333"} />
                                </button>
                            </div>
                            <div style={{ padding: '0.8rem 1rem' }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#1a1a1a', lineHeight: '1.2' }}>
                                    {selectedProperty.title || selectedProperty.name || 'Untitled'}
                                </h3>
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                                    {selectedProperty.location?.name || selectedProperty.address || 'Unknown Location'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                                        {selectedProperty.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(selectedProperty.price) : t('property.callForPrice')}
                                    </div>
                                    <a
                                        href={`/${selectedProperty.market === 'rent' ? 'rent' : selectedProperty.market === 'secondary' ? 'resale' : 'new-building'}/${selectedProperty.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '32px', height: '32px', background: '#f5f5f5', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a',
                                            transition: 'all 0.2s', cursor: 'pointer'
                                        }}
                                        className="popup-link-btn"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>
            {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '1rem', borderRadius: '8px', zIndex: 20 }}>{t('common.loading')}</div>}
            <button className="draw-area-btn" onClick={handleDrawClick}>
                {polygonFilter ? t('map.clearArea') : t('map.drawArea')}
            </button>
        </div>
    );
}
