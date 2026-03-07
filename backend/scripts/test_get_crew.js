const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';
const token = jwt.sign({ userId: 8, isSystemAdmin: false }, JWT_SECRET, { expiresIn: '30d' });

const requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
};

fetch('https://angturssejlads-api.onrender.com/api/crew/boat/7', requestOptions)
    .then(async res => {
        console.log('STATUS:', res.status);
        console.log('BODY:', await res.text());
    })
    .catch(err => console.error('Fetch error:', err));
