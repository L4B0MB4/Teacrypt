import { ComHelp } from '@teacrypt/common';
import React, { useEffect, useState } from 'react';

import { Communication } from './background/communication';
import { AuthenticationHandler } from './services/Auth/AuthenticationHandler';
import { KeyEchangeHandler } from './services/KeyExchange/KeyExchangeHandler';

const onChangeInput = () => {
  const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
  Communication.sendMessage(ComHelp.MSG.ONOFF, { status: val });
};

function App() {
  const [userId, setUserId] = useState<string | undefined>();
  useEffect(() => {
    AuthenticationHandler.authenticate().then((uId) => {
      if (uId) {
        setUserId(uId);
        KeyEchangeHandler.getParticipantKeys();
      }
    });
    Communication.addListener(ComHelp.MSG.GET_OWN_IDENTIFIER, () => {
      Communication.sendMessage(ComHelp.MSG.OWN_IDENTIFIER, { id: userId });
    });
    Communication.addListener(ComHelp.MSG.ONOFF, (data: ComHelp.StatusPayload) => {
      (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
    });
  }, [userId]);
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

        <button onClick={KeyEchangeHandler.share}>Share</button>
      </header>
    </div>
  );
}

export default App;
