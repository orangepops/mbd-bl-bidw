import React, { useState, useContext, createContext, useCallback } from "react";
import { AXES, AXIS_ORDER, BES_LABELS, I1, I2, I3 } from "./data/instruments.js";
import { EVIDENCE_PROMPTS } from "./data/evidencePrompts.js";
import { FLAG_TEXT, DIM_ANCHOR, DIMENSION_DESC } from "./data/interpretations.js";
import {
  MOCK_PROFILES,
  SAMPLE_D1_RESP, SAMPLE_D1_SCORES,
  SAMPLE_D2_RESP, SAMPLE_D2_SCORES,
  SAMPLE_D3_RESP, SAMPLE_D3_SCORES,
  SAMPLE_FAC_VSCORES, SAMPLE_FAC_OBS,
} from "./data/mockProfiles.js";
import { AGG_PROFILES, AGG_COLORS, getTeamAvg, getAggBandClass, getAggBandLabel, getIndivStyle } from "./data/aggregateData.js";
import { generateSessionId, scoreBES, scoreLikert, toRadar, getMaturityBand, getGovBand, getTotalGovBand } from "./scoring/scoring.js";

/**
 * ─────────────────────────────────────────────────────
 *  REACH™ AI Leadership Diagnostic
 *  HUMAN Framework · Pillar H · SMU-XL / BCG BrightHouse
 * ─────────────────────────────────────────────────────
 *  Owner     : Kathleen Co
 *  Designer  : Kathleen Co
 *  Version   : 1.0-beta
 *  Created   : 26 March 2026
 *  Built with: Claude AI (Anthropic, claude-sonnet-4-6)
 * ─────────────────────────────────────────────────────
 *  A C-suite AI leadership readiness diagnostic suite
 *  calibrated for Singapore's financial sector regulatory
 *  environment (MAS FEAT · MAS 2025 · EU AI Act).
 *  Research-grade prototype — Phase 1, pending validation.
 * ─────────────────────────────────────────────────────
 *  For Internal Review Only
 *  Not for Publication or Citation Without Permission
 * ─────────────────────────────────────────────────────
 */


// ── Instrument 1 — D1 Self-Assessment ──────────────────────────────────────



// ── Radar component ───────────────────────────────────────────────────────────
function RadarChart({selfData, verifiedData=null, size=300}) {
  const c=size/2, maxR=size*0.38, labelR=size*0.47, n=AXIS_ORDER.length;
  const step=(2*Math.PI)/n, sa=-Math.PI/2;
  const xy=(a,r)=>({x:c+r*Math.cos(a),y:c+r*Math.sin(a)});
  const path=(data)=>AXIS_ORDER.map((ax,i)=>{
    const{x,y}=xy(sa+i*step,(data[ax]||0)/100*maxR);
    return`${i===0?"M":"L"}${x},${y}`;
  }).join(" ")+"Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25,50,75,100].map(lv=>(
        <polygon key={lv}
          points={AXIS_ORDER.map((_,i)=>{const{x,y}=xy(sa+i*step,lv/100*maxR);return`${x},${y}`;}).join(" ")}
          fill="none" stroke="rgba(184,144,42,0.15)" strokeWidth="1"/>
      ))}
      {AXIS_ORDER.map((ax,i)=>{
        const{x,y}=xy(sa+i*step,maxR);
        return <line key={ax} x1={c} y1={c} x2={x} y2={y} stroke="#dde3eb" strokeWidth="1"/>;
      })}
      <path d={path(selfData)} fill="rgba(26,77,145,0.12)" stroke="#1a4d91" strokeWidth="2" strokeLinejoin="round"/>
      {AXIS_ORDER.map((ax,i)=>{
        const{x,y}=xy(sa+i*step,(selfData[ax]||0)/100*maxR);
        return <circle key={ax} cx={x} cy={y} r="4" fill="#1a4d91" stroke="#ffffff" strokeWidth="1.5"/>;
      })}
      {verifiedData && (
        <>
          <path d={path(verifiedData)} fill="rgba(196,122,30,0.1)" stroke="#c47a1e" strokeWidth="2" strokeDasharray="5,3" strokeLinejoin="round"/>
          {AXIS_ORDER.map((ax,i)=>{
            const{x,y}=xy(sa+i*step,(verifiedData[ax]||0)/100*maxR);
            return <circle key={ax} cx={x} cy={y} r="4" fill="#c47a1e" stroke="#ffffff" strokeWidth="1.5"/>;
          })}
        </>
      )}
      {AXIS_ORDER.map((ax,i)=>{
        const{x,y}=xy(sa+i*step,labelR);
        return <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#7a5c1e" fontSize="16" fontFamily="Cormorant Garamond,serif" fontWeight="700">{ax}</text>;
      })}
    </svg>
  );
}

// Aggregate radar — individual lines + team average
function AggRadarChart({profiles, average, size=320}) {
  const c=size/2, maxR=size*0.38, labelR=size*0.47;
  const step=(2*Math.PI)/AXIS_ORDER.length, sa=-Math.PI/2;
  const xy=(a,r)=>({x:c+r*Math.cos(a),y:c+r*Math.sin(a)});
  const MAX=32;
  const pathFromScores=(scores)=>AXIS_ORDER.map((ax,i)=>{
    const pct=(scores[ax]||0)/MAX;
    const{x,y}=xy(sa+i*step,pct*maxR);
    return`${i===0?"M":"L"}${x},${y}`;
  }).join(" ")+"Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25,50,75,100].map(lv=>(
        <polygon key={lv}
          points={AXIS_ORDER.map((_,i)=>{const{x,y}=xy(sa+i*step,lv/100*maxR);return`${x},${y}`;}).join(" ")}
          fill="none" stroke="rgba(184,144,42,0.12)" strokeWidth="1"/>
      ))}
      {AXIS_ORDER.map((ax,i)=>{
        const{x,y}=xy(sa+i*step,maxR);
        return <line key={ax} x1={c} y1={c} x2={x} y2={y} stroke="#dde3eb" strokeWidth="1"/>;
      })}
      {profiles.map((p,pi)=>(
        <path key={pi}
          d={pathFromScores(p.scores)}
          fill={AGG_COLORS[pi]+"22"}
          stroke={AGG_COLORS[pi]}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinejoin="round"
          opacity="0.7"
        />
      ))}
      <path d={pathFromScores(average)} fill="rgba(184,144,42,0.15)" stroke="#d4a835" strokeWidth="2.5" strokeLinejoin="round"/>
      {AXIS_ORDER.map((ax,i)=>{
        const pct=(average[ax]||0)/MAX;
        const{x,y}=xy(sa+i*step,pct*maxR);
        return <circle key={ax} cx={x} cy={y} r="5" fill="#d4a835" stroke="#111b2b" strokeWidth="1.5"/>;
      })}
      {AXIS_ORDER.map((ax,i)=>{
        const{x,y}=xy(sa+i*step,labelR);
        return <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#d4a835" fontSize="16" fontFamily="Cormorant Garamond,serif" fontWeight="700">{ax}</text>;
      })}
    </svg>
  );
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppCtx = createContext();
function AppProvider({children}) {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("respondent");
  const [inst, setInst] = useState(null);
  const [session, setSession] = useState(null);
  const [resp, setResp] = useState({});
  const [evidence, setEvidence] = useState({});
  const [axIdx, setAxIdx] = useState(0);
  const [scores, setScores] = useState(null);
  const [leaderName, setLeaderName] = useState("");
  const [facProfile, setFacProfile] = useState(null);
  const [vScores, setVScores] = useState({});
  const [obsNotes, setObsNotes] = useState({});
  const [facAxIdx, setFacAxIdx] = useState(0);
  const [facScreen, setFacScreen] = useState("select");

  const start = useCallback((i) => {
    setInst(i); setSession({id:generateSessionId(i.code)}); setResp({}); setEvidence({}); setAxIdx(0);
    if(i.code==="360"){setLeaderName("");setScreen("leader-input");}
    else setScreen("survey");
  },[]);
  const startSurvey = useCallback(()=>setScreen("survey"),[]);
  const answer = useCallback((id,v)=>setResp(p=>({...p,[id]:v})),[]);
  const updateEvidence = useCallback((id,v)=>setEvidence(p=>({...p,[id]:v})),[]);
  const startFac = useCallback((profile)=>{
    setFacProfile(profile); setVScores({}); setObsNotes({}); setFacAxIdx(0); setFacScreen("entry");
  },[]);
  const startSampleReport = useCallback((instObj, sampleScores, sampleResp) => {
    setInst(instObj); setSession({id:"REACH-SAMPLE-DEMO"}); setResp(sampleResp||{}); setEvidence({}); setScores(sampleScores); setScreen("results");
  },[]);
  const startFacSampleReport = useCallback((profile, preVScores, preObsNotes) => {
    setFacProfile(profile); setVScores(preVScores||{}); setObsNotes(preObsNotes||{}); setFacAxIdx(0); setFacScreen("results"); setScreen("facilitator");
  },[]);

  return (
    <AppCtx.Provider value={{
      screen,setScreen,mode,setMode,inst,start,startSurvey,session,resp,answer,evidence,updateEvidence,
      axIdx,setAxIdx,scores,setScores,leaderName,setLeaderName,
      facProfile,setFacProfile,vScores,setVScores,obsNotes,setObsNotes,
      facAxIdx,setFacAxIdx,facScreen,setFacScreen,startFac,
      startSampleReport,startFacSampleReport
    }}>
      {children}
    </AppCtx.Provider>
  );
}

