import { ComHelp } from "@teacrypt/common";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import { Communication } from "../../background/communication";
import { AuthenticationHandler } from "../../services/Auth/AuthenticationHandler";
import { EncryptionHandler } from "../../services/Encryption/EncryptionHandler";
import { KeyExchangeHandler } from "../../services/KeyExchange/KeyExchangeHandler";

export const UserInfo = () => {
  const [userId, setUserId] = useState<string | undefined>();
  useEffect(() => {
    if (!userId) {
      AuthenticationHandler.authenticate().then((uId) => {
        if (uId) {
          setUserId(uId);
          setInterval(() => {
            KeyExchangeHandler.getParticipantKeys().then(() => {
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
    <Alert variant={"primary"}>
      <Alert.Heading className="text-center">
        {userId ? (
          userId
        ) : (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Alert.Heading>
    </Alert>
  );
};
