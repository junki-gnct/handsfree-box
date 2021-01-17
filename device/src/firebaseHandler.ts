import SerialPort from 'serialport';

export function checkOnlineState(
  obj: Record<string, unknown>,
  ref: firebase.database.Reference,
  state: boolean
): void {
  if (!(obj.isOnline as boolean) && state) {
    void ref.update({
      isOnline: true,
    });
  }
}

export function onBoxStateUpdated(state: boolean, gcm_token: string, port: SerialPort): void {
  console.log('[Device]', `State changed: ${state ? 'Opened' : 'Closed'}`);
  port.write(`${state ? 'UNLOCK' : 'LOCK'}\n`);
}
