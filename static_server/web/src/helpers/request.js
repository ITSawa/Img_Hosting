async function request(url, method, body = null, headers = {}, credentials = false) {
    const fetchOptions = {
        method: method.toUpperCase(),
        headers: {
            ...headers
        }
    };

    if (body && method.toLowerCase() !== 'get') {
        if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
            fetchOptions.body = JSON.stringify(body);
            fetchOptions.headers['Content-Type'] = 'application/json';
        } else {
            fetchOptions.body = body; 
        }
    }

    if (credentials) {
        fetchOptions.credentials = 'include';
    }

    try {
        const req = await fetch(url, fetchOptions);

        const contentType = req.headers.get('Content-Type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await req.json();
        } else {
            responseData = await req.text();
        }

        if (!req.ok) {
            throw new Error(`HTTP error! Status: ${req.status}, Message: ${responseData}`);
        }

        responseData.ok = req.ok;

        return responseData;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export { request };