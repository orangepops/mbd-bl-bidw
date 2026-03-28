// ── Instrument data for REACH™ AI Leadership Diagnostic ─────────────────────
// Question content authored by Kathleen Co. Do not edit without instrument review.

export const AXES = {
  R:{name:"Reflective Sense-Making",sub:"How I examine my own reasoning — not just the results I produce."},
  E:{name:"Emotional Regulation under Ambiguity",sub:"How I behave — and what I signal — when the path forward is genuinely unclear."},
  A:{name:"Agility in Learning",sub:"How I update my understanding and practices as AI and its implications evolve."},
  C:{name:"Cognitive Humility",sub:"How readily I examine and revise what I think I know."},
  H:{name:"Human-AI Relational Intelligence",sub:"How I manage the boundary between human judgement and AI."},
};
export const AXIS_ORDER = ["R","E","A","C","H"];

// ── BES helpers ─────────────────────────────────────────────────────────────
export const BES_LABELS = ["Aspirational","Partial","Evidenced with Qualifications","Demonstrated"];
function scoreBES(resp, qs, ax) {
  let s=0,n=0;
  qs[ax].forEach(q=>{
    const v=resp[q.id];
    if(v==null)return;
    n++;
    s += q.rev ? 5-v : v;
  });
  return n===qs[ax].length ? s : null;
}
function scoreLikert(resp, qs, ax) {
  let s=0,n=0;
  qs[ax].forEach(q=>{const v=resp[q.id];if(v==null)return;n++;s+=q.rev?6-v:v;});
  return n===qs[ax].length?s:null;
}
function toRadar(s,max){return Math.min(100,Math.ceil((s/max)*100));}

function getMaturityBand(s){
  if(s<=12)return"Early Stage";
  if(s<=18)return"Developing";
  if(s<=24)return"Established";
  return"Advanced";
}
function getGovBand(s){
  if(s<=13)return"Significant Gap";
  if(s<=19)return"Development Needed";
  if(s<=25)return"Approaching Ready";
  return"Ready to Act";
}
function getTotalGovBand(s){
  if(s<=64)return{band:"Significant Gap",cls:"b-gap",desc:"Multiple axes below threshold. Pre-engagement developmental intervention required across the profile."};
  if(s<=95)return{band:"Developing",cls:"b-devneeded",desc:"Governance capability present but unevenly distributed. Profile asymmetries are the primary diagnostic output."};
  if(s<=125)return{band:"Established",cls:"b-approaching",desc:"Governance readiness largely demonstrated. Targeted axis-level development indicated."};
  return{band:"Advanced",cls:"b-ready",desc:"Governance capability consistently demonstrated. Profile suitable for advanced AI deployment oversight."};
}

