import { admin } from 'firebase-admin/lib/database';

export function checkOnlineState(
  obj: Record<string, unknown>,
  ref: admin.database.Reference,
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
