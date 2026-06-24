require('dotenv').config({ path: 'server/.env' });
const { generateDatabase } = require('./server/controllers/aiController');
const req = {
    body: {
        description: 'A rental car service with users, cars, bookings, payments, and reviews',
        dbType: 'PostgreSQL'
    },
    user: null
};
const res = {
    status: (code) => {
        console.log('Status:', code);
        return {
            json: (data) => console.log('JSON:', data)
        };
    },
    json: (data) => console.log('JSON:', data)
};

(async () => {
    console.log('Testing generateDatabase...');
    await generateDatabase(req, res);
})();
