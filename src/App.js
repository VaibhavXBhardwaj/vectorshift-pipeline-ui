import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PipelineToolbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PipelineUI />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default App;