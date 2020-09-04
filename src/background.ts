import { Communication } from './communication/background/communication';
import { StatusPayload, TYPE_ONOFF } from './communication/types';

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.getElementById("onoffStatus").addEventListener("click", () => {
      const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
      Communication.sendMessage(TYPE_ONOFF, { status: val });
    });
  },
  false
);

Communication.addListener(TYPE_ONOFF, (data: StatusPayload) => {
  (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
});
