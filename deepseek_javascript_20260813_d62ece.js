exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow if already admin? Or use a secret.
  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});