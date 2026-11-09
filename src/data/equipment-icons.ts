// Line pictures of gym equipment for the Training plan screen (48×48, stroked with currentColor).
// Keys match EQL in exercises.ts.

// Weight stack used by most machines (right side).
const ST = '<rect x="33" y="8" width="9" height="32" rx="2"/><path d="M35 14h5M35 20h5M35 26h5M35 32h5"/>';
// Seat with a back pad (left side).
const SEAT = '<path d="M8 32h16M12 32v8M20 32v8M8 40h16"/><path d="M10 32V18"/>';
// Treadmill-style base.
const BASE = '<path d="M6 40h36"/>';
// Simple standing / working person head.
const head = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3"/>`;

export const EQI: Record<string, string> = {
  // Free weights and benches
  db: '<rect x="8" y="15" width="8" height="18" rx="3"/><rect x="32" y="15" width="8" height="18" rx="3"/><path d="M16 24h16M5 20v8M43 20v8"/>',
  fb: '<rect x="6" y="20" width="36" height="5" rx="2.5"/><path d="M11 25v13M37 25v13M8 38h6M34 38h6"/>',
  ab: '<path d="M8 30h16l14-14"/><path d="M12 30v9M24 30v9M9 39h18M30 24l4 4"/>',
  bk: '<path d="M10 8v32M38 8v32M6 40h8M34 40h8M4 14h40M7 11v6M41 11v6"/><rect x="14" y="27" width="20" height="4" rx="2"/><path d="M18 31v9M30 31v9"/>',
  ib: '<path d="M10 8v32M38 8v32M6 40h8M34 40h8M4 14h40M7 11v6M41 11v6"/><path d="M16 32h8l8-10"/><path d="M19 32v8M27 32v8"/>',
  bb: '<path d="M4 24h40M10 16v16M14 18v12M34 18v12M38 16v16"/>',
  pu: '<path d="M6 8h36M10 8v32M38 8v32M6 40h8M34 40h8"/>' + head(24, 18) + '<path d="M19 8l3 7M29 8l-3 7M24 21v9M24 30l-3 8M24 30l3 8"/>',
  rc: '<path d="M5 40h34M11 40L30 17M31 40l-7-13"/><rect x="27" y="9" width="15" height="6" rx="3" transform="rotate(-45 34.5 12)"/><path d="M9 30l7 5"/>',
  // Cable machines
  cm: '<path d="M8 6h32M8 6v34M40 6v34M6 40h36"/><circle cx="14" cy="12" r="2.5"/><circle cx="34" cy="12" r="2.5"/><path d="M14 14v12M34 14v12M11 26h6M31 26h6"/><rect x="20" y="20" width="8" height="18" rx="1.5"/>',
  rcb: ST + '<path d="M6 34h16M10 34v6M18 34v6M6 40h16M33 28H26M26 26v4"/><path d="M24 30h-4"/>',
  lpc: ST + '<path d="M6 8h26M18 8v10M10 18h16"/><path d="M10 34h14M14 34v6M20 34v6M8 40h18"/><path d="M14 30l6-4"/>',
  gc: ST + '<path d="M33 36H24"/>' + head(10, 14) + '<path d="M12 16l6 10M18 26l-2 12M18 26l6 10"/>',
  // Machines
  abm: ST + '<path d="M6 34h16M10 34v6M18 34v6M6 40h16M9 34V16"/><path d="M9 14h12l4 6"/><rect x="14" y="18" width="9" height="4" rx="2"/><path d="M25 20h8"/>',
  bf: '<rect x="19" y="7" width="10" height="19" rx="3"/><path d="M16 30h16M20 30v9M28 30v9M15 40h18"/><path d="M19 11c-6 0-10 2-10 7v2M29 11c6 0 10 2 10 7v2"/><rect x="5" y="20" width="7" height="12" rx="3"/><rect x="36" y="20" width="7" height="12" rx="3"/>',
  lem: ST + SEAT + '<path d="M24 32l6-6M28 24l4 4"/>',
  lcm: ST + '<rect x="6" y="22" width="22" height="4" rx="2"/><path d="M10 26v14M22 26v14M8 40h18M28 22l4-8M28 14h6"/>',
  cpm: ST + SEAT + '<path d="M10 22h20M26 18v8"/>',
  lpm: '<path d="M6 40h36M10 40V30l10-6M14 34l14-14"/><rect x="26" y="10" width="14" height="6" rx="2" transform="rotate(-40 33 13)"/><path d="M36 22l4 18"/>',
  bm: ST + '<path d="M6 34h16M10 34v6M18 34v6M6 40h16"/><path d="M10 26h14l-4-10M24 26l4-8"/>',
  sm: '<path d="M10 6v34M38 6v34M6 40h36M10 18h28"/><path d="M7 15v6M41 15v6"/><path d="M10 10h28" stroke-dasharray="2 3"/>',
  r1: ST + SEAT + '<path d="M10 24h12M28 20h4M28 20l-6 4"/>',
  r2: ST + '<path d="M5 33h12M8 33v7M14 33v7M5 40h14"/><rect x="18" y="17" width="5" height="15" rx="2.5"/><path d="M23 30l3 10M33 15h-8M26 12v6"/><path d="M25 15h-2"/>',
  dm: ST + '<path d="M6 40h24"/>' + head(14, 12) + '<path d="M14 15v12M14 27l-3 13M14 27l3 13M14 20l8 6h6"/>',
  bem: ST + '<path d="M6 32h16M10 32v8M18 32v8M6 40h16"/><path d="M24 32L13 17"/><rect x="6" y="11" width="13" height="6" rx="3" transform="rotate(-37 12.5 14)"/><path d="M24 36h6"/>',
  spm: ST + SEAT + '<path d="M10 14h18M14 14V8M24 14V8"/>',
  lrm: '<rect x="20" y="8" width="8" height="20" rx="3"/><path d="M16 32h16M20 32v8M28 32v8M15 40h18"/><path d="M20 14L9 10M28 14l11-4"/><rect x="4" y="12" width="10" height="5" rx="2.5" transform="rotate(-20 9 14.5)"/><rect x="34" y="12" width="10" height="5" rx="2.5" transform="rotate(20 39 14.5)"/>',
  tm: ST + SEAT + '<path d="M10 22h14l4 6"/>',
  crm: ST + '<path d="M6 40h24M10 40v-6h16v6"/>' + head(18, 10) + '<path d="M18 13v12M18 25v9M12 16h12"/>',
  gm: ST + '<rect x="6" y="24" width="18" height="4" rx="2"/><path d="M10 28v12M20 28v12M8 40h14M24 26l6-8"/>',
  hm: '<rect x="19" y="8" width="10" height="18" rx="3"/><path d="M14 30h20M18 30v10M30 30v10M14 40h20"/><rect x="6" y="22" width="5" height="12" rx="2.5"/><rect x="37" y="22" width="5" height="12" rx="2.5"/><path d="M4 16h7M7 13l-3 3 3 3M44 16h-7M41 13l3 3-3 3"/>',
  apm: ST + '<path d="M6 6h26M12 6v6M26 6v6"/><rect x="10" y="26" width="16" height="4" rx="2"/><path d="M18 30v10M10 40h16M18 12v14" stroke-dasharray="2 3"/>',
  // Cardio
  tr: BASE + '<path d="M8 40l4-6h26l2 6M36 34L32 10M28 10h10"/>',
  cl: '<path d="M14 40V8M34 40V8M10 40h28M14 14h20M14 22h20M14 30h20"/>',
  or: BASE + '<circle cx="36" cy="34" r="5"/><path d="M10 38l22-4M14 40l18-6"/><path d="M20 36L28 10M26 34L32 12"/><path d="M36 29V14h6"/>',
  ub: '<path d="M8 40h32M14 40l4-14M34 40l-2-14"/><circle cx="24" cy="32" r="5"/><path d="M18 26h14M20 26l-2-8h6M32 26l2-14h4"/>',
  eb: '<path d="M6 40h36M12 40l6-10h10M34 40l-4-26h6"/><circle cx="24" cy="34" r="5"/><rect x="8" y="22" width="10" height="4" rx="2"/><path d="M13 26v4"/>',
};

export function eqSvg(k: string) {
  return `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EQI[k] || '<circle cx="24" cy="24" r="12"/>'}</svg>`;
}
