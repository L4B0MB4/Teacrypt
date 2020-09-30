import { ComHelp } from '@teacrypt/common';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { Communication } from '../../background/communication';

export const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  Communication.sendMessage(ComHelp.MSG.ONOFF, { status: e.target.checked });
};

export const EnableEncryption = () => {
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    let prevChecked = false;
    Communication.addListener(ComHelp.MSG.ONOFF, (data: ComHelp.StatusPayload) => {
      //preventing a lot of rerenders
      if (prevChecked !== data.status) {
        setChecked(data.status);
        prevChecked = data.status;
      }
    });
  }, []);
  return (
    <Row>
      <Col>
        <Form.Check onChange={onChange} checked={checked} type={"checkbox"} label={`An/Aus Verschlüsselung`} />
      </Col>
    </Row>
  );
};
