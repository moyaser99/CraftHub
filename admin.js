// Update current date with animation
document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('current-date');
    dateElement.style.opacity = '0';
    dateElement.textContent = currentDate.toLocaleDateString('en-US', options);
    setTimeout(() => {
        dateElement.style.transition = 'opacity 0.5s ease';
        dateElement.style.opacity = '1';
    }, 100);

    // تمييز الرابط النشط تلقائياً بناءً على اسم الصفحة
    const navLinks = document.querySelectorAll('.admin-nav a');
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // تفعيل زر تسجيل الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // يمكنك هنا إضافة منطق حذف بيانات الجلسة إذا لزم
            window.location.href = 'index.html';
        });
    }

    // إشعار تجريبي عند الضغط على الإشعارات
    const notifBtn = document.querySelector('.btn-icon[title="Notifications"]');
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            showNotification('You have new notifications!');
        });
    }

    // دالة عرض إشعار عائم
    function showNotification(message) {
        let notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.remove();
        }, 2500);
    }
});

// Initialize Sales Chart with improved styling
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Sales',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 35000, 30000, 28000, 24500],
            borderColor: '#43d8c9',
            backgroundColor: 'rgba(67, 216, 201, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#43d8c9',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(35, 41, 70, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#43d8c9',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Sales: $${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(67, 216, 201, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

// Handle date filter buttons with animation
const dateFilterButtons = document.querySelectorAll('.date-filter .btn');
dateFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
        dateFilterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = 'scale(1)';
        });
        this.classList.add('active');
        this.style.transform = 'scale(1.05)';
        
        // Simulate data update
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        document.querySelector('.sales-chart').appendChild(loadingOverlay);
        
        setTimeout(() => {
            loadingOverlay.remove();
            // Here you would typically update the chart data
        }, 800);
    });
});

// Handle chart period select with animation
const chartPeriod = document.querySelector('.chart-period');
chartPeriod.addEventListener('change', function() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.querySelector('.sales-chart').appendChild(loadingOverlay);
    
    setTimeout(() => {
        loadingOverlay.remove();
        // Here you would typically update the chart data
    }, 800);
});

// Add loading overlay styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(35, 41, 70, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 2rem;
        border-radius: 12px;
        z-index: 1000;
    }
`;
document.head.appendChild(loadingStyle);

// Handle notification buttons with dropdown
const notificationButtons = document.querySelectorAll('.btn-icon[title="Notifications"], .btn-icon[title="Messages"]');
notificationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <h3>${this.title}</h3>
                <button class="btn-link">Mark all as read</button>
            </div>
            <div class="dropdown-content">
                <div class="notification-item">
                    <i class="fas fa-shopping-cart"></i>
                    <div class="notification-text">
                        <p>New order #12345 received</p>
                        <span>2 minutes ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <i class="fas fa-user-plus"></i>
                    <div class="notification-text">
                        <p>New artist registration</p>
                        <span>15 minutes ago</span>
                    </div>
                </div>
            </div>
            <div class="dropdown-footer">
                <a href="#" class="btn-link">View all</a>
            </div>
        `;
        
        // Remove existing dropdowns
        document.querySelectorAll('.notification-dropdown').forEach(d => d.remove());
        
        // Position and show new dropdown
        const rect = this.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = rect.bottom + 10 + 'px';
        dropdown.style.right = '20px';
        document.body.appendChild(dropdown);
        
        // Add click outside listener
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== button) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    });
});

// Add notification dropdown styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification-dropdown {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 300px;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dropdown-content {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .notification-item {
        padding: 1rem;
        display: flex;
        gap: 1rem;
        border-bottom: 1px solid #eee;
        transition: background 0.3s ease;
    }
    
    .notification-item:hover {
        background: #f8f9fa;
    }
    
    .notification-item i {
        color: #43d8c9;
        font-size: 1.2rem;
    }
    
    .notification-text p {
        margin: 0;
        font-size: 0.9rem;
    }
    
    .notification-text span {
        font-size: 0.8rem;
        color: #95a5a6;
    }
    
    .dropdown-footer {
        padding: 1rem;
        text-align: center;
        border-top: 1px solid #eee;
    }
`;
document.head.appendChild(notificationStyle);

// Handle table action buttons with confirmation
const tableActionButtons = document.querySelectorAll('.table-actions .btn-icon');
tableActionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const action = this.title;
        const row = this.closest('tr');
        const orderId = row.querySelector('td:first-child').textContent;
        
        if (action === 'Delete') {
            if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
                // Add loading state
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                this.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                    }, 300);
                }, 800);
            }
        } else {
            // Handle other actions
            console.log(`${action} clicked for order ${orderId}`);
        }
    });
});

// Add hover effect to stat cards with improved animation
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 20px rgba(67, 216, 201, 0.15)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
});

// Handle search input with debounce
let searchTimeout;
const searchInput = document.querySelector('.header-search input');
searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        // Here you would typically implement search functionality
        console.log('Searching for:', this.value);
    }, 300);
});

// Handle logout button with confirmation
const logoutButton = document.querySelector('.logout-btn');
logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        // Add loading state
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        this.disabled = true;
        
        // Simulate logout
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }
});

// Add loading state to buttons with improved animation
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    button.style.opacity = '0.8';
    
    // Simulate loading
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, 1000);
}

// Handle responsive sidebar with improved animation
const sidebar = document.querySelector('.admin-sidebar');
const content = document.querySelector('.admin-content');

function handleResize() {
    if (window.innerWidth <= 992) {
        sidebar.classList.add('collapsed');
        content.classList.add('expanded');
        sidebar.style.transition = 'all 0.3s ease';
        content.style.transition = 'all 0.3s ease';
    } else {
        sidebar.classList.remove('collapsed');
        content.classList.remove('expanded');
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Add smooth scrolling with improved behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add tooltips with improved styling
const tooltips = document.querySelectorAll('[title]');
tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', function() {
        const title = this.getAttribute('title');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.textContent = title;
        document.body.appendChild(tooltipEl);
        
        const rect = this.getBoundingClientRect();
        tooltipEl.style.top = rect.bottom + 5 + 'px';
        tooltipEl.style.left = rect.left + (rect.width - tooltipEl.offsetWidth) / 2 + 'px';
        
        // Add animation
        tooltipEl.style.opacity = '0';
        tooltipEl.style.transform = 'translateY(5px)';
        setTimeout(() => {
            tooltipEl.style.transition = 'all 0.2s ease';
            tooltipEl.style.opacity = '1';
            tooltipEl.style.transform = 'translateY(0)';
        }, 10);
    });
    
    tooltip.addEventListener('mouseleave', function() {
        const tooltipEl = document.querySelector('.tooltip');
        if (tooltipEl) {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.transform = 'translateY(5px)';
            setTimeout(() => tooltipEl.remove(), 200);
        }
    });
});

// Update tooltip styles
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: fixed;
        background: rgba(35, 41, 70, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        pointer-events: none;
    }
`;
document.head.appendChild(tooltipStyle); 
document.head.appendChild(style); 