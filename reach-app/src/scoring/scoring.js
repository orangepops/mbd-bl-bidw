// ── Scoring utilities for REACH™ AI Leadership Diagnostic ────────────────────

export function generateSessionId(code) {
  const n = new Date(), p = v => String(v).padStart(2,"0");
  const d = `${n.getUTCFullYear()}${p(n.getUTCMonth()+1)}${p(n.getUTCDate())}`;
  const t = `${p(n.getUTCHours())}${p(n.getUTCMinutes())}${p(n.getUTCSeconds())}`;
  return `REACH-${code}-${d}-${t}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
}

/**
 * Scores a BES axis. Reverse items are inverted (5 − raw).
 * Returns null if any item in the axis is unanswered.
 * @param resp - Flat map of question ID → raw rating (1–4)
 * @param qs   - Instrument question bank
 * @param ax   - Axis key ("R" | "E" | "A" | "C" | "H")
 */
export function scoreBES(resp, qs, ax) {
  let s=0,n=0;
  qs[ax].forEach(q=>{
    const v=resp[q.id];
    if(v==null)return;
    n++;
    s += q.rev ? 5-v : v;
  });
  return n===qs[ax].length ? s : null;
}

/**
 * Scores a Likert axis. Reverse items are inverted (6 − raw).
 * Returns null if any item in the axis is unanswered.
 */
export function scoreLikert(resp, qs, ax) {
  let s=0,n=0;
  qs[ax].forEach(q=>{const v=resp[q.id];if(v==null)return;n++;s+=q.rev?6-v:v;});
  return n===qs[ax].length?s:null;
}

/** Maps a raw axis score to a 0–100 percentage for radar rendering. */
export function toRadar(s,max){return Math.min(100,Math.ceil((s/max)*100));}

// Maturity band thresholds (Likert, per axis, max 30)
export function getMaturityBand(s){
  if(s<=12)return"Early Stage";
  if(s<=18)return"Developing";
  if(s<=24)return"Established";
  return"Advanced";
}

// Governance band thresholds (BES, per axis, max 32)
export function getGovBand(s){
  if(s<=13)return"Significant Gap";
  if(s<=19)return"Development Needed";
  if(s<=25)return"Approaching Ready";
  return"Ready to Act";
}

// Total governance band thresholds (all 5 axes, max 160)
export function getTotalGovBand(s){
  if(s<=64)return{band:"Significant Gap",cls:"b-gap",desc:"Multiple axes below threshold. Pre-engagement developmental intervention required across the profile."};
  if(s<=95)return{band:"Developing",cls:"b-devneeded",desc:"Governance capability present but unevenly distributed. Profile asymmetries are the primary diagnostic output."};
  if(s<=125)return{band:"Established",cls:"b-approaching",desc:"Governance readiness largely demonstrated. Targeted axis-level development indicated."};
  return{band:"Advanced",cls:"b-ready",desc:"Governance capability consistently demonstrated. Profile suitable for advanced AI deployment oversight."};
}
