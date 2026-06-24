const code = `invalid mermaid code!`;
const base64 = Buffer.from(code).toString('base64');
console.log('Base64:', base64);
fetch('https://mermaid.ink/svg/' + base64)
  .then(async r => {
    console.log('Status:', r.status);
    console.log('Content-Type:', r.headers.get('content-type'));
    if (!r.ok) {
        console.log('Error text:', await r.text());
    } else {
        console.log('Text:', (await r.text()).substring(0, 100));
    }
  })
  .catch(e => console.error(e));
