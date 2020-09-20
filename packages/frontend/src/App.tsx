import React, { useEffect, useState } from 'react';

import { Communication } from './background/communication';
import { MSG, StatusPayload } from './background/types';
import { AuthenticationHandler } from './services/Auth/AuthenticationHandler';

const onChangeInput = () => {
  const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
  Communication.sendMessage(MSG.ONOFF, { status: val });
};

function App() {
  const [userId, setUserId] = useState<string | undefined>();
  useEffect(() => {
    AuthenticationHandler.authenticate(setUserId);
    Communication.addListener(MSG.ONOFF, (data: StatusPayload) => {
      (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {userId && (
          <>
            <div>{userId}</div>
            <br />
          </>
        )}
        <label>An/Aus encryption</label>
        <input id="onoffStatus" onClick={onChangeInput} value="" type="checkbox" />
      </header>
    </div>
  );
}

export default App;
