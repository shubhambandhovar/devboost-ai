const code = `erDiagram
A ||--|| B : "testing base64 characters like ??? and !!! to force slash"
C ||--|| D : "forcing a plus or slash into the base64 string +++ ///"
`;
// Let's brute force a string until it has a / or +
let testCode = '';
let b64 = '';
for (let i = 0; i < 1000; i++) {
    testCode = code + 'A'.repeat(i);
    b64 = Buffer.from(testCode).toString('base64');
    if (b64.includes('/') || b64.includes('+')) {
        break;
    }
}
console.log('Original B64 contains / or +:', b64.includes('/') || b64.includes('+'));

const b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
console.log('B64URL contains / or +:', b64url.includes('/') || b64url.includes('+'));

fetch('https://mermaid.ink/svg/' + b64url)
  .then(async r => {
      console.log('Status Base64URL:', r.status);
      if (!r.ok) {
          console.log('Error text:', await r.text());
      }
  })
  .catch(e => console.error(e));
