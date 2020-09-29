import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { KeyEchangeHandler } from '../../services/KeyExchange/KeyExchangeHandler';

export const SharerInput = () => {
  const [userId, setUserId] = useState<string>("");
  return (
    <Row>
      <Col xs="8">
        <Form.Control type="text" onChange={(e) => setUserId(e.target.value)} placeholder="Enter Text" />
      </Col>
      <Col xs="4">
        <Button block onClick={() => KeyEchangeHandler.share(userId)}>
          Share
        </Button>
      </Col>
    </Row>
  );
};
