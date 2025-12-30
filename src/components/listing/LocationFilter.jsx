import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { staticLocations } from '../../data/staticLocations';
import { useLanguage } from '../../i18n/LanguageContext';
import './ListingComponents.css';

export default function LocationFilter({ selectedAreas = [], onChange, alignRight = false }) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);

    // Load locations from static data
    useEffect(() => {
        const grouped = Object.entries(staticLocations).map(([city, areas]) => {
            // Sort areas alphabetically
            const sortedAreas = [...areas].sort((a, b) => a.localeCompare(b));

            return {
                name: city,
                areas: [city, ...sortedAreas] // Add city itself as first option
            };
        });

        setGroups(grouped);
        setLoading(false);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleGroup = (groupName) => {
        if (expandedGroups.includes(groupName)) {
            setExpandedGroups(expandedGroups.filter(g => g !== groupName));
        } else {
            setExpandedGroups([...expandedGroups, groupName]);
        }
    };

    const toggleArea = (area) => {
        const updated = selectedAreas.includes(area)
            ? selectedAreas.filter(a => a !== area)
            : [...selectedAreas, area];
        onChange(updated);
    };

    const getGroupCount = (groupName) => {
        const group = groups.find(g => g.name === groupName);
        if (!group) return 0;
        return group.areas.filter(area => selectedAreas.includes(area)).length;
    };

    return (
        <div className="filter-dropdown-wrapper" ref={dropdownRef}>
            <div
                className={`filter-dropdown-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="trigger-label">
                    {selectedAreas.length > 0
                        ? t('search.selected').replace('{count}', selectedAreas.length)
                        : t('search.placeholder')}
                </span>
                <ChevronDown size={18} className={`trigger-icon ${isOpen ? 'rotate' : ''}`} />
            </div>

            {isOpen && (
                <div className={`filter-dropdown-menu location-menu ${alignRight ? 'align-right' : ''}`}>
                    {loading ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>{t('common.loading')}</div>
                    ) : (
                        groups.map((group) => (
                            <div key={group.name} className={`location-group ${expandedGroups.includes(group.name) ? 'expanded' : ''}`}>
                                <div
                                    className="location-group-header"
                                    onClick={() => toggleGroup(group.name)}
                                >
                                    <div className="group-info">
                                        {getGroupCount(group.name) > 0 && (
                                            <span className="count-badge">{getGroupCount(group.name)}</span>
                                        )}
                                        <span className="group-title">{group.name}</span>
                                    </div>
                                    <ChevronDown size={16} className={`group-arrow ${expandedGroups.includes(group.name) ? 'rotate' : ''}`} />
                                </div>

                                {expandedGroups.includes(group.name) && (
                                    <div className="location-list">
                                        {group.areas.map((area) => (
                                            <label key={area} className="location-item">
                                                <span className="location-name">{area}</span>
                                                <div className={`checkbox-custom ${selectedAreas.includes(area) ? 'checked' : ''}`}>
                                                    {selectedAreas.includes(area) && <Check size={12} strokeWidth={3} />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAreas.includes(area)}
                                                    onChange={() => toggleArea(area)}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