// ── Question components ───────────────────────────────────────────────────────
function LikertQ({q,val,onChange}) {
  const labels=["Never","Rarely","Sometimes","Often","Consistently"];
  return (
    <div className="question-block">
      <div className="question-id">
        <span>{q.id}</span>
        {q.rev && <span className="rev-tag">REVERSE</span>}
      </div>
      <p className={`question-text${q.rev?" reverse-note":""}`}>{q.text}</p>
      <div className="likert-row">
        {[1,2,3,4,5].map(v=>(
          <label key={v} className="likert-option">
            <button className={`likert-btn${val===v?" selected":""}`} onClick={()=>onChange(q.id,v)}>{v}</button>
            <span style={{fontSize:10,color:val===v?"var(--gold-muted)":"var(--text-subtle)",textAlign:"center"}}>{labels[v-1]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

const MIN_CHARS=100, MAX_CHARS=400;
function BESQ({q,val,onChange,evidenceVal,onEvidenceChange,showValidation}) {
  const prompt = EVIDENCE_PROMPTS[q.id];
  const shouldShowPrompt = val != null && (q.rev ? val<=2 : val>=3);
  const charCount=(evidenceVal||"").trim().length;
  const isValid=charCount>=MIN_CHARS&&charCount<=MAX_CHARS;
  const showError=showValidation&&shouldShowPrompt&&!isValid;

  return (
    <div className="question-block">
      <div className="question-id">
        <span>{q.id}</span>
        {q.rev && <span className="rev-tag">REVERSE</span>}
      </div>
      <p className={`question-text${q.rev?" reverse-note":""}`}>{q.text}</p>
      <div className="bes-row">
        {[1,2,3,4].map(v=>(
          <div key={v} className="bes-option">
            <button className={`bes-btn${val===v?" selected":""}`} onClick={()=>onChange(q.id,v)}>{v}</button>
            <span className={`bes-label${val===v?" active":""}`}>{BES_LABELS[v-1]}</span>
          </div>
        ))}
      </div>
      {shouldShowPrompt && prompt && (
        <div className="evidence-prompt-wrap">
          <div className="evidence-prompt-label">Evidence Required</div>
          <p className="evidence-prompt-question">{prompt}</p>
          <textarea
            className={`evidence-textarea${showError?" invalid":""}`}
            value={evidenceVal||""}
            onChange={e=>{if(e.target.value.length<=MAX_CHARS)onEvidenceChange(q.id,e.target.value);}}
            placeholder="Describe a specific instance…"
          />
          <div className="evidence-char-row">
            <span className={`char-count${isValid?" ok":" warn"}`}>{charCount} / {MAX_CHARS}</span>
            <span className="char-hint">{charCount<MIN_CHARS?`${MIN_CHARS-charCount} more required`:charCount>MAX_CHARS?"Maximum reached":"✓ Sufficient"}</span>
          </div>
        </div>
      )}
      {!shouldShowPrompt && (
        <div className="evidence-dormant">
          <div className="evidence-dormant-label">Evidence Prompt</div>
          <div className="evidence-dormant-text">{q.rev?"Evidence required if rated 1 or 2":"Evidence required if rated 3 or 4"}</div>
        </div>
      )}
    </div>
  );
}

function PromptWarningModal({onClose}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">⚠</div>
        <div className="modal-title">Evidence Incomplete</div>
        <div className="modal-body">
          One or more items require a specific instance of at least <em>{MIN_CHARS} characters</em> before you can proceed.<br/><br/>
          If you cannot describe a specific instance, consider <em>adjusting your rating</em> to better reflect your current practice.
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Review My Responses</button>
        </div>
      </div>
    </div>
  );
}

// ── Survey screen ─────────────────────────────────────────────────────────────
function SurveyScreen() {
  const {inst,resp,answer,evidence,updateEvidence,axIdx,setAxIdx,setScreen,setScores,session} = useContext(AppCtx);
  const [showWarning,setShowWarning]=useState(false);
  const [showValidation,setShowValidation]=useState(false);
  const ax=AXIS_ORDER[axIdx];
  const qs=inst.q[ax];
  const isBES=inst.format==="bes";
  const isL=inst.format==="likert";
  const allRated=qs.every(q=>resp[q.id]!=null);
  const isLast=axIdx===AXIS_ORDER.length-1;
  const total=AXIS_ORDER.reduce((s,a)=>s+inst.q[a].length,0);
  const prog=(Object.keys(resp).length/total)*100;

  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[axIdx]);

  const validateEvidence=()=>{
    if(!isBES)return true;
    return qs.every(q=>{
      const v=resp[q.id];
      if(v==null)return true;
      const needsEvidence=q.rev?v<=2:v>=3;
      if(!needsEvidence)return true;
      const txt=(evidence[q.id]||"").trim();
      return txt.length>=MIN_CHARS&&txt.length<=MAX_CHARS;
    });
  };

  const handleAdvance=()=>{
    setShowValidation(true);
    if(!validateEvidence()){setShowWarning(true);return;}
    setShowValidation(false);
    if(isLast){
      const raw={},pct={};
      AXIS_ORDER.forEach(a=>{
        const v=isBES?scoreBES(resp,inst.q,a):scoreLikert(resp,inst.q,a);
        raw[a]=v;
        const mx=isBES?32:30;
        pct[a]=v!=null?toRadar(v,mx):0;
      });
      setScores({raw,pct});setScreen("results");
    } else {
      setAxIdx(v=>v+1);
    }
  };

  return (
    <div className="app">
      {showWarning&&<PromptWarningModal onClose={()=>setShowWarning(false)}/>}
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">{inst.subtitle}</span></div>
        <div className="header-right">{session&&<span className="header-session">{session.id}</span>}</div>
      </div>
      <div className="progress-strip"><div className="progress-fill" style={{width:`${prog}%`}}/></div>
      <div className="container">
        <div className="card">
          <div className="axis-header">
            <div className="axis-letter">{ax}</div>
            <div>
              <div className="axis-title">{AXES[ax].name}</div>
              <div className="axis-subtitle">{AXES[ax].sub}</div>
            </div>
            <div className="axis-counter">{axIdx+1} / {AXIS_ORDER.length}</div>
          </div>
          {isBES && (
            <div style={{marginBottom:24,padding:"14px 18px",background:"#fdf8ee",borderRadius:"var(--radius-sm)",border:"1px solid rgba(184,144,42,0.3)"}}>
              <div style={{display:"flex",gap:32,flexWrap:"wrap",rowGap:10}}>
                {[1,2,3,4].map((v,i)=>(
                  <div key={v} style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontFamily:"var(--font-display)",fontSize:18,color:"var(--gold)",fontWeight:600,flexShrink:0}}>{v}</span>
                    <span style={{fontSize:13,color:"var(--text-primary)",letterSpacing:"0.02em"}}>{BES_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {qs.map(q=>isL
            ?<LikertQ key={q.id} q={q} val={resp[q.id]??null} onChange={answer}/>
            :<BESQ key={q.id} q={q} val={resp[q.id]??null} onChange={answer}
               evidenceVal={evidence[q.id]||""} onEvidenceChange={updateEvidence} showValidation={showValidation}/>
          )}
          <div className="nav-row">
            <div>{axIdx>0&&<button className="btn-ghost" onClick={()=>{setShowValidation(false);setAxIdx(v=>v-1);}}>← Back</button>}</div>
            <div className="nav-dots">
              {AXIS_ORDER.map((a,i)=>{
                const hasSome=Object.keys(resp).some(k=>k.startsWith(a));
                return <div key={a} className={`nav-dot${i===axIdx?" active":hasSome?" done":""}`}/>;
              })}
            </div>
            <button className="btn-primary" disabled={!allRated} onClick={handleAdvance}>
              {isLast?"View Results →":"Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function formatDate() {
  const d=new Date();
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function ResultsScreen() {
  const {inst,session,scores,resp,setScreen,leaderName}=useContext(AppCtx);
  const isObs=inst.code==="360";
  const isBES=inst.format==="bes";
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);

  const getBand=ax=>{
    const r=scores.raw[ax];
    if(r==null)return"—";
    return isBES?getGovBand(r):getMaturityBand(r);
  };
  const bandClass={"Early Stage":"b-early","Developing":"b-developing","Established":"b-established","Advanced":"b-advanced","Significant Gap":"b-gap","Development Needed":"b-devneeded","Approaching Ready":"b-approaching","Ready to Act":"b-ready"};

  if(isObs){
    return (
      <div className="app">
        <div className="header"><div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">{inst.subtitle}</span></div></div>
        <div className="container">
          <div className="card" style={{maxWidth:600,margin:"60px auto"}}>
            <div style={{marginBottom:28,paddingBottom:24,borderBottom:"1px solid #dde3eb"}}>
              <p style={{fontSize:14,color:"var(--text-muted)",marginBottom:4,fontFamily:"'Courier New',monospace"}}>Assessment submitted for:</p>
              <p style={{fontSize:18,color:"var(--navy-900)",marginBottom:8}}>{leaderName}</p>
              <p style={{fontSize:13,color:"var(--text-subtle)",fontFamily:"'Courier New',monospace"}}>{formatDate()}</p>
            </div>
            <div className="section-label" style={{marginBottom:12}}>Thank You</div>
            <p style={{fontSize:15,color:"var(--text-secondary)",lineHeight:1.85}}>Your responses have been recorded. They will be combined with input from others in your team to generate an aggregated leadership profile — no individual response is attributed or shared.</p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:24,lineHeight:1.75,fontStyle:"italic",padding:"0 16px"}}>
          CONFIDENTIAL – INTERNAL USE ONLY. This is a prototype release utilising sample data; no personal identifiers or user responses are stored or retained. This site and its contents are not for publication or citation without prior authorisation.
        </p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:8,lineHeight:1.9,fontFamily:"'Courier New',monospace",letterSpacing:"0.04em"}}>
          REACH™ AI Leadership Diagnostic · v1.0-beta<br/>
          HUMAN Framework · SMU-XL / BCG BrightHouse<br/>
          © Kathleen Co (Singapore) · Last updated 26 March 2026<br/>
          Built with Claude AI (Anthropic)
        </p>
            <div style={{marginTop:24,textAlign:"center"}}><button className="btn-ghost" onClick={()=>setScreen("home")}>← Return to Home</button></div>
          </div>
        </div>
      </div>
    );
  }

  const flaggedAxes=isBES?AXIS_ORDER.filter(ax=>I3.q[ax].some(q=>{
    const v=resp[q.id];
    if(v==null)return false;
    return q.rev?v>=3:v===1;
  })):[];
  const descSet=isBES?DIMENSION_DESC.GV:DIMENSION_DESC.LR;
  const axMax=isBES?32:30;
  const totalS=isBES?AXIS_ORDER.reduce((s,ax)=>s+(scores.raw[ax]||0),0):null;
  const totalBand=isBES?getTotalGovBand(totalS):null;
  const isSample=session?.id==="REACH-SAMPLE-DEMO";

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">Results</span></div>
        <div className="header-right">
          {isSample&&<span style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",padding:"4px 10px",borderRadius:"2px",background:"rgba(184,100,26,0.15)",color:"#b8621a",border:"1px solid rgba(184,100,26,0.3)",fontWeight:500}}>Sample Report</span>}
          {session&&<span className="header-session">{session.id}</span>}
        </div>
      </div>
      <div className="container">
        {/* Report title block */}
        <div style={{textAlign:"center",padding:"32px 0 24px",borderBottom:"1px solid #dde3eb",marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:8}}>
            HUMAN Framework · Pillar H · {isSample?"Sample Report":"Assessment Results"}
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,4vw,40px)",color:"var(--navy-900)",fontWeight:400,marginBottom:6}}>
            {isBES
              ? <><span style={{color:"var(--gold)",fontStyle:"italic"}}>REACH™</span> Governance Readiness Profile (Self-Assessment)</>
              : inst.code==="LR"
                ? <><span style={{color:"var(--gold)",fontStyle:"italic"}}>REACH™</span> AI Leader Report (Self-Assessment)</>
                : <><span style={{color:"var(--gold)",fontStyle:"italic"}}>REACH™</span> AI Leader Report (360° Observer)</>
            }
          </h1>
          <div style={{fontSize:13,color:"var(--text-secondary)",marginTop:8,lineHeight:1.6}}>
            {isBES
              ? <>A structured view of your personal AI governance conduct against Singapore's regulatory expectations · <span style={{color:"#b8621a",fontWeight:600}}>For developmental use only</span></>
              : inst.code==="LR"
                ? <>A reflective view of your own AI leadership readiness across five capabilities · <span style={{color:"#b8621a",fontWeight:600}}>For developmental use only</span></>
                : <>A comparative view of AI leadership behaviours — how the leader sees themselves against how direct reports experience them · <span style={{color:"#b8621a",fontWeight:600}}>For facilitator use only</span></>
            }
          </div>
          <div style={{width:48,height:1,background:"linear-gradient(90deg,transparent,var(--gold),transparent)",margin:"12px auto 0"}}/>
        </div>
        {isSample&&(
          <div style={{background:"#fef6ee",border:"1px solid rgba(184,100,26,0.25)",borderRadius:"var(--radius-sm)",padding:"12px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:"var(--amber)",lineHeight:1.6}}>This is a sample report for demonstration purposes. Scores and interpretations are illustrative.</span>
            <button className="btn-ghost" style={{fontSize:11,padding:"6px 16px",flexShrink:0}} onClick={()=>setScreen("home")}>← Back to Home</button>
          </div>
        )}
        {isBES&&totalBand&&(
          <div className="total-score-card">
            <div className="total-score-num">{totalS}</div>
            <div className="total-score-detail">
              <div className="total-score-range">Total score · Range 40–160</div>
              <div className="total-score-band">{totalBand.band}</div>
              <div className="total-score-desc">{totalBand.desc}</div>
              <div className="total-bar"><div className="total-bar-fill" style={{width:`${((totalS-40)/120)*100}%`}}/></div>
            </div>
          </div>
        )}
        <div className="card" style={{textAlign:"center",marginBottom:24}}>
          <div className="radar-wrapper"><RadarChart selfData={scores.pct} size={300}/></div>
          {!isBES&&(
            <div style={{marginTop:20,textAlign:"left"}}>
              <div className="section-label" style={{marginBottom:12}}>Reading Your Profile</div>
              <p style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.85,marginBottom:12}}><strong style={{color:"var(--navy-900)"}}>Shape</strong> indicates your developmental pattern. <strong style={{color:"var(--navy-900)"}}>Scale</strong> reflects your overall readiness level. <strong style={{color:"var(--navy-900)"}}>Asymmetries</strong> are the most diagnostic feature — notice where the shape is uneven before your debrief.</p>
            </div>
          )}
        </div>
        {isBES&&flaggedAxes.length>0&&(
          <div className="card" style={{borderColor:"rgba(192,57,43,0.3)",background:"rgba(192,57,43,0.03)",marginBottom:24}}>
            <div className="section-label" style={{color:"var(--red-flag)",marginBottom:12}}>Items Requiring Immediate Attention</div>
            <p style={{fontSize:13,color:"var(--text-secondary)",marginBottom:16}}>The following dimensions contain items rated Aspirational:</p>
            {flaggedAxes.map(ax=>{
              const items=I3.q[ax].filter(q=>{const v=resp[q.id];if(v==null)return false;return q.rev?v>=3:v===1;}).map(q=>q.id);
              return (
                <div key={ax} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid rgba(192,57,43,0.12)"}}>
                  <div style={{fontSize:13,color:"var(--red-flag)",fontWeight:500,marginBottom:4}}>{ax} — {AXES[ax].name} <span style={{fontSize:11,color:"var(--text-subtle)",fontFamily:"'Courier New',monospace"}}>({items.join(", ")})</span></div>
                  <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.65}}>{FLAG_TEXT[ax]}</p>
                </div>
              );
            })}
          </div>
        )}
        <div className="axes-grid">
          {AXIS_ORDER.map(ax=>{
            const r=scores.raw[ax];
            const pct=r!=null?Math.round((r/axMax)*100):0;
            const band=getBand(ax);
            return (
              <div key={ax} className="axis-result-card" data-axis={ax}>
                <div className="axis-result-header"><div className="axis-result-name">{AXES[ax].name}</div></div>
                {isBES&&<div className="anchor-tag" style={{marginBottom:6}}>{DIM_ANCHOR[ax]}</div>}
                <div>
                  <div className="score-meta">
                    <span style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"var(--navy-700)",fontWeight:600}}>{r!=null?`${r} / ${axMax}`:"—"}</span>
                    <span style={{color:"var(--text-subtle)"}}>{pct}%</span>
                  </div>
                  <div className="score-bar"><div className="score-bar-fill" style={{width:`${pct}%`}}/></div>
                </div>
                <div style={{marginTop:10,marginBottom:12}}><span className={`maturity-badge ${bandClass[band]||""}`}>{band}</span></div>
                <p className="axis-interpretation">{descSet[ax]}</p>
              </div>
            );
          })}
        </div>
        {isBES&&(
          <div className="card" style={{marginTop:8}}>
            <div className="section-label" style={{marginBottom:12}}>Your Next Step</div>
            <p style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.85,marginBottom:20}}>This assessment is most reliable when validated through a 15-minute verification conversation with a direct report, peer, or BCG facilitator.</p>
            <div className="section-label" style={{marginBottom:12}}>Using This Profile</div>
            <ul style={{listStyle:"none",padding:0}}>
              {["Before commencing an AI deployment in a regulated product or service area.","As part of a board-level AI governance review — moving from structural compliance to individual accountability.","When preparing for a MAS supervisory review or internal audit of AI governance arrangements.","In conjunction with your REACH AI Leader profile, where this assessment contextualises capability gaps against specific regulatory obligations."].map((item,i)=>(
                <li key={i} style={{display:"flex",gap:12,marginBottom:12,fontSize:14,color:"var(--text-primary)",lineHeight:1.75}}>
                  <span style={{color:"var(--gold)",flexShrink:0}}>—</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!isBES&&inst.code==="LR"&&(
          <div className="card" style={{marginTop:8}}>
            <div className="section-label" style={{marginBottom:12}}>Before Your Debrief</div>
            {["Which dimension feels most accurate? Which surprised you most?","Where does your profile surprise you — and what does that surprise tell you?","Which asymmetry do you most want to understand before your debrief session?"].map((q,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:14,fontSize:14,color:"var(--text-primary)",lineHeight:1.75}}>
                <span style={{color:"var(--gold)",flexShrink:0}}>—</span><span>{q}</span>
              </div>
            ))}
          </div>
        )}
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:24,lineHeight:1.75,fontStyle:"italic",padding:"0 16px"}}>
          CONFIDENTIAL – INTERNAL USE ONLY. This is a prototype release utilising sample data; no personal identifiers or user responses are stored or retained. This site and its contents are not for publication or citation without prior authorisation.
        </p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:8,lineHeight:1.9,fontFamily:"'Courier New',monospace",letterSpacing:"0.04em"}}>
          REACH™ AI Leadership Diagnostic · v1.0-beta<br/>
          HUMAN Framework · SMU-XL / BCG BrightHouse<br/>
          © Kathleen Co (Singapore) · Last updated 26 March 2026<br/>
          Built with Claude AI (Anthropic)
        </p>
        <div style={{textAlign:"center",marginTop:24}}><button className="btn-ghost" onClick={()=>setScreen("home")}>← New Assessment</button></div>
      </div>
    </div>
  );
}

