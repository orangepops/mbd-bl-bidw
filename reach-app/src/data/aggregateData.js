// ── Aggregate report data for REACH™ AI Leadership Diagnostic ────────────────
// Uses MOCK_PROFILES sScores directly. All three consented to aggregation.
// Priya: Debrief + Aggregation ✓ | Alex: Debrief + Aggregation ✓ | Rizal: Debrief Only — excluded from aggregation
// For demo purposes we include all three labelled anonymously as Leader A/B/C
import { AXIS_ORDER } from "./instruments.js";
import { MOCK_PROFILES } from "./mockProfiles.js";

export const AGG_PROFILES = [
  { label:"Leader A", scores: MOCK_PROFILES[0].sScores },
  { label:"Leader B", scores: MOCK_PROFILES[1].sScores },
  { label:"Leader C", scores: MOCK_PROFILES[2].sScores },
];

// Profile colours for aggregate radar
export const AGG_COLORS = ["#6aabdb","#5dba8a","#d4a94c"];

export function getTeamAvg() {
  const avg = {};
  AXIS_ORDER.forEach(ax => {
    avg[ax] = Math.round((AGG_PROFILES.reduce((s,p) => s + p.scores[ax], 0) / AGG_PROFILES.length) * 10) / 10;
  });
  return avg;
}

export function getAggBandClass(s) {
  if(s<=13) return "agg-band-gap";
  if(s<=19) return "agg-band-dev";
  if(s<=25) return "agg-band-approach";
  return "agg-band-ready";
}

export function getAggBandLabel(s) {
  if(s<=13) return "Significant Gap";
  if(s<=19) return "Development Needed";
  if(s<=25) return "Approaching Ready";
  return "Ready to Act";
}

export function getIndivStyle(s) {
  if(s<=13) return {bg:"rgba(192,57,43,0.08)",color:"#c0392b"};
  if(s<=19) return {bg:"rgba(180,120,0,0.08)",color:"#9a6800"};
  if(s<=25) return {bg:"rgba(31,78,121,0.08)",color:"#1a4f7a"};
  return {bg:"rgba(26,92,58,0.08)",color:"#1a5c3a"};
}
