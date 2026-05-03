/**
 * Enterprise Student Queue System
 * Shared Logic for LocalStorage and State Management
 */

const QueueSystem = {
    // Get all queues
    getQueues: function() {
        return JSON.parse(localStorage.getItem('system_queues')) || [];
    },

    // Save all queues
    saveQueues: function(queues) {
        localStorage.setItem('system_queues', JSON.stringify(queues));
    },

    // Get current user ticket ID
    getCurrentTicketId: function() {
        return localStorage.getItem('current_user_ticket');
    },

    // Set current user ticket ID
    setCurrentTicketId: function(id) {
        if(id) {
            localStorage.setItem('current_user_ticket', id);
        } else {
            localStorage.removeItem('current_user_ticket');
        }
    },

    // Get a specific ticket by ID
    getTicketById: function(id) {
        const queues = this.getQueues();
        return queues.find(q => q.id === id);
    },

    // Navigate relative to current path (safe for GitHub Pages)
    navigate: function(page) {
        window.location.href = page;
    },

    // Global timer check to auto-miss called tickets that exceed 3 mins
    // This ensures consistency across any page that includes app.js
    checkAutoSkip: function() {
        let queues = this.getQueues();
        let updated = false;

        queues.forEach(ticket => {
            if(ticket.status === 'called' && ticket.calledAt) {
                const diffSecs = Math.floor((new Date().getTime() - new Date(ticket.calledAt).getTime()) / 1000);
                if (diffSecs > 180) { // 3 minutes
                    ticket.status = 'missed';
                    updated = true;
                }
            }
        });

        if(updated) {
            this.saveQueues(queues);
        }
    },

    // Feedback Management
    getFeedbacks: function() {
        return JSON.parse(localStorage.getItem('system_feedbacks')) || [];
    },

    saveFeedbacks: function(feedbacks) {
        localStorage.setItem('system_feedbacks', JSON.stringify(feedbacks));
    },

    addFeedback: function(ticketId, rating, reviewText) {
        const feedbacks = this.getFeedbacks();
        const ticket = this.getTicketById(ticketId);
        
        feedbacks.push({
            id: 'fb-' + Date.now().toString(36),
            ticketId: ticketId,
            ticketNumber: ticket ? ticket.ticketNumber : 'Unknown',
            name: ticket ? ticket.name : 'Anonymous',
            serviceName: ticket ? ticket.serviceName : 'Unknown',
            rating: parseInt(rating),
            review: reviewText,
            timestamp: new Date().toISOString()
        });
        
        this.saveFeedbacks(feedbacks);
    }
};

// Auto check skip every 2 seconds on any page
setInterval(() => {
    QueueSystem.checkAutoSkip();
}, 2000);
