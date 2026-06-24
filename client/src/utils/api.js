export const callApi = async (endpoint, payload, method = 'POST') => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (payload && method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${url}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 403 && errorData.needsUpgrade) {
       window.location.href = '/pricing?upgrade_required=true';
    }
    throw new Error(errorData.error || 'Something went wrong. Please try again.');
  }

  return response.json();
};
