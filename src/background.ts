import { Communication } from './communication/background/communication';
import { MSG, StatusPayload } from './communication/types';

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.getElementById("onoffStatus").addEventListener("click", () => {
      const val = (document.getElementById("onoffStatus") as HTMLInputElement).checked;
      Communication.sendMessage(MSG.ONOFF, { status: val });
    });
  },
  false
);

Communication.addListener(MSG.ONOFF, (data: StatusPayload) => {
  (document.getElementById("onoffStatus") as HTMLInputElement).checked = data.status;
});