// ── Aggregate Report Screen ───────────────────────────────────────────────────
function AggregateReportScreen({onBack}) {
  const avg = getTeamAvg();
  const MAX = 32;

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={onBack}><span className="header-logo">REACH™</span><span className="header-sub">D3 — Team Governance Profile</span></div>
        <span className="header-session">FACILITATOR VIEW · SAMPLE REPORT</span>
      </div>
      <div className="container">

        {/* Report title block */}
        <div style={{textAlign:"center",padding:"32px 0 24px",borderBottom:"1px solid #dde3eb",marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:8}}>
            HUMAN Framework · Pillar H · Facilitator Report · Sample
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,4vw,40px)",color:"var(--navy-900)",fontWeight:400,marginBottom:6}}>
            <span style={{color:"var(--gold)",fontStyle:"italic"}}>REACH™</span> Governance Readiness Profile (Leadership Team)
          </h1>
          <div style={{fontSize:13,color:"var(--text-muted)",marginTop:8}}>A structured view of collective governance readiness across the C-suite leadership team · <span style={{color:"#b8621a",fontWeight:600}}>For facilitator use only</span></div>
          <div style={{width:48,height:1,background:"linear-gradient(90deg,transparent,var(--gold),transparent)",margin:"12px auto 0"}}/>
        </div>

        <div style={{background:"#fef6ee",border:"1px solid rgba(184,100,26,0.25)",borderRadius:"var(--radius-sm)",padding:"12px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:"var(--amber)",lineHeight:1.6}}>This is a sample report for demonstration purposes. Scores and interpretations are illustrative.</span>
        </div>
        {/* Header */}
        <div className="agg-card">
          <div className="agg-label">Facilitator Report · Aggregated · Anonymised</div>
          <div className="agg-title">C-Suite Governance Readiness Profile</div>
          <div className="agg-subtitle">
            A structured view of collective governance readiness across the C-suite leadership team · For facilitator use only
          </div>

          {/* Aggregate radar */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
            <AggRadarChart profiles={AGG_PROFILES} average={avg} size={320}/>
          </div>

          {/* Legend */}
          <div className="radar-legend" style={{marginBottom:32}}>
            {AGG_PROFILES.map((p,i)=>(
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{background:AGG_COLORS[i],opacity:0.8}}/>
                <span style={{color:"var(--text-muted)"}}>{p.label}</span>
              </div>
            ))}
            <div className="legend-item">
              <div className="legend-dot" style={{background:"#d4a835"}}/>
              <span style={{color:"#d4a835",fontWeight:500}}>Team Average</span>
            </div>
          </div>

          {/* Axis breakdown */}
          <div className="section-label" style={{color:"var(--gold)",marginBottom:20}}>Axis-by-Axis Team Profile</div>
          {AXIS_ORDER.map(ax=>{
            const teamScore = avg[ax];
            const pct = (teamScore/MAX)*100;
            return (
              <div key={ax} className="agg-axis-row">
                <div>
                  <div className="agg-axis-name">{ax}</div>
                  <div className="agg-axis-full">{AXES[ax].name}</div>
                  <div className={`agg-band-chip ${getAggBandClass(teamScore)}`} style={{marginTop:6}}>{getAggBandLabel(teamScore)}</div>
                </div>
                <div style={{position:"relative"}}>
                  <div className="agg-bar-track">
                    <div className="agg-bar-fill" style={{
                      width:`${pct}%`,
                      background: teamScore<=13?"linear-gradient(90deg,#7a2020,#c0392b)":
                                  teamScore<=19?"linear-gradient(90deg,#7a5000,#b8902a)":
                                  teamScore<=25?"linear-gradient(90deg,#1a3a6b,#2a5fa0)":
                                  "linear-gradient(90deg,#1a5c3a,#2a9a5a)"
                    }}/>
                    <div className="agg-dots-wrap">
                      {AGG_PROFILES.map((p,i)=>{
                        const dotPct = (p.scores[ax]/MAX)*100;
                        return (
                          <div key={i} className="agg-dot"
                            title={`${p.label}: ${p.scores[ax]}/${MAX}`}
                            style={{left:`${dotPct}%`,background:AGG_COLORS[i]}}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="agg-score-info">
                  <div className="agg-score-num">Avg {teamScore.toFixed(1)} / {MAX}</div>
                  <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2,fontFamily:"'Courier New',monospace"}}>
                    Range {Math.min(...AGG_PROFILES.map(p=>p.scores[ax]))}–{Math.max(...AGG_PROFILES.map(p=>p.scores[ax]))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Facilitator insights */}
        <div className="agg-card">
          <div className="section-label" style={{color:"var(--gold)",marginBottom:16}}>Facilitator Insights</div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:13,color:"#c0392b",fontWeight:500,marginBottom:8,letterSpacing:"0.06em"}}>FOCUS AREA — C · Cognitive Humility</div>
            <div className="insight-block critical">
              <p className="insight-text">
                <strong>C shows the widest spread across the team: scores range from 13 to 30.</strong> This is worth exploring carefully in debrief — one leader's profile suggests that governance approvals may currently outpace their substantive understanding of what is being approved. This is a common and workable development area, and the debrief conversation is precisely the right place to surface it.
              </p>
            </div>
            <div className="insight-block critical" style={{marginTop:8}}>
              <p className="insight-text">
                <strong>A useful opening question for the C debrief:</strong> "Can you walk me through a time when you changed a governance position you'd held with some confidence — what prompted that, and how did you communicate it?" The quality of the response will quickly indicate whether this is a blind spot or a gap in recent experience.
              </p>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:13,color:"#1a4f7a",fontWeight:500,marginBottom:8,letterSpacing:"0.06em"}}>DEVELOPMENT OPPORTUNITY — A · Agility in Learning</div>
            <div className="insight-block">
              <p className="insight-text">
                <strong>A range: {Math.min(...AGG_PROFILES.map(p=>p.scores.A))}–{Math.max(...AGG_PROFILES.map(p=>p.scores.A))}.</strong> One leader is actively updating their governance practice in response to a rapidly evolving regulatory landscape; the others have room to grow here. In a debrief, it is worth distinguishing between leaders who are genuinely unaware of developments and those who are aware but have not yet translated that awareness into changed practice — the development path is different for each.
              </p>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:13,color:"#1a5c3a",fontWeight:500,marginBottom:8,letterSpacing:"0.06em"}}>NOTABLE STRENGTH — H · Human-AI Relational Intelligence</div>
            <div className="insight-block teal-ins">
              <p className="insight-text">
                <strong>H is the team's strongest axis, with an average of {avg.H.toFixed(1)}.</strong> This is a genuine foundation to build from — the team has a meaningful shared commitment to preserving human judgement in AI processes. Worth naming this explicitly in debrief as a team strength before turning to development areas. Note that one leader scores lower on H; it is worth understanding whether their function carries direct AI deployment accountability, which would make this a more immediate priority.
              </p>
            </div>
          </div>

          <div>
            <div style={{fontSize:13,color:"var(--text-muted)",fontWeight:500,marginBottom:8,letterSpacing:"0.06em"}}>TEAM-LEVEL PATTERN</div>
            <div className="insight-block">
              <p className="insight-text">
                <strong>The overall team profile sits at Approaching Ready across most axes — a constructive starting point.</strong> The most useful debrief framing is not deficit-focused but directional: where does each leader want to be in twelve months, and what would have to change for them to get there? The C axis variance is the most productive place to begin that conversation, because it connects directly to the accountability questions that MAS supervisory interactions are most likely to surface.
              </p>
            </div>
          </div>
        </div>

        {/* Individual anonymised profiles */}
        <div className="agg-card">
          <div className="section-label" style={{color:"var(--gold)",marginBottom:8}}>Individual Profiles — Anonymised</div>
          <p style={{fontSize:13,color:"var(--text-secondary)",marginBottom:20,lineHeight:1.6}}>Not for distribution or performance evaluation purposes.</p>
          <div className="indiv-grid">
            {AGG_PROFILES.map((p,i)=>(
              <div key={i} className="indiv-card">
                <div className="indiv-anon" style={{color:AGG_COLORS[i]}}>{p.label}</div>
                {AXIS_ORDER.map(ax=>{
                  const sc=p.scores[ax];
                  const band=getAggBandLabel(sc);
                  const style=getIndivStyle(sc);
                  return (
                    <div key={ax} className="indiv-axis-row">
                      <span className="indiv-axis-name">{ax}</span>
                      <span className="indiv-axis-score">{sc}/{MAX}</span>
                      <span className="indiv-band" style={{background:style.bg,color:style.color}}>{band}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:24,lineHeight:1.75,fontStyle:"italic",padding:"0 16px"}}>
          CONFIDENTIAL – INTERNAL USE ONLY. This is a prototype release utilising sample data; no personal identifiers or user responses are stored or retained. This site and its contents are not for publication or citation without prior authorisation.
        </p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:8,lineHeight:1.9,fontFamily:"'Courier New',monospace",letterSpacing:"0.04em"}}>
          REACH™ AI Leadership Diagnostic · v1.0-beta<br/>
          HUMAN Framework · SMU-XL / BCG BrightHouse<br/>
          © Kathleen Co (Singapore) · Last updated 26 March 2026<br/>
          Built with Claude AI (Anthropic)
        </p>
        <div style={{textAlign:"center",marginTop:32}}>
          <button className="btn-ghost" style={{borderColor:"rgba(184,144,42,0.4)",color:"var(--gold)"}} onClick={onBack}>← Return to Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Facilitator screens ───────────────────────────────────────────────────────
function FacSelectScreen() {
  const {setScreen,startFac}=useContext(AppCtx);
  const [sel,setSel]=useState(null);
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);
  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">Facilitator Workspace</span></div>
        <div className="header-right"><span className="mode-badge facilitator">Facilitator Mode</span></div>
      </div>
      <div className="container">
        <div className="card teal-border">
          <div className="section-label teal" style={{marginBottom:8}}>Select Session</div>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:28,color:"var(--navy-900)",marginBottom:8,fontWeight:400}}>Completed D3 Sessions</h2>
          <p style={{fontSize:14,color:"var(--text-secondary)",marginBottom:28,lineHeight:1.7}}>Select a session to review self-reported responses and citation evidence, then enter Verified Scores.</p>
          <div className="fac-profile-grid">
            {MOCK_PROFILES.map(p=>(
              <div key={p.id} className={`fac-profile-card${sel===p.id?" selected":""}`} onClick={()=>setSel(p.id)}>
                <div className="fac-profile-name">{p.name}</div>
                <div className="fac-profile-role">{p.role}</div>
                <div className="fac-profile-meta" style={{marginTop:8}}>Completed: {p.completedAt}</div>
              </div>
            ))}
          </div>
          {sel&&(()=>{
            const p=MOCK_PROFILES.find(x=>x.id===sel);
            return (
              <div style={{background:"var(--teal-bg)",border:"1px solid var(--teal-border)",borderRadius:"var(--radius-sm)",padding:"20px 24px",marginBottom:24}}>
                <div className="fac-session-info">
                  <div className="fac-session-field"><div className="fac-session-field-label">Respondent</div><div className="fac-session-field-val">{p.name} · {p.role}</div></div>
                  <div className="fac-session-field"><div className="fac-session-field-label">Completed</div><div className="fac-session-field-val">{p.completedAt}</div></div>
                  <div className="fac-session-field"><div className="fac-session-field-label">Consent</div><div><span className="fac-consent-badge">{p.consent}</span></div></div>
                </div>
                <div style={{fontSize:13,color:"var(--text-muted)",fontStyle:"italic",lineHeight:1.6}}>{p.note}</div>
              </div>
            );
          })()}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16}}>
            <button className="btn-ghost" onClick={()=>setScreen("home")}>← Back</button>
            <button className="btn-primary teal" disabled={!sel} onClick={()=>startFac(MOCK_PROFILES.find(x=>x.id===sel))}>Begin Verification →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacEntryScreen() {
  const {facProfile,vScores,setVScores,obsNotes,setObsNotes,facAxIdx,setFacAxIdx,setFacScreen,setScreen}=useContext(AppCtx);
  const ax=AXIS_ORDER[facAxIdx];
  const qs=I3.q[ax];
  const allV=qs.every(q=>vScores[q.id]!=null);
  const isLast=facAxIdx===AXIS_ORDER.length-1;
  const prog=(Object.keys(vScores).length/40)*100;
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[facAxIdx]);

  const setV=(id,v)=>setVScores(p=>({...p,[id]:v}));
  const setObs=(a,v)=>setObsNotes(p=>({...p,[a]:v}));
  const getSelfVal=(a,id)=>{const r=facProfile.sResp[a];return r?r[id]:null;};
  const getGap=(id,a)=>{
    const s=getSelfVal(a,id),v=vScores[id];
    if(s==null||v==null)return null;
    const q=qs.find(q=>q.id===id);
    return (q.rev?5-s:s)-(q.rev?5-v:v);
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">Verification · {facProfile.name}</span></div>
        <div className="header-right"><span className="mode-badge facilitator">Facilitator Mode</span></div>
      </div>
      <div className="progress-strip"><div className="progress-fill teal" style={{width:`${prog}%`}}/></div>
      <div className="container">
        <div className="card teal-border">
          <div className="axis-header">
            <div className="axis-letter teal">{ax}</div>
            <div><div className="axis-title">{AXES[ax].name}</div><div className="axis-subtitle">{AXES[ax].sub}</div></div>
            <div className="axis-counter">{facAxIdx+1} / {AXIS_ORDER.length}</div>
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:20,padding:"10px 14px",background:"var(--teal-bg)",borderRadius:"var(--radius-sm)",border:"1px solid var(--teal-border)"}}>
            {[1,2,3,4].map((v,i)=>(
              <div key={v} style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:14,color:"var(--teal-light)",fontWeight:600}}>{v}</span>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>{BES_LABELS[i]}</span>
              </div>
            ))}
          </div>
          {qs.map(q=>{
            const sVal=getSelfVal(ax,q.id),vVal=vScores[q.id],gap=getGap(q.id,ax);
            const citation=facProfile.citations?.[q.id];
            const isFlagged=gap!=null&&Math.abs(gap)>=2;
            return (
              <div key={q.id} className={`fac-item-row${isFlagged?" flagged":""}`}>
                <div className="fac-item-header">
                  <div className="fac-item-id">{q.id}{q.rev?" ↺":""}</div>
                  <div className="fac-item-text">{q.text}</div>
                </div>
                {q.anchor&&<div className="anchor-tag" style={{marginBottom:10}}>⚖ {q.anchor}</div>}
                <div className="fac-scores-row">
                  <div className="fac-s-score"><span className="fac-score-label">S (Self)</span><span className="fac-score-val">{sVal??"—"}</span></div>
                  <div className="fac-s-score"><span className="fac-score-label">V (Verified)</span><span className="fac-score-val teal">{vVal??"—"}</span></div>
                  {gap!=null&&<span className={`fac-gap-chip ${Math.abs(gap)===0?"gap-ok":Math.abs(gap)===1?"gap-warn":"gap-flag"}`}>S−V = {gap>0?"+":""}{gap}</span>}
                  {isFlagged&&<span style={{fontSize:11,color:"var(--amber)"}}>⚠ Flag for debrief</span>}
                </div>
                {citation&&<div className="fac-citation"><div className="fac-citation-label">Citation Response</div>{citation}</div>}
                <div className="fac-bes-row">
                  {[1,2,3,4].map(v=>(
                    <button key={v} className={`fac-bes-btn${vVal===v?" selected":""}`} onClick={()=>setV(q.id,v)}>{v}</button>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="obs-note-wrap">
            <div className="obs-note-label">Axis Observation Note — {ax} · {AXES[ax].name}</div>
            <textarea className="obs-textarea" value={obsNotes[ax]||""} onChange={e=>{if(e.target.value.length<=300)setObs(ax,e.target.value);}} placeholder="Optional axis-level observation for debrief preparation…" maxLength={300}/>
            <div style={{fontSize:11,color:"var(--text-subtle)",marginTop:4,fontFamily:"'Courier New',monospace",textAlign:"right"}}>{(obsNotes[ax]||"").length} / 300</div>
          </div>
          <div className="nav-row">
            <div>{facAxIdx>0&&<button className="btn-ghost teal" onClick={()=>setFacAxIdx(v=>v-1)}>← Back</button>}</div>
            <div className="nav-dots">
              {AXIS_ORDER.map((a,i)=>{
                const done=I3.q[a].every(q=>vScores[q.id]!=null);
                return <div key={a} className={`nav-dot teal-dot${i===facAxIdx?" active":done?" done":""}`}/>;
              })}
            </div>
            <button className="btn-primary teal" disabled={!allV} onClick={()=>{if(isLast)setFacScreen("results");else setFacAxIdx(v=>v+1);}}>
              {isLast?"View Facilitator Results →":"Next →"}
            </button>
          </div>
          <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:20,lineHeight:1.7,fontStyle:"italic",padding:"0 8px"}}>
            CONFIDENTIAL – INTERNAL USE ONLY. Prototype release; no data is stored or retained.
          </p>
          <div style={{textAlign:"center",marginTop:12,paddingTop:16,borderTop:"1px solid #dde3eb"}}>
            <button className="btn-ghost" onClick={()=>setScreen("home")}>← Return to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacResultsScreen() {
  const {facProfile,vScores,obsNotes,setScreen,setFacScreen}=useContext(AppCtx);
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);

  const vRaw={},vPct={},sRaw={...facProfile.sScores},sPct={};
  AXIS_ORDER.forEach(ax=>{
    let vs=0;
    I3.q[ax].forEach(q=>{const v=vScores[q.id];if(v!=null)vs+=q.rev?5-v:v;});
    vRaw[ax]=vs; vPct[ax]=toRadar(vs,32); sPct[ax]=toRadar(sRaw[ax],32);
  });
  const totalV=AXIS_ORDER.reduce((s,ax)=>s+vRaw[ax],0);
  const totalS=AXIS_ORDER.reduce((s,ax)=>s+sRaw[ax],0);
  const totalVBand=getTotalGovBand(totalV);
  const totalSBand=getTotalGovBand(totalS);

  const acqFlags=[];
  AXIS_ORDER.forEach(ax=>{
    const revItems=I3.q[ax].filter(q=>q.rev);
    const stdItems=I3.q[ax].filter(q=>!q.rev);
    const highStd=stdItems.filter(q=>(facProfile.sResp[ax]?.[q.id]||0)>=3).length;
    const highRev=revItems.filter(q=>(facProfile.sResp[ax]?.[q.id]||0)>=3).length;
    if(highStd>=4&&highRev>=1)acqFlags.push(ax);
  });

  const weakFrameworks={};
  AXIS_ORDER.forEach(ax=>{
    I3.q[ax].forEach(q=>{
      const v=vScores[q.id];
      if(v==null)return;
      const scored=q.rev?5-v:v;
      if(scored<=2&&q.anchor){
        q.anchor.split("·").forEach(f=>{const k=f.trim();if(!weakFrameworks[k])weakFrameworks[k]=0;weakFrameworks[k]++;});
      }
    });
  });
  const topFrameworks=Object.entries(weakFrameworks).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const bandClass={"Significant Gap":"b-gap","Development Needed":"b-devneeded","Approaching Ready":"b-approaching","Ready to Act":"b-ready"};

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">Facilitator Results · {facProfile.name}</span></div>
        <div className="header-right"><span className="mode-badge facilitator">Facilitator Mode</span></div>
      </div>
      <div className="container">
        {/* Report title block */}
        <div style={{textAlign:"center",padding:"32px 0 24px",borderBottom:"1px solid rgba(58,155,138,0.2)",marginBottom:28}}>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:8}}>
            HUMAN Framework · Pillar H · Facilitator Report
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,4vw,40px)",color:"var(--navy-900)",fontWeight:400,marginBottom:6}}>
            <span style={{color:"var(--gold)",fontStyle:"italic"}}>REACH™</span> Governance Readiness Profile (Facilitator Validated)
          </h1>
          <div style={{fontSize:13,color:"var(--text-secondary)",marginTop:8,lineHeight:1.6}}>
            A comparative view of self-reported and verified governance conduct · Individual scores are not for distribution or performance evaluation · <span style={{color:"#b8621a",fontWeight:600}}>For facilitator use only</span>
          </div>

          <div style={{width:48,height:1,background:"linear-gradient(90deg,transparent,var(--teal-light),transparent)",margin:"12px auto 0"}}/>
        </div>
        <div style={{background:"#fef6ee",border:"1px solid rgba(184,100,26,0.25)",borderRadius:"var(--radius-sm)",padding:"12px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:13,color:"var(--amber)",lineHeight:1.6}}>This is a sample report for demonstration purposes. Scores and interpretations are illustrative.</span>
        </div>
        <div className="card teal-border" style={{marginBottom:16}}>
          <div className="fac-session-info">
            <div className="fac-session-field"><div className="fac-session-field-label">Respondent</div><div className="fac-session-field-val">{facProfile.name} · {facProfile.role}</div></div>
            <div className="fac-session-field"><div className="fac-session-field-label">Completed</div><div className="fac-session-field-val">{facProfile.completedAt}</div></div>
            <div className="fac-session-field"><div className="fac-session-field-label">Consent</div><div><span className="fac-consent-badge">{facProfile.consent}</span></div></div>
          </div>
        </div>
        {acqFlags.length>0&&(
          <div className="acq-flag">
            <strong>Acquiescence Signal Detected</strong> — {acqFlags.join(", ")} axis{acqFlags.length>1?"es":""}: respondent rates consistently high on both standard and reverse items. Raise directly in debrief: <em>"You rated yourself highly on [{acqFlags[0]} standard item] — but also agreed with [{acqFlags[0]} reverse item]. What do you make of that?"</em>
          </div>
        )}
        <div className="card teal-border" style={{textAlign:"center",marginTop:16}}>
          <div className="section-label teal" style={{marginBottom:16}}>Profile Comparison</div>
          <div className="radar-wrapper"><RadarChart selfData={sPct} verifiedData={vPct} size={320}/></div>
          <div className="radar-legend">
            <div className="legend-item"><div className="legend-dot" style={{background:"#1a4d91"}}/> Self-Reported (S)</div>
            <div className="legend-item"><div className="legend-dot" style={{background:"#c47a1e"}}/> Verified (V)</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}>
          {[{label:"Self-Reported Total",score:totalS,band:totalSBand,col:"var(--navy-800)"},{label:"Verified Total",score:totalV,band:totalVBand,col:"var(--verified)"}].map(({label,score,band,col})=>(
            <div key={label} style={{background:"var(--card-bg-alt)",border:"1px solid #dde3eb",borderRadius:"var(--radius)",padding:"20px 24px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--text-subtle)",marginBottom:8}}>{label}</div>
              <div style={{fontFamily:"var(--font-display)",fontSize:48,color:col,lineHeight:1}}>{score}</div>
              <div style={{marginTop:8}}><span className={`maturity-badge ${bandClass[band.band]||""}`}>{band.band}</span></div>
            </div>
          ))}
        </div>
        <div className="card teal-border" style={{marginTop:16}}>
          <div className="section-label teal" style={{marginBottom:12}}>Per-Axis Gap Analysis</div>
          <table className="gap-table">
            <thead><tr><th>Axis</th><th>S Score</th><th>S Band</th><th>V Score</th><th>V Band</th><th>Gap (S−V)</th></tr></thead>
            <tbody>
              {AXIS_ORDER.map(ax=>{
                const s=sRaw[ax],v=vRaw[ax],gap=s-v;
                const sBand=getGovBand(s),vBand=getGovBand(v);
                return (
                  <tr key={ax}>
                    <td><strong style={{color:"var(--gold)"}}>{ax}</strong> <span style={{fontSize:11,color:"var(--text-subtle)"}}>{AXES[ax].name}</span></td>
                    <td style={{fontFamily:"'Courier New',monospace",color:"var(--navy-800)",fontWeight:600}}>{s}</td>
                    <td><span className={`maturity-badge ${bandClass[sBand]}`} style={{fontSize:9}}>{sBand}</span></td>
                    <td style={{fontFamily:"'Courier New',monospace",color:"var(--verified)",fontWeight:600}}>{v}</td>
                    <td><span className={`maturity-badge ${bandClass[vBand]}`} style={{fontSize:9}}>{vBand}</span></td>
                    <td><span className={`fac-gap-chip ${gap===0?"gap-ok":gap<=2?"gap-warn":"gap-flag"}`}>{gap>0?"+":""}{gap}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {topFrameworks.length>0&&(
          <div className="card teal-border" style={{marginTop:16}}>
            <div className="section-label teal" style={{marginBottom:8}}>Framework Clustering — Weakest Items</div>
            <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:12,lineHeight:1.6}}>Frameworks appearing most frequently in items with Verified Score ≤ 2.</p>
            <div className="framework-cluster">
              {topFrameworks.map(([f,count])=>(
                <div key={f} className="framework-chip">{f} <span style={{opacity:0.6}}>×{count}</span></div>
              ))}
            </div>
          </div>
        )}
        {AXIS_ORDER.some(ax=>obsNotes[ax])&&(
          <div className="card teal-border" style={{marginTop:16}}>
            <div className="section-label teal" style={{marginBottom:12}}>Axis Observation Notes</div>
            {AXIS_ORDER.filter(ax=>obsNotes[ax]).map(ax=>(
              <div key={ax} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(58,155,138,0.1)"}}>
                <div style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--teal-muted)",marginBottom:6}}>{ax} — {AXES[ax].name}</div>
                <p style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.65,fontStyle:"italic"}}>{obsNotes[ax]}</p>
              </div>
            ))}
          </div>
        )}
        <div className="card teal-border" style={{marginTop:16}}>
          <div className="section-label teal" style={{marginBottom:12}}>Suggested Debrief Opening</div>
          <ul style={{listStyle:"none",padding:0}}>
            {[
              "Before we look at the profile, what was the AI governance context you had most in mind as you completed this?",
              "Which axis did you find most difficult to rate honestly — not most difficult to score, but most difficult to answer candidly?",
              "What do you make of this shape?",
              acqFlags.length>0?`You rated yourself consistently high across the board — including on the reverse items. Walk me through your thinking on ${acqFlags[0]}.`:null,
              topFrameworks.length>0?`The weakest items cluster around ${topFrameworks[0][0]}. What is your current line of sight into that obligation?`:null,
            ].filter(Boolean).map((q,i)=>(
              <li key={i} style={{display:"flex",gap:12,marginBottom:12,fontSize:14,color:"var(--text-primary)",lineHeight:1.75}}>
                <span style={{color:"var(--teal-light)",flexShrink:0}}>—</span><span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:24,lineHeight:1.75,fontStyle:"italic",padding:"0 16px"}}>
          CONFIDENTIAL – INTERNAL USE ONLY. This is a prototype release utilising sample data; no personal identifiers or user responses are stored or retained. This site and its contents are not for publication or citation without prior authorisation.
        </p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:8,lineHeight:1.9,fontFamily:"'Courier New',monospace",letterSpacing:"0.04em"}}>
          REACH™ AI Leadership Diagnostic · v1.0-beta<br/>
          HUMAN Framework · SMU-XL / BCG BrightHouse<br/>
          © Kathleen Co (Singapore) · Last updated 26 March 2026<br/>
          Built with Claude AI (Anthropic)
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:24}}>
          <button className="btn-ghost teal" onClick={()=>setFacScreen("entry")}>← Revise Scores</button>
          <button className="btn-ghost" onClick={()=>setScreen("home")}>← Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Home screen ───────────────────────────────────────────────────────────────
