const code = `%%{init: {'theme': 'dark', 'themeVariables': { 'background': '#0f172a', 'primaryColor': '#4f46e5', 'lineColor': '#6366f1', 'nodeBorder': '#334155' }}}%%
erDiagram
    USERS {
        SERIAL user_id PK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR phone_number UK
        TEXT address
        VARCHAR driver_license_number UK
        DATE license_issue_date
        DATE license_expiry_date
        TIMESTAMPTZ date_registered
        BOOLEAN is_admin
    }`;
const base64 = Buffer.from(code).toString('base64');
console.log('Base64:', base64);
fetch('https://mermaid.ink/svg/' + base64)
  .then(async r => {
    console.log('Status:', r.status);
    if (!r.ok) {
        console.log('Error text:', await r.text());
    } else {
        console.log('SVG Length:', (await r.text()).length);
    }
  })
  .catch(e => console.error(e));