// ── Instrument 1 — D1 Self-Assessment ──────────────────────────────────────
export const I1 = {
  code:"LR", title:"REACH AI Leader Diagnostic", subtitle:"D1 - Self-Assessment", duration:"18–22 minutes",
  objective:"Evaluate your developmental standing across the five REACH capabilities. Answer from your most recent significant AI-related decision or initiative — not from your general self-image as a leader.",
  format:"likert",
  q:{
    R:[
      {id:"R1",text:"After significant AI-influenced decisions, I review the reasoning process I applied — not only whether the outcome was acceptable.",rev:false},
      {id:"R2",text:"When I am under time pressure, I can identify afterwards which assumptions I relied on most heavily — and whether those assumptions held.",rev:false},
      {id:"R3",text:"I ask my direct reports or peers how I arrived at a decision, not only whether they agree with it.",rev:false},
      {id:"R4",text:"When an AI output surprises me, I treat it as a signal about my own assumptions — not as a technical anomaly for my team to resolve.",rev:false},
      {id:"R5",text:"I name, openly, what I do not yet understand about the AI challenges I am currently managing.",rev:false},
      {id:"R6",text:"When I have formed a clear view on an AI-related question, I move to execution without revisiting the reasoning that got me there.",rev:true},
    ],
    E:[
      {id:"E1",text:"When I face pressure to move faster on an AI initiative than the evidence supports, I hold my position and use that uncertainty as the explicit basis for slowing down.",rev:false},
      {id:"E2",text:"I communicate an honest picture of what we know and do not know to my team — I do not smooth over uncertainty to appear more in control than I am.",rev:false},
      {id:"E3",text:"I resist projecting false confidence when the case for an AI deployment is still unclear.",rev:false},
      {id:"E4",text:"When I need to delay an AI-related decision, I do so on principle — even when the business is pushing for speed.",rev:false},
      {id:"E5",text:"When AI outputs conflict with each other or with my own reading, I work with the tension rather than resolving it in favor of the more convenient interpretation.",rev:false},
      {id:"E6",text:"When an AI system's logic is not transparent to me, I act on its output rather than building in a longer review period.",rev:true},
    ],
    A:[
      {id:"A1",text:"I can name a specific leadership practice I changed as a direct result of something I learned from an AI initiative.",rev:false},
      {id:"A2",text:"I review AI initiatives that went well with the same rigour I apply to those that failed — not only to confirm what worked, but to examine what I assumed.",rev:false},
      {id:"A3",text:"When I encounter AI applications from outside my domain, I examine what they imply for how I currently work — not only whether they are interesting.",rev:false},
      {id:"A4",text:"I have changed how I personally make decisions — not only how my team operates — as a result of what I have learned from working with AI.",rev:false},
      {id:"A5",text:"I can identify at least one AI-related insight that shifted my view on a question I had previously considered settled.",rev:false},
      {id:"A6",text:"My understanding of AI's strategic implications has materially shifted in the past twelve months. I can describe specifically what changed and what caused it.",rev:false},
    ],
    C:[
      {id:"C1",text:"When AI analysis conflicts with my professional judgement, I examine the conflict — rather than defaulting to either the AI output or my own reading.",rev:false},
      {id:"C2",text:"After significant decisions, I articulate — to my team or board — the assumptions I relied on, not only the conclusion I reached.",rev:false},
      {id:"C3",text:"I can name the person or source that most recently caused me to materially revise my position on an AI-related question.",rev:false},
      {id:"C4",text:"I publicly acknowledge when I revise a significant belief about AI — rather than quietly updating my position without drawing attention to the change.",rev:false},
      {id:"C5",text:"When presenting AI-supported analysis, I am explicit about where the data ends and where my own interpretation begins.",rev:false},
      {id:"C6",text:"When I feel confident about an AI system's performance or direction, I act on that confidence rather than looking for evidence that might challenge it.",rev:true},
    ],
    H:[
      {id:"H1",text:"I maintain and periodically review the human-in-the-loop checkpoints for AI processes I am accountable for — I do not treat their original establishment as sufficient.",rev:false},
      {id:"H2",text:"I can articulate which decisions in my domain must remain exclusively human — and I actively protect those boundaries rather than treating them as policy statements.",rev:false},
      {id:"H3",text:"I notice when people in my team are progressively deferring to AI outputs in ways that erode their professional ownership of decisions.",rev:false},
      {id:"H4",text:"I personally exercise independent judgement on material decisions without first consulting an AI output — to preserve that muscle, not because AI is unavailable.",rev:false},
      {id:"H5",text:"I am explicit — with my team and with governance bodies — about where AI should inform decisions but must not make them.",rev:false},
      {id:"H6",text:"I find it difficult to identify specific moments where my own reliance on AI tools has increased beyond what I would consider healthy.",rev:true},
    ],
  }
};

