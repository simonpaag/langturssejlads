const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';
const token = jwt.sign({ userId: 8, isSystemAdmin: false }, JWT_SECRET, { expiresIn: '30d' });

const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        boatId: 7,
        email: 'testerx@tester.dk',
        role: 'CREW'
    })
};

fetch('https://angturssejlads-api.onrender.com/api/crew/invite', requestOptions)
    .then(res => res.text().then(text => console.log('STATUS:', res.status, 'BODY:', text)))
    .catch(err => console.error('Fetch error:', err));
