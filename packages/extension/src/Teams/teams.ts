import { aesHelper } from '@teacrypt/common';

import Store from '../encryption/store';
import { getElementsByXPath } from '../utils/utils';

export const goOverTeamsChatMessages = () => {
  const selector = document.querySelector(".ts-message-list-container .ts-message ");
  var messages = getElementsByXPath("//div[contains(text(), '" + aesHelper.TEACRYPT_PREFIX + "')]", selector);
  for (let i = 0; i < messages.length; i++) {
    if (!messages[i].className.includes("screen-reader-text")) {
      const key = Store.getKey(aesHelper.extractUserId(messages[i].innerText));
      if (key) {
        const txt = aesHelper.decryptSimple(key, messages[i].innerText);
        if (txt) {
          messages[i].innerText = txt;
        }
      }
    }
  }
};