function HomeScreen({onViewAggregate}) {
  const {start,mode,setMode,setScreen,setFacScreen,startSampleReport,startFacSampleReport}=useContext(AppCtx);
  const [sel,setSel]=useState(null);
  const insts=[I1,I2,I3];
  const nums=["Instrument 1 of 3","Instrument 2 of 3","Instrument 3 of 3"];
  const sampleData=[
    {scores:SAMPLE_D1_SCORES,resp:SAMPLE_D1_RESP},
    {scores:SAMPLE_D2_SCORES,resp:SAMPLE_D2_RESP},
    {scores:SAMPLE_D3_SCORES,resp:SAMPLE_D3_RESP},
  ];

  return (
    <div className="app">
      <div className="header">
        <div className="header-brand"><span className="header-logo">REACH™</span><span className="header-sub">AI Leadership Diagnostic</span></div>
        <div className="header-right"><span className={`mode-badge ${mode}`}>{mode==="respondent"?"Respondent Mode":"Facilitator Mode"}</span></div>
      </div>
      <div className="container">
        <div className="home-hero">
          <div className="home-subtitle">HUMAN Framework · Diagnostic Toolkit</div>
          <h1 className="home-title">The <span>REACH<sup>™</sup></span> Assessment</h1>
          <div className="home-divider"/>
          <p className="home-description">Five capabilities foundational to leading AI transformation: Reflective Sense-Making, Emotional Regulation under Ambiguity, Agility in Learning, Cognitive Humility, and Human-AI Relational Intelligence.</p>
        </div>
        <div className="mode-toggle">
          <button className={`mode-toggle-btn${mode==="respondent"?" active-resp":""}`} onClick={()=>{setMode("respondent");setSel(null);}}>Respondent</button>
          <button className={`mode-toggle-btn${mode==="facilitator"?" active-fac":""}`} onClick={()=>{setMode("facilitator");setSel(null);}}>Facilitator</button>
        </div>

        {mode==="respondent"&&(
          <>
            <div className="instruments-grid">
              {insts.map((inst,i)=>(
                <div key={inst.code} style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div className={`instrument-card${sel===i?" selected":""}`} onClick={()=>setSel(i)} style={{flex:1}}>
                    <div className="instrument-number">{nums[i]}</div>
                    <div className="instrument-name">{inst.title}</div>
                    <div className="instrument-meta">{inst.subtitle}</div>
                    <div className="instrument-duration" style={{marginTop:"auto",paddingTop:12}}>⏱ {inst.duration}</div>
                  </div>
                  <button
                    onClick={e=>{e.stopPropagation();startSampleReport(inst,sampleData[i].scores,sampleData[i].resp);}}
                    className="btn-sample-gold btn-sample-sm"
                  >
                    ◎ View Sample Report
                  </button>
                </div>
              ))}
            </div>
            {sel!=null&&(
              <div className="card">
                <div className="section-label">Assessment Objective</div>
                <div className="objective-block">{insts[sel].objective}</div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>
                  <button className="btn-primary" onClick={()=>start(insts[sel])}>Begin Assessment →</button>
                </div>
              </div>
            )}
          </>
        )}

        {mode==="facilitator"&&(
          <div className="card teal-border">
            <div className="section-label teal" style={{marginBottom:8}}>Facilitator Workspace</div>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:26,color:"var(--navy-900)",marginBottom:12,fontWeight:400}}>D3 Verification Sessions</h2>
            <p style={{fontSize:14,color:"var(--text-secondary)",lineHeight:1.75,marginBottom:24}}>Access completed D3 Governance Readiness sessions to enter Verified Scores, record axis-level observation notes, and generate the gap profile for debrief preparation.</p>
            <div className="fac-profile-grid">
              {MOCK_PROFILES.map(p=>(
                <div key={p.id} className="fac-profile-card" onClick={()=>{setFacScreen("select");setScreen("facilitator");}}>
                  <div className="fac-profile-name">{p.name}</div>
                  <div className="fac-profile-role">{p.role}</div>
                  <div className="fac-profile-meta" style={{marginTop:6}}>Completed: {p.completedAt}</div>
                </div>
              ))}
            </div>
            {/* Sample report buttons — centerd row */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginTop:20,paddingTop:16,borderTop:"1px solid rgba(58,155,138,0.15)",flexWrap:"wrap"}}>
              <button
                onClick={()=>startFacSampleReport(MOCK_PROFILES[0],SAMPLE_FAC_VSCORES,SAMPLE_FAC_OBS)}
                className="btn-sample-gold"
              >
                ◎ View Sample Facilitator Report
              </button>
              <button
                onClick={onViewAggregate}
                className="btn-sample-gold"
              >
                ◎ View Sample Team Governance Profile
              </button>
            </div>
            {/* Open Workspace CTA — below, aligned right */}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:16,paddingTop:16,borderTop:"1px solid #dde3eb"}}>
              <button className="btn-primary teal" onClick={()=>{setFacScreen("select");setScreen("facilitator");}}>
                Open Workspace →
              </button>
            </div>
          </div>
        )}

        <p className="disclaimer" style={{marginTop:48}}>
          CONFIDENTIAL – INTERNAL USE ONLY. This is a prototype release utilising sample data; no personal identifiers or user responses are stored or retained. This site and its contents are not for publication or citation without prior authorisation.
        </p>
        <p style={{fontSize:11,color:"var(--text-subtle)",textAlign:"center",marginTop:12,lineHeight:1.8,fontFamily:"'Courier New',monospace",letterSpacing:"0.04em"}}>
          REACH™ AI Leadership Diagnostic · v1.0-beta<br/>
          HUMAN Framework · SMU-XL / BCG BrightHouse<br/>
          © Kathleen Co (Singapore) · Last updated 26 March 2026<br/>
          Built with Claude AI (Anthropic)
        </p>
      </div>
    </div>
  );
}

