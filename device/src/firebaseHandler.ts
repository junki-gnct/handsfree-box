export function checkOnlineState(
  obj: Record<string, unknown>,
  ref: firebase.database.Reference,
): void {
  if (!(obj.isOnline as boolean)) {
    void ref.update({
      isOnline: true,
    });
  }
}

export function onBoxStateUpdated(state: boolean, gcm_token: string): void {
  console.log(state);
  console.log(gcm_token);
}
