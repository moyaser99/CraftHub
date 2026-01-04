// Crafts Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all filter elements
    const searchInput = document.getElementById('craftSearch');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
    const tagCheckboxes = document.querySelectorAll('input[name="tag"]');
    const priceSlider = document.getElementById('priceSlider');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const priceDisplay = document.getElementById('priceDisplay');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultsCount = document.getElementById('resultsCount');
    const sortSelect = document.getElementById('sortSelect');
    const craftsGrid = document.getElementById('craftsGrid');
    
    let allCrafts = Array.from(document.querySelectorAll('.craft-card'));
    let filteredCrafts = [...allCrafts]; // Keep a copy of filtered crafts
    let isFiltering = false; // Flag to prevent multiple simultaneous filters
    
    // --- NEW: Auto-select category from URL param ---
    function autoSelectCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            document.querySelectorAll('input[name="category"]').forEach(cb => {
                cb.checked = (cb.value.toLowerCase() === category.toLowerCase());
            });
        }
    }
    
    // Initialize price slider
    function initializePriceSlider() {
        const updatePriceDisplay = () => {
            const minPrice = minPriceInput.value;
            const maxPrice = maxPriceInput.value;
            priceDisplay.textContent = `$${minPrice} - $${maxPrice}`;
        };
        
        // Update slider when inputs change
        minPriceInput.addEventListener('input', function() {
            if (parseInt(this.value) > parseInt(maxPriceInput.value)) {
                this.value = maxPriceInput.value;
            }
            priceSlider.value = this.value;
            updatePriceDisplay();
        });
        
        maxPriceInput.addEventListener('input', function() {
            if (parseInt(this.value) < parseInt(minPriceInput.value)) {
                this.value = minPriceInput.value;
            }
            priceSlider.value = this.value;
            updatePriceDisplay();
        });
        
        // Update inputs when slider changes
        priceSlider.addEventListener('input', function() {
            maxPriceInput.value = this.value;
            updatePriceDisplay();
        });
        
        updatePriceDisplay();
    }
    
    // Debounce function to prevent excessive filtering
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Filter crafts function with improved logic
    function filterCrafts() {
        if (isFiltering) return; // Prevent multiple simultaneous filters
        
        isFiltering = true;
        
        try {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            const selectedRatings = Array.from(ratingCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => parseInt(cb.value));
            const selectedTags = Array.from(tagCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || 1000;
            
            // Reset all crafts to visible first
            allCrafts.forEach(craft => {
                craft.style.display = 'block';
                craft.style.opacity = '1';
                craft.style.transform = 'scale(1)';
            });
            
            let visibleCount = 0;
            
            allCrafts.forEach(craft => {
                const craftName = craft.dataset.name.toLowerCase();
                const craftCategory = craft.dataset.category;
                const craftPrice = parseFloat(craft.dataset.price);
                const craftRating = parseFloat(craft.dataset.rating);
                const craftTags = craft.dataset.tags;
                
                // Check search term
                const matchesSearch = searchTerm === '' || craftName.includes(searchTerm);
                
                // Check category
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(craftCategory);
                
                // Check rating
                const matchesRating = selectedRatings.length === 0 || selectedRatings.some(rating => craftRating >= rating);
                
                // Check tags
                const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => craftTags.includes(tag));
                
                // Check price range
                const matchesPrice = craftPrice >= minPrice && craftPrice <= maxPrice;
                
                const shouldShow = matchesSearch && matchesCategory && matchesRating && matchesTags && matchesPrice;
                
                if (shouldShow) {
                    craft.style.display = 'block';
                    craft.style.opacity = '1';
                    craft.style.transform = 'scale(1)';
                    visibleCount++;
                } else {
                    craft.style.display = 'none';
                    craft.style.opacity = '0';
                    craft.style.transform = 'scale(0.95)';
                }
            });
            
            // Update results count
            updateResultsCount(visibleCount);
            
            // Show no results message if needed
            if (visibleCount === 0) {
                showNoResults();
            } else {
                hideNoResults();
            }
            
            // Update filtered crafts array
            filteredCrafts = allCrafts.filter(craft => craft.style.display !== 'none');
            
        } catch (error) {
            console.error('Error in filterCrafts:', error);
        } finally {
            isFiltering = false;
        }
    }
    
    // Debounced filter function
    const debouncedFilterCrafts = debounce(filterCrafts, 300);
    
    // Update results count
    function updateResultsCount(count) {
        const total = allCrafts.length;
        if (count === total) {
            resultsCount.textContent = `Showing all ${total} crafts`;
        } else {
            resultsCount.textContent = `Showing ${count} of ${total} crafts`;
        }
    }
    
    // Show no results message
    function showNoResults() {
        let noResults = document.querySelector('.no-results');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No crafts found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            craftsGrid.appendChild(noResults);
        }
        noResults.style.display = 'block';
    }
    
    // Hide no results message
    function hideNoResults() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }
    
    // Clear all filters
    function clearAllFilters() {
        if (isFiltering) return;
        
        isFiltering = true;
        
        try {
            // Reset all inputs
            searchInput.value = '';
            categoryCheckboxes.forEach(cb => cb.checked = false);
            ratingCheckboxes.forEach(cb => cb.checked = false);
            tagCheckboxes.forEach(cb => cb.checked = false);
            minPriceInput.value = '0';
            maxPriceInput.value = '1000';
            priceSlider.value = '500';
            priceDisplay.textContent = '$0 - $1000';
            sortSelect.value = 'popular';
            
            // Show all crafts with animation
            allCrafts.forEach((craft, index) => {
                setTimeout(() => {
                    craft.style.display = 'block';
                    craft.style.opacity = '1';
                    craft.style.transform = 'scale(1)';
                }, index * 50);
            });
            
            updateResultsCount(allCrafts.length);
            hideNoResults();
            
            // Reset filtered crafts array
            filteredCrafts = [...allCrafts];
            
            // Add visual feedback
            clearFiltersBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clearFiltersBtn.style.transform = 'scale(1)';
            }, 150);
            
        } catch (error) {
            console.error('Error in clearAllFilters:', error);
        } finally {
            isFiltering = false;
        }
    }
    
    // Sort crafts function
    function sortCrafts() {
        if (isFiltering) return;
        
        const sortBy = sortSelect.value;
        const craftsToSort = filteredCrafts.length > 0 ? filteredCrafts : allCrafts;
        const craftsArray = Array.from(craftsToSort);
        
        craftsArray.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'newest':
                    // For now, just randomize since we don't have date data
                    return Math.random() - 0.5;
                case 'popular':
                default:
                    // For now, just keep original order
                    return 0;
            }
        });
        
        // Reorder DOM elements
        craftsArray.forEach(craft => {
            craftsGrid.appendChild(craft);
        });
    }
    
    // Event listeners with debouncing
    searchInput.addEventListener('input', debouncedFilterCrafts);
    
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', debouncedFilterCrafts);
    });
    
    ratingCheckboxes.forEach(cb => {
        cb.addEventListener('change', debouncedFilterCrafts);
    });
    
    tagCheckboxes.forEach(cb => {
        cb.addEventListener('change', debouncedFilterCrafts);
    });
    
    minPriceInput.addEventListener('input', debouncedFilterCrafts);
    maxPriceInput.addEventListener('input', debouncedFilterCrafts);
    priceSlider.addEventListener('input', debouncedFilterCrafts);
    
    applyFiltersBtn.addEventListener('click', filterCrafts);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    sortSelect.addEventListener('change', sortCrafts);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear filters
        if (e.key === 'Escape') {
            clearAllFilters();
        }
    });
    
    // Add focus effects
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 0 2px rgba(184, 115, 51, 0.2)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = '';
    });
    
    // Initialize
    initializePriceSlider();
    autoSelectCategoryFromURL(); // <-- NEW: auto-select category if present
    updateResultsCount(allCrafts.length);
    // Trigger filter if category param exists
    setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('category')) {
            filterCrafts();
        }
    }, 100);
    
    // Add smooth animations for craft cards
    allCrafts.forEach((craft, index) => {
        craft.style.animationDelay = `${index * 0.05}s`;
        craft.style.animation = 'fadeInUp 0.6s ease-out forwards';
        craft.style.transition = 'all 0.3s ease';
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .search-box {
        position: relative;
        margin-bottom: 1rem;
    }
    
    .search-box i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        z-index: 1;
    }
    
    .search-box input {
        width: 100%;
        padding: 12px 12px 12px 40px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #fafafa;
    }
    
    .search-box input:focus {
        outline: none;
        border-color: #b87333;
        box-shadow: 0 0 0 2px rgba(184, 115, 51, 0.1);
        background: #fff;
    }
    
    .price-display {
        text-align: center;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
    }
    
    .filter-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .filter-actions .btn {
        flex: 1;
        padding: 12px;
        font-size: 0.9rem;
    }
    
    .filter-results {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
        color: #666;
        font-size: 0.9rem;
        font-weight: 500;
        text-align: center;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
        background: #fafafa;
        border-radius: 12px;
        margin: 2rem 0;
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
        color: #b87333;
    }
    
    .no-results h3 {
        margin-bottom: 0.5rem;
        color: #333;
        font-size: 1.5rem;
    }
    
    .no-results p {
        color: #666;
        font-size: 1rem;
    }
    
    /* Craft card animations */
    .craft-card {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.3s ease;
    }
    
    .craft-card:nth-child(1) { animation-delay: 0.05s; }
    .craft-card:nth-child(2) { animation-delay: 0.1s; }
    .craft-card:nth-child(3) { animation-delay: 0.15s; }
    .craft-card:nth-child(4) { animation-delay: 0.2s; }
    .craft-card:nth-child(5) { animation-delay: 0.25s; }
    .craft-card:nth-child(6) { animation-delay: 0.3s; }
    .craft-card:nth-child(7) { animation-delay: 0.35s; }
    .craft-card:nth-child(8) { animation-delay: 0.4s; }
    .craft-card:nth-child(9) { animation-delay: 0.45s; }
    .craft-card:nth-child(10) { animation-delay: 0.5s; }
    .craft-card:nth-child(11) { animation-delay: 0.55s; }
    .craft-card:nth-child(12) { animation-delay: 0.6s; }
    
    @media (max-width: 768px) {
        .filter-actions {
            flex-direction: column;
        }
        
        .filter-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(style); 