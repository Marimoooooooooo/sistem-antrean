/**
 * ui-navigation.js
 * Handles all view switching and pure UI logic
 */
const Navigation = {
    switchRole(role) {
        // Update nav buttons
        document.querySelectorAll('.demo-role-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`btn-role-${role}`).classList.add('active');

        // Update main views
        document.querySelectorAll('.role-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`view-${role}`).classList.add('active');

        // Initial view setups
        if (role === 'user' && !App.state.myTicketId) {
            this.goToUserStep('service');
        } else if (role === 'user' && App.state.myTicketId) {
            this.goToUserStep('ticket');
        } else if (role === 'admin' && App.state.isAdminLoggedIn) {
            this.goToAdminStep('dashboard');
        }
    },

    goToUserStep(step) {
        document.querySelectorAll('.user-subview').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`user-step-${step}`).classList.add('active');
    },

    goToAdminStep(step) {
        document.querySelectorAll('.admin-subview').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`admin-step-${step}`).classList.add('active');
    },

    // User Portal Flow
    selectService(serviceName) {
        App.currentSelection.service = serviceName;
        this.goToUserStep('identity');
    }
};
