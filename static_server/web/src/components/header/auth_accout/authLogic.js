import { request } from "../../../helpers/request";

async function registation(user_data) {
    if (!user_data.email || !user_data.password || !user_data.name) {
        throw new Error('Invalid user data');
    }

    try {
        const response = await request('/auth/registration', 'POST', user_data);
        if (!response.user) {
            throw new Error('Registration failed');
        }

        return response.user;
    } catch (error) {
        console.error(error);
    }
}

async function login(user_data) {
    if (!user_data.email || !user_data.password) {
        throw new Error('Invalid user data');
    }

    try {
        const response = await request('/auth/login', 'POST', user_data);
        if (!response.user) {
            throw new Error('Login failed');
        }

        localStorage.setItem('authorized', true);
        return response.user;
    } catch (error) {
        console.error(error);
    }
}

async function logout() {
    try {
        const success = await request('/auth/logout', 'POST', null, {}, true);
        if (!success.ok) {
            throw new Error('Logout failed');
        }
        
        localStorage.removeItem('authorized');
        sessionStorage.removeItem('ownedImages');
        return success.ok;

    } catch (error) {
        console.error(error);
    }
}

async function refresh() {
    if (!localStorage.getItem('authorized')) {
        throw new Error('Not authorized');
    }

    try {
        const response = await request('/auth/refresh', 'POST', null, {}, true);
        if (!response || !response.user) {
            localStorage.removeItem('authorized');
            throw new Error('Refresh failed');
        }
        return response.user;
    } catch (error) {
        console.error('Refresh error:', error);
        throw error;
    }
}

let interval;
async function amIAuthorized() {
    if (!localStorage.getItem('authorized')) {
        clearInterval(interval);
        return false;
    }

    try {
        const user = await refresh();
        if (!user) {
            localStorage.removeItem('authorized');
            clearInterval(interval);
            return false;
        }

        interval = setInterval(amIAuthorized, 1000 * 15 * 60); // 15 minutes

        return user;
    } catch (error) {
        console.error('Authorization check error:', error);
        localStorage.removeItem('authorized');
        clearInterval(interval);
        return false;
    }
}


export { registation, login, logout, refresh, amIAuthorized };