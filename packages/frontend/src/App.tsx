import { ComHelp } from '@teacrypt/common';
import React, { useEffect, useState } from 'react';

import { Communication } from './background/communication';
import { AuthenticationHandler } from './services/Auth/AuthenticationHandler';
import { EncryptionHandler } from './services/Encryption/EncryptionHandler';
import { KeyEchangeHandler } from './services/KeyExchange/KeyExchangeHandler';

const onChangeInput = () => {
  const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
  Communication.sendMessage(ComHelp.MSG.ONOFF, { status: val });
};

function App() {
  const [userId, setUserId] = useState<string | undefined>();
  useEffect(() => {
    if (!userId) {
      AuthenticationHandler.authenticate().then((uId) => {
        if (uId) {
          setUserId(uId);
          setInterval(() => {
            KeyEchangeHandler.getParticipantKeys().then(() => {
              Communication.sendMessage(ComHelp.MSG.PARICIPANT_KEYS, EncryptionHandler.getAllParticipantAesKeys());
            });
          }, 5000);
        }
      });
      Communication.addListener(ComHelp.MSG.GET_OWN_IDENTIFIER, () => {
        if (AuthenticationHandler.userId) {
          Communication.sendMessage(ComHelp.MSG.OWN_IDENTIFIER, {
            id: AuthenticationHandler.userId,
            aesKey: EncryptionHandler.getAesKey(AuthenticationHandler.userId)!,
          });
        }
      });
      Communication.addListener(ComHelp.MSG.ONOFF, (data: ComHelp.StatusPayload) => {
        (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
      });
    }
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
