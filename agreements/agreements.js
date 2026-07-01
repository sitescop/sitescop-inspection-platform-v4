/**
 * ==========================================================
 * SiteScop V4
 * Client Agreements Dashboard
 * agreements.js
 * ==========================================================
 */

'use strict';

/**
 * Navigate to Sent Agreements
 */
function openSent() {
    window.location.href = 'sent.html';
}

/**
 * Navigate to Received Agreements
 */
function openReceived() {
    window.location.href = 'received.html';
}

/**
 * Navigate to Completed Agreements
 */
function openCompleted() {
    window.location.href = 'completed.html';
}

/**
 * Navigate to Recycle Bin
 */
function openRecycle() {
    window.location.href = 'recycle.html';
}

/**
 * Return to Main Dashboard
 */
function returnDashboard() {
    window.location.href = '../index.html';
}

/**
 * Initialise page
 */
document.addEventListener('DOMContentLoaded', () => {

    // Enable Enter/Space keyboard navigation on dashboard cards
    document.querySelectorAll('.dashboard-card').forEach(card => {

        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', (event) => {

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }

        });

    });

}); 

