import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="listing-card skeleton-card">
            <div className="listing-image-wrapper skeleton-pulse" />
            <div className="listing-card-content">
                <div className="listing-card-row header-row">
                    <div className="skeleton-line title-skeleton skeleton-pulse" />
                    <div className="skeleton-line price-skeleton skeleton-pulse" />
                </div>
                <div className="listing-card-row sub-header-row">
                    <div className="skeleton-line location-skeleton skeleton-pulse" />
                </div>
                <div className="listing-card-divider" />
                <div className="listing-card-row footer-row">
                    <div className="skeleton-line type-skeleton skeleton-pulse" />
                    <div className="skeleton-line size-skeleton skeleton-pulse" />
                </div>
            </div>
        </div>
    );
}
