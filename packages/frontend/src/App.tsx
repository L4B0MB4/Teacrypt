import React, { useEffect } from 'react';

import { Communication } from './background/communication';
import { MSG, StatusPayload } from './background/types';

const onChangeInput = () => {
  const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
  Communication.sendMessage(MSG.ONOFF, { status: val });
};

function App() {
  useEffect(() => {
    Communication.addListener(MSG.ONOFF, (data: StatusPayload) => {
      (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <label>An/Aus encryption</label>
        <input onClick={onChangeInput} value="" type="checkbox" />
      </header>
    </div>
  );
}

export default App;
