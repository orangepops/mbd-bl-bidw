// ── Mock profiles and sample report data for REACH™ AI Leadership Diagnostic ──
// Sample data only — no real respondent data is stored or retained.
import { AXIS_ORDER } from "./instruments.js";
import { I1, I2, I3 } from "./instruments.js";
import { scoreLikert, toRadar } from "../scoring/scoring.js";

// NOTE: sScores updated to match actual computed values from sResp
// Rizal C axis corrected: sScores.C=13 (Significant Gap), sResp.C updated for consistency
export const MOCK_PROFILES = [
  {
    id:"alex", name:"Alex Chen", role:"Group CRO", demo:"Male · Chinese Singaporean",
    sessionId:"REACH-GV-20250315-091422-KX7MP", consent:"Debrief + Aggregation", completedAt:"15 Mar 2025, 09:14",
    note:"High self-perception, thin evidence base. Strong R and H self-reported; Low A; reverse items E7 and H7 inflated.",
    // sScores updated to match actual sResp computation: R=29,E=22,A=16,C=22,H=26
    sScores:{R:29,E:22,A:16,C:22,H:26},
    sResp:{
      R:{R1:4,R2:4,R3:3,R4:4,R5:4,R6:3,R7:1,R8:2},
      E:{E1:3,E2:3,E3:3,E4:2,E5:3,E6:2,E7:3,E8:1},
      A:{A1:2,A2:2,A3:2,A4:2,A5:2,A6:2,A7:3,A8:3},
      C:{C1:3,C2:2,C3:2,C4:3,C5:3,C6:2,C7:1,C8:2},
      H:{H1:3,H2:4,H3:3,H4:3,H5:3,H6:4,H7:3,H8:1},
    },
    citations:{
      R1:"In the Q3 credit review I consistently distinguish model outputs from my own read of the market.",
      R2:"I do this regularly after significant decisions as part of my governance discipline.",
      R3:"Our credit AI system has defined human review thresholds documented in the model risk framework.",
      R4:"I escalate to my level any significant conflict between model outputs and our risk appetite.",
      R5:"I can explain my reasoning on any AI recommendation to the board or MAS if required.",
      R6:"I document my reasoning in board papers and governance committee minutes.",
      E1:"I have slowed deployments pending governance sign-off on multiple occasions.",
      E2:"I communicate uncertainty to my team and board as part of my standard governance practice.",
      E3:"I held position on the GenAI deployment timeline despite significant business pressure in Q4.",
      A7:"Our governance framework is mature and well-established. The fundamentals have not required revision.",
      A8:"My team monitors regulatory developments and flags what requires my attention.",
      H2:"I review our human oversight checkpoints annually as part of the model risk review cycle.",
      H5:"Our oversight processes are reviewed as part of the annual model risk governance cycle.",
      H7:"Our human oversight structures are well embedded. They do not require my direct intervention.",
    },
  },
  {
    id:"priya", name:"Priya Ramasamy", role:"Group CIO", demo:"Female · Indian Singaporean",
    sessionId:"REACH-GV-20250318-143055-R9QTZ", consent:"Debrief + Aggregation", completedAt:"18 Mar 2025, 14:30",
    note:"Strong technical understanding, weak personal accountability ownership. High C and A; Low R and E; R7 inflated.",
    // sScores updated to match actual sResp computation: R=18,E=21,A=30,C=30,H=23
    sScores:{R:18,E:21,A:30,C:30,H:23},
    sResp:{
      R:{R1:2,R2:2,R3:2,R4:2,R5:2,R6:3,R7:4,R8:1},
      E:{E1:2,E2:2,E3:3,E4:2,E5:2,E6:2,E7:1,E8:1},
      A:{A1:4,A2:4,A3:3,A4:4,A5:4,A6:4,A7:1,A8:2},
      C:{C1:4,C2:4,C3:3,C4:4,C5:4,C6:3,C7:1,C8:1},
      H:{H1:3,H2:3,H3:2,H4:2,H5:3,H6:3,H7:2,H8:1},
    },
    citations:{
      A1:"Following MAS Pathfinder Phase 2 outputs I updated our AI deployment oversight framework to include GenAI-specific risk gates. My team can describe exactly what changed.",
      A2:"After the anomalous credit scoring output in Jan 2025 I personally chaired the review of the original approval governance, not just the model failure.",
      A3:"My understanding of fairness obligations under Veritas shifted materially after piloting the v2.0 toolkit. I changed how we document fairness assessments for individual-affecting models.",
      A4:"I read the MAS Pathfinder Phase 2 output directly and attended the MindForge working group session in February.",
      A5:"I established a monthly AI governance reading group for my direct reports and the Responsible AI team leads.",
      A6:"I updated our model documentation requirements in Q1 2025 in anticipation of the ISO 42001 certification audit we have scheduled for Q3.",
      C1:"I always distinguish between what I directly understand and what I rely on expert assessment for. I state this explicitly in governance committee.",
      C2:"I apply a standard set of five interrogation questions to every risk assessment presented to me — regardless of who presents it.",
      C4:"I have a standing briefing protocol with our Chief Model Risk Officer before I approve any high-risk system.",
      C5:"After our GenAI pilot showed strong early results I insisted on a 90-day hold before declaring it production-ready.",
      R7:"Governance documentation is a specialist function. My compliance and data governance teams maintain it.",
    },
  },
  {
    id:"rizal", name:"Rizal Hamdan", role:"CHRO", demo:"Male · Malay Singaporean",
    sessionId:"REACH-GV-20250320-102847-M4NVK", consent:"Debrief Only", completedAt:"20 Mar 2025, 10:28",
    note:"Values-aligned, governance untested under pressure. High H and E standard items; C axis Significant Gap — no demonstrated conduct under challenge; acquiescence on E7, E8, H7.",
    // sScores updated: C corrected to 13 (Significant Gap). R/E/A/H match sResp computation.
    sScores:{R:22,E:22,A:18,C:13,H:24},
    sResp:{
      R:{R1:3,R2:3,R3:2,R4:3,R5:2,R6:3,R7:2,R8:2},
      E:{E1:3,E2:4,E3:3,E4:3,E5:3,E6:3,E7:4,E8:3},
      A:{A1:2,A2:3,A3:2,A4:2,A5:3,A6:2,A7:3,A8:3},
      // C CORRECTED: C1:1,C2:1,C3:1,C4:1,C5:1,C6:2,C7:2,C8:2 → scores to 13 (Significant Gap)
      // Rationale: values present (C6=2, C7=2 partial), but no demonstrated conduct on C1-C5 (all Aspirational)
      // C7 rev scored 5-2=3, C8 rev scored 5-2=3 → total = 1+1+1+1+1+2+3+3 = 13
      C:{C1:1,C2:1,C3:1,C4:1,C5:1,C6:2,C7:2,C8:2},
      H:{H1:3,H2:3,H3:3,H4:4,H5:3,H6:3,H7:4,H8:1},
    },
    citations:{
      R1:"I try to be clear about this in governance discussions.",
      R2:"I do review my decision process as part of my leadership reflection practice.",
      R4:"I raise AI-judgement conflicts at my level when they are material.",
      E2:"I communicated genuine uncertainty to the board regarding our AI-driven talent assessment tool when the fairness data was inconclusive.",
      E3:"I pushed back on the accelerated rollout of the AI performance management tool when our fairness review was incomplete.",
      E4:"I held firm on slowing the AI-driven workforce planning deployment when the model's demographic parity results were not yet satisfactory.",
      E7:"I apply higher scrutiny when things are going well because that is when governance gaps are most likely to be overlooked.",
      E8:"I do not inflate confidence to the board. I present what the evidence supports.",
      H4:"I take personal accountability for our human-centric AI commitments. This is central to my role.",
      H7:"Our AI governance structures in the people domain are well designed. They are embedded and do not need constant revisiting from me.",
      A2:"After the performance AI tool produced unexpected demographic skew I reviewed the original approval process.",
      A5:"I built AI governance principles into our leadership development curriculum this year.",
    },
  },
];

