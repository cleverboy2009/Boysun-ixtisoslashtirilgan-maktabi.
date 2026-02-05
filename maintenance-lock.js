(function () {
    // Maintenance Mode Toggle
    const MAINTENANCE_MODE = true;

    // Pages that are ALWAYS accessible (like the maintenance page itself and admin panel)
    const EXCLUDED_PAGES = [
        'maintenance.html',
        'admin-login.html',
        'admin-panel.html',
        'api.php'
    ];

    if (MAINTENANCE_MODE) {
        const currentPage = window.location.pathname.split('/').pop();

        // Check if we are already on an excluded page
        const isExcluded = EXCLUDED_PAGES.some(page => currentPage.includes(page));

        if (!isExcluded && currentPage !== '') {
            window.location.href = 'maintenance.html';
        } else if (currentPage === '' || currentPage === 'index.html') {
            // If on root or index, also redirect
            if (!window.location.pathname.includes('maintenance.html')) {
                window.location.href = 'maintenance.html';
            }
        }
    }
})();
