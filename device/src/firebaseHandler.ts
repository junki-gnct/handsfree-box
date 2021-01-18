import SerialPort = require('serialport');
import * as firebaseConfig from './miscs/firebaseConfig.json';
import fetch = require('isomorphic-fetch');

export function checkOnlineState(
  obj: Record<string, unknown>,
  ref: firebase.database.Reference,
  state: boolean,
): void {
  if (!(obj.isOnline as boolean) && state) {
    void ref.update({
      isOnline: true,
    });
  }
}

export function onBoxStateUpdated(
  state: boolean,
  gcm_token: string,
  port: SerialPort,
  name: string,
): void {
  console.log('[Device]', `State changed: ${state ? 'Opened' : 'Closed'}`);
  port.write(`${state ? 'UNLOCK' : 'LOCK'}\n`);
  if (gcm_token != null && !state) {
    void makeNotification(
      gcm_token,
      '状態が更新されました',
      `${name} に荷物が入れられました`,
    ).then(() => {
      console.log('[Firebase]', '通知を送信しました。');
    });
  }
}

async function makeNotification(
  token: string,
  title: string,
  body: string,
): Promise<void> {
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${firebaseConfig.serverkey}`,
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: title,
        body: body,
        click_action: 'https://handsfree-box.junki-t.net/',
      },
    }),
  };

  const url: RequestInfo = 'https://fcm.googleapis.com/fcm/send';
  await fetch(url, init);
}
