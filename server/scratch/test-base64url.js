const code = `erDiagram\n USERS { SERIAL id PK }`;
const b64 = Buffer.from(code).toString('base64');
console.log('B64:', b64);
const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
console.log('B64URL:', b64url);
fetch('https://mermaid.ink/svg/' + b64url)
  .then(r => console.log('Status Base64URL:', r.status))
  .catch(e => console.error(e));
