import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './index.css';

function App() {
  return (
    <div className="app-shell">
      {/* ── Top chrome ── */}
      <header className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-mark">V</div>
          <span className="topbar-logo-name">
            Vector<span>Shift</span>
          </span>
        </div>
        <div className="topbar-divider" />
        <span className="topbar-chip">pipeline editor</span>
      </header>

      {/* ── Body ── */}
      <div className="app-body">
        <PipelineToolbar />
        <div className="canvas-column">
          <PipelineUI />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default App;