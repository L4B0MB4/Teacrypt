import React from 'react';
import Container from 'react-bootstrap/Container';

import { EnableEncryption } from './components/EnableEncryption/EnableEncryption';
import { SharerInput } from './components/ShareInput/ShareInput';
import { UserInfo } from './components/UserInfo/UserInfo';

function App() {
  return (
    <Container>
      <br />
      <UserInfo />
      <EnableEncryption />
      <br />
      <SharerInput />
    </Container>
  );
}

export default App;
