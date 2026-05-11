const appElement = document.querySelector<HTMLDivElement>('#app');

if (appElement) {
  appElement.innerHTML = `
    <h1>Larascript</h1>
    <p>TypeScript + Hono migration baseline is active.</p>
    <p>API docs: <a href="/docs">/docs</a></p>
  `;
}