// ── Leader input for D2 ───────────────────────────────────────────────────────
function LeaderInputScreen() {
  const {inst,session,leaderName,setLeaderName,startSurvey,setScreen}=useContext(AppCtx);
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);
  return (
    <div className="app">
      <div className="header">
        <div className="header-brand" onClick={()=>setScreen("home")}><span className="header-logo">REACH™</span><span className="header-sub">{inst?.subtitle}</span></div>
        {session&&<span className="header-session">{session.id}</span>}
      </div>
      <div className="progress-strip"><div className="progress-fill" style={{width:"0%"}}/></div>
      <div className="container">
        <div className="card">
          <div className="section-label" style={{marginBottom:8}}>Before You Begin</div>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:28,color:"var(--navy-900)",marginBottom:24,fontWeight:400}}>360° Observer Assessment</h2>
          <p style={{fontSize:15,color:"var(--text-secondary)",lineHeight:1.8,marginBottom:32}}>Please enter the name of the leader you are assessing. Your individual responses will not be shared — they will be consolidated and anonymised by a facilitator before any findings are reviewed.</p>
          <div style={{marginBottom:32}}>
            <label style={{display:"block",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--gold)",marginBottom:10}}>Leader's Name</label>
            <input type="text" value={leaderName} maxLength={30} onChange={e=>setLeaderName(e.target.value)} placeholder="Enter leader's full name"
              style={{width:"100%",maxWidth:400,background:"var(--white)",border:"1px solid #c8d0db",borderRadius:"var(--radius-sm)",color:"var(--text-primary)",fontFamily:"var(--font-body)",fontSize:14,padding:"12px 14px",outline:"none",transition:"var(--transition)"}}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="#c8d0db"}
            />
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,paddingTop:24,borderTop:"1px solid #dde3eb"}}>
            <button className="btn-ghost" onClick={()=>setScreen("home")}>← Back</button>
            <button className="btn-primary" disabled={!leaderName.trim()} onClick={startSurvey}>Begin Assessment →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
function Router() {
  const {screen,facScreen}=useContext(AppCtx);
  const [showAggregate, setShowAggregate] = useState(false);

  if(showAggregate) return <AggregateReportScreen onBack={()=>setShowAggregate(false)}/>;
  if(screen==="leader-input")return<LeaderInputScreen/>;
  if(screen==="survey")return<SurveyScreen/>;
  if(screen==="results")return<ResultsScreen/>;
  if(screen==="facilitator"){
    if(facScreen==="select")return<FacSelectScreen/>;
    if(facScreen==="entry")return<FacEntryScreen/>;
    if(facScreen==="results")return<FacResultsScreen/>;
  }
  return<HomeScreen onViewAggregate={()=>setShowAggregate(true)}/>;
}

export default function App(){
  return<AppProvider><Router/></AppProvider>;
}