// ── Sample report data ────────────────────────────────────────────────────────
export const SAMPLE_D1_RESP = {
  R1:4,R2:4,R3:3,R4:4,R5:4,R6:2,
  E1:3,E2:4,E3:4,E4:3,E5:3,E6:4,
  A1:2,A2:2,A3:3,A4:2,A5:3,A6:2,
  C1:4,C2:4,C3:4,C4:3,C5:4,C6:4,
  H1:3,H2:3,H3:4,H4:3,H5:4,H6:3,
};
export const SAMPLE_D1_SCORES=(()=>{const raw={},pct={};AXIS_ORDER.forEach(a=>{const v=scoreLikert(SAMPLE_D1_RESP,I1.q,a);raw[a]=v;pct[a]=v!=null?toRadar(v,30):0;});return{raw,pct};})();

export const SAMPLE_D2_RESP = {
  R1:3,R2:2,R3:3,R4:3,R5:4,R6:3,
  E1:4,E2:4,E3:4,E4:3,E5:3,E6:4,
  A1:2,A2:2,A3:2,A4:3,A5:2,A6:3,
  C1:3,C2:3,C3:3,C4:3,C5:3,C6:3,
  H1:4,H2:4,H3:3,H4:4,H5:4,H6:4,
};
export const SAMPLE_D2_SCORES=(()=>{const raw={},pct={};AXIS_ORDER.forEach(a=>{const v=scoreLikert(SAMPLE_D2_RESP,I2.q,a);raw[a]=v;pct[a]=v!=null?toRadar(v,30):0;});return{raw,pct};})();

export const SAMPLE_D3_RESP=(()=>{const flat={};const p=MOCK_PROFILES[0];AXIS_ORDER.forEach(ax=>Object.assign(flat,p.sResp[ax]));return flat;})();
export const SAMPLE_D3_SCORES=(()=>{const raw={...MOCK_PROFILES[0].sScores},pct={};AXIS_ORDER.forEach(a=>{pct[a]=toRadar(raw[a],32);});return{raw,pct};})();

export const SAMPLE_FAC_VSCORES=(()=>{
  const v={};const p=MOCK_PROFILES[0];
  AXIS_ORDER.forEach(ax=>{
    I3.q[ax].forEach(q=>{
      const s=p.sResp[ax][q.id]||2;
      const downgrade=ax==="A"?2:ax==="R"||ax==="H"?1:ax==="C"?1:0;
      v[q.id]=Math.max(1,s-downgrade);
    });
  });
  return v;
})();

export const SAMPLE_FAC_OBS = {
  R:"Responses fluent and well-framed but generic — unable to name specific governance decisions. R6 in particular feels reconstructed rather than contemporaneous.",
  E:"Strongest axis on evidence quality. E3 and E6 both produced specific, named instances with clear commercial pressure context.",
  A:"Weakest evidence base. A1, A3, A6 all produced general assertions rather than specific changes. Governance practice appears static.",
  C:"C1–C3 well-evidenced. C5 and C6 thin — leader defaulted to institutional framework rather than personal conduct.",
  H:"H2 strong — named a specific checkpoint review with outcome. H7 reverse item rated 3, indicating the leader does not regularly revisit oversight structures personally.",
};