// ── Instrument 2 — D2 360° Assessment ──────────────────────────────────────
export const I2 = {
  code:"360", title:"REACH AI Leader Diagnostic", subtitle:"D2 - 360° Assessment", duration:"12–15 minutes",
  objective:"Provide your leader with an observational perspective on how they demonstrate leadership behaviors during AI transformation. Responses are anonymised and aggregated into a team profile.",
  format:"likert",
  q:{
    R:[
      {id:"R1",text:"My leader shares the reasoning and assumptions behind a major AI-related decision — not only the conclusion they reached.",rev:false},
      {id:"R2",text:"My leader asks for feedback on how they made a decision, not only whether the team agrees with the outcome.",rev:false},
      {id:"R3",text:"When decisions had to be made quickly, my leader names the assumptions they relied on — rather than presenting the decision as self-evident.",rev:false},
      {id:"R4",text:"My leader creates structured space for the team to examine what we learned from an AI initiative before we move on to the next one.",rev:false},
      {id:"R5",text:"My leader is openly honest about what they do not yet understand regarding an AI challenge we are facing.",rev:false},
      {id:"R6",text:"My leader presents their reasoning on AI decisions as settled — the team would not feel it was genuinely open to examination.",rev:true},
    ],
    E:[
      {id:"E1",text:"When AI initiatives face unexpected setbacks, my leader's response helps the team stay focused rather than amplifying the pressure.",rev:false},
      {id:"E2",text:"My leader is honest with the team when they do not have a clear answer — rather than filling the uncertainty with premature reassurance.",rev:false},
      {id:"E3",text:"My leader avoids projecting certainty when the facts about an AI deployment are still unclear.",rev:false},
      {id:"E4",text:"My leader is willing to slow down an AI-related decision when the situation is genuinely uncertain — even when the business is pushing for speed.",rev:false},
      {id:"E5",text:"My leader works through conflicting information about AI results methodically — rather than defaulting to the most convenient interpretation.",rev:false},
      {id:"E6",text:"When my leader is uncertain about an AI decision, that uncertainty tends to create anxiety in the team rather than calm it.",rev:true},
    ],
    A:[
      {id:"A1",text:"My leader has changed a specific leadership practice based on something they learned from an AI initiative — and has named that change explicitly.",rev:false},
      {id:"A2",text:"My leader reviews AI initiatives that went well with the same rigour as those that failed — not only to confirm what worked.",rev:false},
      {id:"A3",text:"My leader draws lessons from AI initiatives across the organization — including those in other functions — not only from their own domain.",rev:false},
      {id:"A4",text:"My leader creates space for the team to understand why AI systems behave as they do — not only how to operate them.",rev:false},
      {id:"A5",text:"My leader describes how their thinking on AI has changed — not only what they currently believe.",rev:false},
      {id:"A6",text:"My leader's approach to AI governance and decision-making looks essentially the same as it did a year ago.",rev:true},
    ],
    C:[
      {id:"C1",text:"When AI data contradicts my leader's professional judgement, they investigate the difference before deciding — rather than defaulting to either.",rev:false},
      {id:"C2",text:"My leader is explicit about the assumptions they are making when reaching a conclusion — not only the conclusion itself.",rev:false},
      {id:"C3",text:"When team members push back on my leader's view on an AI question, my leader responds in a way that makes people willing to do it again.",rev:false},
      {id:"C4",text:"My leader openly acknowledges when they have changed their mind about an AI-related belief — rather than quietly updating their position.",rev:false},
      {id:"C5",text:"My leader avoids declaring an AI initiative successful until there is consistent evidence — rather than acting on early positive results.",rev:false},
      {id:"C6",text:"When my leader has formed a confident view on an AI question, the team would find it difficult to introduce evidence that changes it.",rev:true},
    ],
    H:[
      {id:"H1",text:"My leader checks that human review steps in our AI processes are genuinely exercising judgement — not just completing a required sign-off.",rev:false},
      {id:"H2",text:"My leader identifies decisions that must remain exclusively human and actively protects them from being automated away.",rev:false},
      {id:"H3",text:"My leader notices when the team is following AI outputs too uncritically — and steps in to address it.",rev:false},
      {id:"H4",text:"My leader visibly makes decisions using their own judgement — demonstrating independent thinking rather than always reaching for data or AI output first.",rev:false},
      {id:"H5",text:"My leader is clear about where AI should inform decisions in our team but must not make them.",rev:false},
      {id:"H6",text:"In our team, the boundary between what AI decides and what humans decide has become less clear over time.",rev:true},
    ],
  }
};

