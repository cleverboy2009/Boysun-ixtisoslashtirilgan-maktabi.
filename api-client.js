// Admin Panel API Client
// Secure connection to backend server

class SecureAPIClient {
    constructor(baseURL = '') {
        // Use relative URL for same-origin requests (works with PHP)
        // Or use full URL for C++ backend: 'http://localhost:8080'
        this.baseURL = baseURL || window.location.origin;
        this.token = null;
        this.sessionId = null;
    }

    // ==================== AUTHENTICATION ====================

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.sessionId = data.sessionId;

                // Save to localStorage
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('sessionId', this.sessionId);
                localStorage.setItem('user', JSON.stringify(data.user));

                return data;
            }

            throw new Error('Invalid credentials');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await fetch(`${this.baseURL}/api/auth/logout`, {
                method: 'POST',
                headers: this.getHeaders()
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            this.sessionId = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('sessionId');
            localStorage.removeItem('user');
        }
    }

    async validateSession() {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/validate`, {
                headers: this.getHeaders()
            });

            return response.ok;
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    // ==================== TIMETABLE OPERATIONS ====================

    async getTimetable() {
        try {
            const response = await fetch(`${this.baseURL}/api/timetable`, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch timetable');
            }

            return await response.json();
        } catch (error) {
            console.error('Get timetable error:', error);
            throw error;
        }
    }

    async updateTimetable(data) {
        try {
            const response = await fetch(`${this.baseURL}/api/timetable`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update timetable');
            }

            return await response.json();
        } catch (error) {
            console.error('Update timetable error:', error);
            throw error;
        }
    }

    // ==================== TEACHER OPERATIONS ====================

    async getTeachers() {
        try {
            const response = await fetch(`${this.baseURL}/api/teachers`, {
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }

            return await response.json();
        } catch (error) {
            console.error('Get teachers error:', error);
            throw error;
        }
    }

    async updateTeachers(data) {
        try {
            const response = await fetch(`${this.baseURL}/api/teachers`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update teachers');
            }

            return await response.json();
        } catch (error) {
            console.error('Update teachers error:', error);
            throw error;
        }
    }

    // ==================== HELPER METHODS ====================

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (this.sessionId) {
            headers['X-Session-ID'] = this.sessionId;
        }

        return headers;
    }

    loadFromStorage() {
        this.token = localStorage.getItem('authToken');
        this.sessionId = localStorage.getItem('sessionId');
    }

    isAuthenticated() {
        return this.token !== null && this.sessionId !== null;
    }
}

// Initialize API client
const apiClient = new SecureAPIClient();
apiClient.loadFromStorage();
