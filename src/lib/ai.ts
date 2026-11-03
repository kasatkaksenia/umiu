// Optional AI helper. The original app used Claude's built-in runtime, which only exists inside
// Claude. On the web and on iOS there is no AI yet, so `ai` is null and the app uses its local
// fallbacks (local workout generator, manual food entry). To add AI later, point this at your own
// backend endpoint, for example:
//
//   export const ai: AI = {
//     async json(prompt, opts) {
//       const r = await fetch("https://your-api.example.com/ai", { method: "POST", body: JSON.stringify({ prompt, ...opts }) });
//       return r.json();
//     },
//   };
//
// Never put an API key in this file: everything here ships to the browser.

export interface AI {
  json(prompt: string, opts?: { images?: Blob[] }): Promise<any>;
}

export const ai: AI | null = null;
