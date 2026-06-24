const code = `%%{init: {'theme': 'dark', 'themeVariables': { 'background': '#0f172a', 'primaryColor': '#4f46e5', 'lineColor': '#6366f1', 'nodeBorder': '#334155' }}}%%
erDiagram
    USERS {
        SERIAL user_id PK
        VARCHAR name
    }
    CARS {
        SERIAL car_id PK
        VARCHAR model
    }
    BOOKINGS {
        SERIAL booking_id PK
        INT user_id FK
        INT car_id FK
    }
    PAYMENTS {
        SERIAL payment_id PK
        INT booking_id FK
    }
    REVIEWS {
        SERIAL review_id PK
        INT user_id FK
        INT car_id FK
    }`;
const base64 = Buffer.from(code).toString('base64');
console.log('Base64:', base64);
console.log('Contains /:', base64.includes('/'));
console.log('Contains +:', base64.includes('+'));
fetch('https://mermaid.ink/svg/' + base64)
  .then(async r => {
    console.log('Status:', r.status);
    if (!r.ok) {
        console.log('Error text:', await r.text());
    }
  })
  .catch(e => console.error(e));
