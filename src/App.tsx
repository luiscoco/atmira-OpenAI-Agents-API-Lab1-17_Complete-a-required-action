import { useEffect, useState } from 'react';
import Lab1 from './Lab1.tsx';
import Lab2 from './Lab2.tsx';
import Lab3 from './Lab3.tsx';
import Lab4 from './Lab4.tsx';
import Lab5 from './Lab5.tsx';
import Lab6 from './Lab6.tsx';
import Lab7 from './Lab7.tsx';
import Lab8 from './Lab8.tsx';
import Lab9 from './Lab9.tsx';
import Lab10 from './Lab10.tsx';
import Lab11 from './Lab11.tsx';
import Lab12 from './Lab12.tsx';
import Lab13 from './Lab13.tsx';
import Lab14 from './Lab14.tsx';
import Lab15 from './Lab15.tsx';
import Lab16 from './Lab16.tsx';
import Lab17 from './Lab17.tsx';
import openaiIcon from './assets/openai.svg';

function SidebarChevron({ open }: { open: boolean }) {
  return <svg className={'sidebar-chevron' + (open ? ' open' : '')} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 7 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const labIds = Array.from({ length: 17 }, (_, index) => `lab${index + 1}`);
// The open lab is kept in the URL hash, so a reload returns to it (Lab 13 relies on this).
const initialLab = () => (typeof window !== 'undefined' && labIds.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'lab1');

export default function App() {
  const [activeLab, setActiveLab] = useState(initialLab);
  const [lab2Feature, setLab2Feature] = useState('conversation');
  const [foundationsOpen, setFoundationsOpen] = useState(true);
  const [typescriptOpen, setTypescriptOpen] = useState(true);
  const [streamingOpen, setStreamingOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [lab2Open, setLab2Open] = useState(true);
  const [health, setHealth] = useState(null);

  useEffect(() => { window.history.replaceState(null, '', `#${activeLab}`); }, [activeLab]);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth({ configured: false, model: 'unknown' }));
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><img src={openaiIcon} alt="" /></span><span className="brand-copy">OpenAI Agents API Labs<small>THE LEARNING SERIES</small></span></div>
        <button type="button" className="sidebar-section-toggle" aria-expanded={foundationsOpen} aria-controls="foundations-menu" onClick={() => setFoundationsOpen((open) => !open)}><span>FOUNDATIONS</span><SidebarChevron open={foundationsOpen} /></button>
        {foundationsOpen ? <nav id="foundations-menu" className="sidebar-menu" aria-label="Foundation labs">
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab1' ? ' selected' : '')} aria-current={activeLab === 'lab1' ? 'page' : undefined} onClick={() => setActiveLab('lab1')}><span className="nav-number">01</span><span className="sidebar-item-copy"><strong>Create your first agent</strong><small>Agent · Session · Run</small></span></button>
          <div className={'sidebar-lab-group' + (activeLab === 'lab2' ? ' selected' : '')}>
            <button type="button" className="sidebar-lab sidebar-lab-parent" onClick={() => { setActiveLab('lab2'); setLab2Open(true); }}><span className="nav-number">02</span><span className="sidebar-item-copy"><strong>Continue &amp; customize</strong><small>Conversation · Instructions</small></span></button>
            <button type="button" className="sidebar-subtoggle" aria-label={lab2Open ? 'Collapse Lab 02 lessons' : 'Expand Lab 02 lessons'} aria-expanded={lab2Open} aria-controls="lab2-lessons" onClick={() => setLab2Open((open) => !open)}><SidebarChevron open={lab2Open} /></button>
            {lab2Open ? <div id="lab2-lessons" className="sidebar-lessons">
              <button type="button" className={'sidebar-lesson' + (activeLab === 'lab2' && lab2Feature === 'conversation' ? ' selected' : '')} aria-current={activeLab === 'lab2' && lab2Feature === 'conversation' ? 'page' : undefined} onClick={() => { setActiveLab('lab2'); setLab2Feature('conversation'); }}><span className="nav-number">1</span><span className="sidebar-item-copy"><strong>Continue a conversation</strong><small>LESSON 1</small></span></button>
              <button type="button" className={'sidebar-lesson' + (activeLab === 'lab2' && lab2Feature === 'instructions' ? ' selected' : '')} aria-current={activeLab === 'lab2' && lab2Feature === 'instructions' ? 'page' : undefined} onClick={() => { setActiveLab('lab2'); setLab2Feature('instructions'); }}><span className="nav-number">2</span><span className="sidebar-item-copy"><strong>Customize instructions</strong><small>LESSON 2</small></span></button>
            </div> : null}
          </div>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab3' ? ' selected' : '')} aria-current={activeLab === 'lab3' ? 'page' : undefined} onClick={() => setActiveLab('lab3')}><span className="nav-number">03</span><span className="sidebar-item-copy"><strong>Inspect the lifecycle</strong><small>Event inspector</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab4' ? ' selected' : '')} aria-current={activeLab === 'lab4' ? 'page' : undefined} onClick={() => setActiveLab('lab4')}><span className="nav-number">04</span><span className="sidebar-item-copy"><strong>Handle interrupted work</strong><small>Recovery</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab5' ? ' selected' : '')} aria-current={activeLab === 'lab5' ? 'page' : undefined} onClick={() => setActiveLab('lab5')}><span className="nav-number">05</span><span className="sidebar-item-copy"><strong>Manage sessions</strong><small>History</small></span></button>
        </nav> : null}
        <button type="button" className="sidebar-section-toggle sidebar-stage-toggle" aria-expanded={typescriptOpen} aria-controls="typescript-menu" onClick={() => setTypescriptOpen((open) => !open)}><span>TYPESCRIPT &amp; CONFIGURATION</span><SidebarChevron open={typescriptOpen} /></button>
        {typescriptOpen ? <nav id="typescript-menu" className="sidebar-menu" aria-label="TypeScript and configuration labs">
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab6' ? ' selected' : '')} aria-current={activeLab === 'lab6' ? 'page' : undefined} onClick={() => setActiveLab('lab6')}><span className="nav-number">06</span><span className="sidebar-item-copy"><strong>Move to TypeScript</strong><small>Typed events</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab7' ? ' selected' : '')} aria-current={activeLab === 'lab7' ? 'page' : undefined} onClick={() => setActiveLab('lab7')}><span className="nav-number">07</span><span className="sidebar-item-copy"><strong>Save and reuse an agent</strong><small>Named tutor preset</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab8' ? ' selected' : '')} aria-current={activeLab === 'lab8' ? 'page' : undefined} onClick={() => setActiveLab('lab8')}><span className="nav-number">08</span><span className="sidebar-item-copy"><strong>Override one session</strong><small>Session instructions</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab9' ? ' selected' : '')} aria-current={activeLab === 'lab9' ? 'page' : undefined} onClick={() => setActiveLab('lab9')}><span className="nav-number">09</span><span className="sidebar-item-copy"><strong>Compare models &amp; reasoning</strong><small>Quality · Latency</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab10' ? ' selected' : '')} aria-current={activeLab === 'lab10' ? 'page' : undefined} onClick={() => setActiveLab('lab10')}><span className="nav-number">10</span><span className="sidebar-item-copy"><strong>Design an output contract</strong><small>Validate · Repair</small></span></button>
        </nav> : null}
        <button type="button" className="sidebar-section-toggle sidebar-stage-toggle" aria-expanded={streamingOpen} aria-controls="streaming-menu" onClick={() => setStreamingOpen((open) => !open)}><span>STREAMING &amp; REACT</span><SidebarChevron open={streamingOpen} /></button>
        {streamingOpen ? <nav id="streaming-menu" className="sidebar-menu" aria-label="Streaming and React labs">
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab11' ? ' selected' : '')} aria-current={activeLab === 'lab11' ? 'page' : undefined} onClick={() => setActiveLab('lab11')}><span className="nav-number">11</span><span className="sidebar-item-copy"><strong>Render text events</strong><small>Deltas · Done parts</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab12' ? ' selected' : '')} aria-current={activeLab === 'lab12' ? 'page' : undefined} onClick={() => setActiveLab('lab12')}><span className="nav-number">12</span><span className="sidebar-item-copy"><strong>Build a turn timeline</strong><small>Events · Turns · Order</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab13' ? ' selected' : '')} aria-current={activeLab === 'lab13' ? 'page' : undefined} onClick={() => setActiveLab('lab13')}><span className="nav-number">13</span><span className="sidebar-item-copy"><strong>Recover after a disconnect</strong><small>Reattach · Saved items</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab14' ? ' selected' : '')} aria-current={activeLab === 'lab14' ? 'page' : undefined} onClick={() => setActiveLab('lab14')}><span className="nav-number">14</span><span className="sidebar-item-copy"><strong>Cancel and steer a turn</strong><small>Cancel · Steer · Outcome</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab15' ? ' selected' : '')} aria-current={activeLab === 'lab15' ? 'page' : undefined} onClick={() => setActiveLab('lab15')}><span className="nav-number">15</span><span className="sidebar-item-copy"><strong>Show usage and duration</strong><small>Tokens · Time · Errors</small></span></button>
        </nav> : null}
        <button type="button" className="sidebar-section-toggle sidebar-stage-toggle" aria-expanded={toolsOpen} aria-controls="tools-menu" onClick={() => setToolsOpen((open) => !open)}><span>FUNCTION TOOLS &amp; HUMAN CONTROL</span><SidebarChevron open={toolsOpen} /></button>
        {toolsOpen ? <nav id="tools-menu" className="sidebar-menu" aria-label="Function tools and human control labs">
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab16' ? ' selected' : '')} aria-current={activeLab === 'lab16' ? 'page' : undefined} onClick={() => setActiveLab('lab16')}><span className="nav-number">16</span><span className="sidebar-item-copy"><strong>Declare a function tool</strong><small>Name · Description · Schema</small></span></button>
          <button type="button" className={'sidebar-lab' + (activeLab === 'lab17' ? ' selected' : '')} aria-current={activeLab === 'lab17' ? 'page' : undefined} onClick={() => setActiveLab('lab17')}><span className="nav-number">17</span><span className="sidebar-item-copy"><strong>Complete a required action</strong><small>Pause · Run · Tool result</small></span></button>
        </nav> : null}
        <div className="sidebar-bottom"><span className="mini-orb">◆</span><div><strong>50 hands-on labs</strong><small>From first run to advanced agents</small></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><span>COURSE / {['lab16', 'lab17'].includes(activeLab) ? 'FUNCTION TOOLS & HUMAN CONTROL' : ['lab11', 'lab12', 'lab13', 'lab14', 'lab15'].includes(activeLab) ? 'STREAMING & REACT' : ['lab6', 'lab7', 'lab8', 'lab9', 'lab10'].includes(activeLab) ? 'TYPESCRIPT & CONFIGURATION' : 'FOUNDATIONS'} / <b>LAB {activeLab.slice(3).padStart(2, '0')}</b></span><span className="top-right"><span className="status-dot" /> INTERACTIVE LAB</span></header>
        <nav className="mobile-lab-nav" aria-label="Choose a lab"><button type="button" aria-current={activeLab === 'lab1' ? 'page' : undefined} onClick={() => setActiveLab('lab1')}>Lab 01</button><button type="button" aria-current={activeLab === 'lab2' ? 'page' : undefined} onClick={() => setActiveLab('lab2')}>Lab 02</button><button type="button" aria-current={activeLab === 'lab3' ? 'page' : undefined} onClick={() => setActiveLab('lab3')}>Lab 03</button><button type="button" aria-current={activeLab === 'lab4' ? 'page' : undefined} onClick={() => setActiveLab('lab4')}>Lab 04</button><button type="button" aria-current={activeLab === 'lab5' ? 'page' : undefined} onClick={() => setActiveLab('lab5')}>Lab 05</button><button type="button" aria-current={activeLab === 'lab6' ? 'page' : undefined} onClick={() => setActiveLab('lab6')}>Lab 06</button><button type="button" aria-current={activeLab === 'lab7' ? 'page' : undefined} onClick={() => setActiveLab('lab7')}>Lab 07</button><button type="button" aria-current={activeLab === 'lab8' ? 'page' : undefined} onClick={() => setActiveLab('lab8')}>Lab 08</button><button type="button" aria-current={activeLab === 'lab9' ? 'page' : undefined} onClick={() => setActiveLab('lab9')}>Lab 09</button><button type="button" aria-current={activeLab === 'lab10' ? 'page' : undefined} onClick={() => setActiveLab('lab10')}>Lab 10</button><button type="button" aria-current={activeLab === 'lab11' ? 'page' : undefined} onClick={() => setActiveLab('lab11')}>Lab 11</button><button type="button" aria-current={activeLab === 'lab12' ? 'page' : undefined} onClick={() => setActiveLab('lab12')}>Lab 12</button><button type="button" aria-current={activeLab === 'lab13' ? 'page' : undefined} onClick={() => setActiveLab('lab13')}>Lab 13</button><button type="button" aria-current={activeLab === 'lab14' ? 'page' : undefined} onClick={() => setActiveLab('lab14')}>Lab 14</button><button type="button" aria-current={activeLab === 'lab15' ? 'page' : undefined} onClick={() => setActiveLab('lab15')}>Lab 15</button><button type="button" aria-current={activeLab === 'lab16' ? 'page' : undefined} onClick={() => setActiveLab('lab16')}>Lab 16</button><button type="button" aria-current={activeLab === 'lab17' ? 'page' : undefined} onClick={() => setActiveLab('lab17')}>Lab 17</button></nav>
        <div className="content" style={{ display: activeLab === 'lab1' ? undefined : 'none' }}><Lab1 active={activeLab === 'lab1'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab2' ? undefined : 'none' }}><Lab2 active={activeLab === 'lab2'} feature={lab2Feature} onFeatureChange={setLab2Feature} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab3' ? undefined : 'none' }}><Lab3 active={activeLab === 'lab3'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab4' ? undefined : 'none' }}><Lab4 active={activeLab === 'lab4'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab5' ? undefined : 'none' }}><Lab5 active={activeLab === 'lab5'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab6' ? undefined : 'none' }}><Lab6 active={activeLab === 'lab6'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab7' ? undefined : 'none' }}><Lab7 active={activeLab === 'lab7'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab8' ? undefined : 'none' }}><Lab8 active={activeLab === 'lab8'} health={health} onOpenLab7={() => setActiveLab('lab7')} /></div>
        <div className="content" style={{ display: activeLab === 'lab9' ? undefined : 'none' }}><Lab9 active={activeLab === 'lab9'} health={health} onOpenLab7={() => setActiveLab('lab7')} /></div>
        <div className="content" style={{ display: activeLab === 'lab10' ? undefined : 'none' }}><Lab10 active={activeLab === 'lab10'} health={health} onOpenLab7={() => setActiveLab('lab7')} /></div>
        <div className="content" style={{ display: activeLab === 'lab11' ? undefined : 'none' }}><Lab11 active={activeLab === 'lab11'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab12' ? undefined : 'none' }}><Lab12 active={activeLab === 'lab12'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab13' ? undefined : 'none' }}><Lab13 active={activeLab === 'lab13'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab14' ? undefined : 'none' }}><Lab14 active={activeLab === 'lab14'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab15' ? undefined : 'none' }}><Lab15 active={activeLab === 'lab15'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab16' ? undefined : 'none' }}><Lab16 active={activeLab === 'lab16'} health={health} /></div>
        <div className="content" style={{ display: activeLab === 'lab17' ? undefined : 'none' }}><Lab17 active={activeLab === 'lab17'} health={health} /></div>
      </main>
    </div>
  );
}