// ── Instrument 3 — D3 Governance (BES, 8 items, 2 reverse per axis) ────────
export const I3 = {
  code:"GV", title:"REACH AI Governance Readiness Diagnostic", subtitle:"D3 - Self-Assessment", duration:"30–35 minutes",
  objective:"Assess whether you currently possess the personal capabilities to discharge your AI governance obligations with substantive intent — not whether your institution has the correct policies in place. Regulatory anchors: MAS FEAT Principles (2019), MAS 2025 AI Risk Management Guidelines, PDPA with AI Clause, EU AI Act (2024), MAS Veritas Initiative (2023), OECD AI Principles (2024), ISO/IEC 42001:2023, MAS Pathfinder (2025), Corporate Codes of Ethics / Responsible AI Principles.",
  format:"bes",
  q:{
    R:[
      {id:"R1",text:"Before committing to a governance position or presenting to my board, I draw an explicit line between where the AI output ends and where my own judgement begins.",anchor:"MAS FEAT (Transparency, Accountability) · MAS 2025",rev:false},
      {id:"R2",text:"After significant AI-influenced decisions, I review whether the reasoning process I applied was sound — not only whether the outcome was acceptable.",anchor:"MAS 2025 (Management Accountability) · MAS FEAT (Accountability)",rev:false},
      {id:"R3",text:"For each AI system I am accountable for, I periodically verify — not merely assume — that the conditions requiring independent human review are being applied as intended, not only as written.",anchor:"MAS 2025 · PDPA with AI Clause · EU AI Act (High-risk systems)",rev:false},
      {id:"R4",text:"When an AI output conflicts with my professional judgement, I treat it as a signal requiring structured examination at my level — not an operational matter to be resolved below me.",anchor:"MAS FEAT (Accountability) · MAS 2025",rev:false},
      {id:"R5",text:"When I have accepted, modified, or rejected a specific AI-generated recommendation, I am able to account to my board or a regulatory examiner for my reasoning — not just my conclusion.",anchor:"MAS FEAT (Transparency) · MAS 2025 · EU AI Act (Transparency) · OECD AI Principles 2024",rev:false},
      {id:"R6",text:"At the point of a significant AI-influenced decision, I record my reasoning in a form that withstands independent review — not reconstructed after the fact.",anchor:"MAS 2025 (Governance documentation) · PDPA with AI Clause · ISO/IEC 42001:2023 · MAS FEAT (Accountability)",rev:false},
      {id:"R7",text:"I treat the documentation of AI governance decisions as primarily an administrative responsibility of my governance or compliance function — not a personal accountability I maintain directly.",anchor:"MAS 2025 · PDPA with AI Clause · ISO/IEC 42001:2023 · MAS FEAT (Accountability)",rev:true},
      {id:"R8",text:"When forming a governance position, I draw on the analysis my team provides rather than actively seeking direct challenge from an independent governance voice outside my immediate reporting line.",anchor:"MAS FEAT (Accountability) · OECD AI Principles 2024 · Corporate Codes of Ethics",rev:true},
    ],
    E:[
      {id:"E1",text:"When governance concerns on an AI initiative are unresolved, I use the regulatory framework as the principled basis for slowing or stopping deployment — not as an obstacle to be navigated.",anchor:"MAS 2025 · MAS FEAT (Accountability) · SG National AI Strategy 2.0",rev:false},
      {id:"E2",text:"In board and governance committee settings, I communicate an honest account of what we know and do not know about an AI initiative — presenting neither more confidence nor more concern than the evidence supports.",anchor:"MAS FEAT (Transparency, Accountability) · MAS 2025",rev:false},
      {id:"E3",text:"When I have held a governance position against material pressure from peers or the business, I have done so on principle — and I can state that principle explicitly, not merely the process I followed.",anchor:"MAS FEAT (Accountability) · MAS 2025",rev:false},
      {id:"E4",text:"When I receive conflicting assessments of an AI system's risk or performance in a governance committee, I resist resolving the ambiguity by deferring to the most senior, most recent, or most commercially urgent argument in the room.",anchor:"MAS FEAT (Accountability) · MAS 2025 · OECD AI Principles 2024",rev:false},
      {id:"E5",text:"I apply the same level of governance scrutiny to AI decisions during periods of strong performance as I do after setbacks — my oversight discipline does not vary with outcomes.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act",rev:false},
      {id:"E6",text:"When a commercially attractive AI initiative presents unresolved governance concerns, I treat those concerns as the binding constraint — not as a factor to be weighed against business upside.",anchor:"MAS FEAT (Ethics, Accountability) · MAS 2025 · Corporate Codes of Ethics",rev:false},
      {id:"E7",text:"My level of governance scrutiny on AI initiatives is higher when we are managing problems than when performance is strong — I apply more rigour when the business is under pressure than when it is not.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act",rev:true},
      {id:"E8",text:"When I communicate to my board about AI governance matters, I present a more confident picture than the evidence supports if I believe that confidence will help secure approval or avoid unnecessary scrutiny.",anchor:"MAS FEAT (Transparency, Accountability) · MAS 2025 · OECD AI Principles 2024",rev:true},
    ],
    A:[
      {id:"A1",text:"In the past twelve months, I have made a specific change to how I personally exercise oversight of AI in my domain — driven by new regulatory guidance, an industry development, or evidence from within my institution.",anchor:"MAS 2025 · MAS FEAT (Ongoing oversight) · SG Budget 2026",rev:false},
      {id:"A2",text:"When an AI system I am accountable for produces an unexpected or adverse outcome, I review the governance process that led to the original approval — not only the technical or operational failure.",anchor:"MAS 2025 · MAS FEAT (Accountability) · ISO/IEC 42001:2023",rev:false},
      {id:"A3",text:"My understanding of the governance risks associated with AI in my domain has materially shifted in the past eighteen months — and that shift has changed at least one governance practice, not only my reading of the landscape.",anchor:"MAS 2025 · SG National AI Strategy 2.0 · OECD AI Principles 2024",rev:false},
      {id:"A4",text:"I engage directly with evolving AI governance developments — regulatory updates, industry incidents, supervisory communications — rather than relying on filtered summaries or briefings to reach me.",anchor:"MAS 2025 · SG Budget 2026 · SG National AI Strategy 2.0 / IMDA · MAS FEAT",rev:false},
      {id:"A5",text:"I am actively developing AI governance capability in those who report to me and in the governance structures I am accountable for — not only maintaining my own.",anchor:"MAS 2025 · MAS FEAT (Accountability) · Corporate Codes of Ethics",rev:false},
      {id:"A6",text:"In the past twelve months, I have updated a governance practice in my domain in anticipation of an incoming regulatory development — before it became a formal requirement.",anchor:"MAS 2025 · SG Budget 2026 · SG National AI Strategy 2.0 / IMDA · MAS FEAT (Ongoing oversight)",rev:false},
      {id:"A7",text:"My approach to AI governance has remained substantially consistent over the past eighteen months — the frameworks and oversight practices I established have not required material revision.",anchor:"MAS 2025 · MAS FEAT (Ongoing oversight) · SG National AI Strategy 2.0",rev:true},
      {id:"A8",text:"I rely on my governance and compliance teams to track regulatory developments and alert me when my direct action is required — rather than engaging with those developments directly.",anchor:"MAS 2025 · MAS FEAT (Accountability) · MAS Pathfinder (2025)",rev:true},
    ],
    C:[
      {id:"C1",text:"When I present a governance position on AI, I distinguish clearly — for my board and governance peers — between my own direct understanding and the expert advice I am drawing on.",anchor:"MAS FEAT (Accountability, Transparency) · EU AI Act (Transparency) · OECD AI Principles 2024",rev:false},
      {id:"C2",text:"When technical teams present AI risk assessments to me, I apply my own consistent line of interrogation — rather than treating the quality of the presentation as evidence of the quality of the analysis.",anchor:"MAS 2025 (Model risk governance) · MAS FEAT (Accountability) · EU AI Act · ISO/IEC 42001:2023",rev:false},
      {id:"C3",text:"In the past year, I have openly revised a governance position I had previously held with confidence — based on new evidence or rigorous challenge — rather than quietly adjusting my position without acknowledgement.",anchor:"MAS FEAT (Accountability) · OECD AI Principles 2024 · Corporate Codes of Ethics",rev:false},
      {id:"C4",text:"I distinguish between my authority to approve an AI system and my substantive understanding of its governance implications — and where that gap exists, I have a deliberate process for bridging it before approval is granted, not after.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act (High-risk system approval) · OECD AI Principles 2024",rev:false},
      {id:"C5",text:"I apply the same level of scrutiny to AI outputs that confirm my existing governance position as to those that challenge it — and I can point to a specific instance where I did so when it was commercially inconvenient.",anchor:"MAS FEAT (Accountability) · MAS 2025 · OECD AI Principles 2024",rev:false},
      {id:"C6",text:"When AI systems in my domain affect individuals in material ways, I maintain my own independent line of sight into how fairness and ethics obligations are being met — I do not treat technical or model development team sign-off as closing that question.",anchor:"MAS Veritas 2023 · MAS FEAT (Fairness, Accountability) · EU AI Act · MAS 2025",rev:false},
      {id:"C7",text:"When I find an AI risk assessment compelling, I act on it — I consider that requiring independent validation before proceeding adds process overhead that my governance experience allows me to compensate for.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act · ISO/IEC 42001:2023",rev:true},
      {id:"C8",text:"I am confident that my understanding across the AI governance areas I am accountable for is sufficiently developed — I am not aware of a material gap that requires deliberate attention.",anchor:"MAS 2025 · OECD AI Principles 2024 · MAS FEAT (Accountability) · Corporate Codes of Ethics",rev:true},
    ],
    H:[
      {id:"H1",text:"I periodically review whether the decision categories in my domain defined as requiring irreducible human judgement remain fit for purpose — as AI capabilities evolve and the scope of our AI portfolio expands.",anchor:"MAS FEAT (Fairness, Ethics, Accountability) · MAS 2025 · EU AI Act (High-risk systems)",rev:false},
      {id:"H2",text:"I review whether the human oversight checkpoints in my AI processes are genuinely exercising independent judgement — or have become sign-offs that do not substantively alter AI-generated outcomes.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act · MAS Veritas 2023",rev:false},
      {id:"H3",text:"I have established direct channels — outside formal reporting structures — through which my governance and technical teams surface signs of over-reliance on AI outputs to me before it becomes a systemic pattern.",anchor:"MAS FEAT (Ethics, Accountability) · MAS 2025 · Corporate Codes of Ethics",rev:false},
      {id:"H4",text:"I hold myself personally accountable for the quality of human oversight, the integrity of human-in-the-loop processes, and the preservation of professional judgement in the AI systems I am responsible for.",anchor:"MAS FEAT (Ethics, Accountability) · MAS 2025 · OECD AI Principles 2024 · Corporate Codes of Ethics",rev:false},
      {id:"H5",text:"Within the past twelve months, I have verified — not merely assumed — that the human-in-the-loop checkpoints in my highest-risk AI systems are exercising genuine judgement, not completing a required sign-off.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act (Meaningful human oversight) · MAS Veritas 2023",rev:false},
      {id:"H6",text:"I treat the cumulative narrowing of independent decision-making in my domain — as AI adoption scales — as a governance risk requiring active management, not an efficiency outcome to be reported.",anchor:"MAS FEAT (Ethics) · MAS 2025 · Corporate Codes of Ethics · SG National AI Strategy 2.0",rev:false},
      {id:"H7",text:"The human oversight structures established in my domain — decision boundaries, human-in-the-loop checkpoints, and review processes — are well embedded and do not require regular revisiting from me personally.",anchor:"MAS 2025 · MAS FEAT (Accountability) · EU AI Act · MAS Veritas 2023",rev:true},
      {id:"H8",text:"The account I would give a customer, regulator, or affected individual about how human oversight in my domain protects their interests is substantially captured in our policy documentation — I would refer them to that documentation as my primary account.",anchor:"MAS FEAT (Fairness, Transparency) · MAS Veritas 2023 · EU AI Act · PDPA with AI Clause · OECD AI Principles 2024",rev:true},
    ],
  }
};
