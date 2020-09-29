import { ComHelp } from '@teacrypt/common';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

import { Communication } from './background/communication';
import { EnableEncryption } from './components/EnableEncryption/EnableEncryption';
import { SharerInput } from './components/ShareInput/ShareInput';
import { AuthenticationHandler } from './services/Auth/AuthenticationHandler';
import { EncryptionHandler } from './services/Encryption/EncryptionHandler';
import { KeyEchangeHandler } from './services/KeyExchange/KeyExchangeHandler';

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
    }
  }, [userId]);
  return (
    <Container>
      <br />
      {userId && (
        <>
          <Alert variant={"primary"}>
            <Alert.Heading className="text-center">{userId}</Alert.Heading>
          </Alert>
        </>
      )}
      <EnableEncryption />
      <br />
      <SharerInput />
    </Container>
  );
}

export default App;
