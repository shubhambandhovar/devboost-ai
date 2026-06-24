const code = `%%{init: {'theme': 'dark', 'themeVariables': { 'background': '#0f172a', 'primaryColor': '#4f46e5', 'lineColor': '#6366f1', 'nodeBorder': '#334155' }}}%%
erDiagram
    A ||--|| B : "?"`; // Let's try to generate a base64 with / or +

// Let's brute force a string that produces a / in standard base64
let testCode = '';
for (let i = 0; i < 100; i++) {
    testCode = `erDiagram\n A ||--|| B : "${'A'.repeat(i)}"`;
    const b64 = Buffer.from(testCode).toString('base64');
    if (b64.includes('/')) {
        console.log('Found / at length', i);
        console.log('B64:', b64);
        
        // Test standard fetch
        fetch('https://mermaid.ink/svg/' + b64)
          .then(async r => console.log('Standard / fetch status:', r.status))
          .catch(e => console.error(e));
          
        break;
    }
}
