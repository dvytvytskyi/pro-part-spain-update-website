import React from 'react';
import PropertyCard from './PropertyCard';
import SkeletonCard from './SkeletonCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyGrid({
    properties = [],
    loading = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange
}) {
    // Generate mock properties if empty for demo (Total 32)
    const dummyProperties = Array.from({ length: 32 }).map((_, i) => {
        // ... (keep fallback data logic same as before or simplify if not used)
        // For brevity, assuming properties prop IS provided properly by parent
        return {};
    });

    const displayProperties = properties; // Use passed properties

    // Handlers
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && onPageChange) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on change
        }
    };

    return (
        <div className="listing-section">
            <div className="listing-grid">
                {loading ? (
                    // Render Skeletons
                    Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                ) : (
                    <>
                        {displayProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}

                        {displayProperties.length === 0 && (
                            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                                <h3>No properties found</h3>
                                <p style={{ color: '#666' }}>Try adjusting your search criteria</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} style={{ marginRight: '4px' }} /> Prev
                    </button>

                    {(() => {
                        const pages = [];
                        const delta = window.innerWidth < 768 ? 1 : 2; // Show fewer pages on mobile
                        const left = currentPage - delta;
                        const right = currentPage + delta + 1;
                        let lastShown = 0;

                        for (let i = 1; i <= totalPages; i++) {
                            if (i === 1 || i === totalPages || (i >= left && i < right)) {
                                if (lastShown !== 0 && i !== lastShown + 1) {
                                    pages.push(<span key={`dots-${i}`} className="pagination-ellipsis">...</span>);
                                }
                                pages.push(
                                    <button
                                        key={i}
                                        className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                                        onClick={() => handlePageChange(i)}
                                    >
                                        {i}
                                    </button>
                                );
                                lastShown = i;
                            }
                        }
                        return pages;
                    })()}

                    <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                    </button>
                </div>
            )}
        </div>
    );
}
