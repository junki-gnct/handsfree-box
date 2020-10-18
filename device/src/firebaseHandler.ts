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

export function onBoxStateUpdated(state: boolean): void {
  console.log(state);
}
