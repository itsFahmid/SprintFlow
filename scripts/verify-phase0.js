const fs = require("fs");

async function runTests() {
  const BASE_URL = "http://localhost:3000";
  console.log("=== STARTING PHASE 0 AUTOMATED VERIFICATION ===");

  // Test 1: Reject short password
  console.log("\n[Test 1] Testing password policy: reject short password (< 8 chars)...");
  const shortRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Short Tester", email: "short@sprintflow.dev", password: "short" })
  });
  const shortData = await shortRes.json();
  console.log("Status:", shortRes.status, "Error:", shortData.error);
  if (shortRes.status !== 400) throw new Error("Expected 400 for short password");

  // Test 2: Reject common password
  console.log("\n[Test 2] Testing password policy: reject common password ('password123')...");
  const commonRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Common Tester", email: "common@sprintflow.dev", password: "password123" })
  });
  const commonData = await commonRes.json();
  console.log("Status:", commonRes.status, "Error:", commonData.error);
  if (commonRes.status !== 400) throw new Error("Expected 400 for common password");

  // Test 3: Successful signup with strong password
  const testEmail = `phase0_${Date.now()}@sprintflow.dev`;
  const testPassword = "ValidSecurePass#2026!";
  console.log(`\n[Test 3] Creating new user: ${testEmail}...`);
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Phase Zero Auditor", email: testEmail, password: testPassword })
  });
  const signupCookie = signupRes.headers.get("set-cookie");
  const signupData = await signupRes.json();
  console.log("Status:", signupRes.status, "Success:", signupData.success, "User ID:", signupData.user?.id);
  if (!signupRes.ok) throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);

  // Extract session token
  const sessionToken = signupCookie.split(";")[0].split("=")[1];
  console.log("Session token length:", sessionToken.length, "Prefix:", sessionToken.substring(0, 10));

  // Test 4: Inspect record in db.json for bcrypt hash
  console.log("\n[Test 4] Inspecting user in database for real bcrypt hash...");
  const rawDb = JSON.parse(fs.readFileSync("db.json", "utf8"));
  const createdUser = rawDb.users.find(u => u.email === testEmail);
  console.log("Stored hash in DB:", createdUser.passwordHash);
  if (!createdUser.passwordHash.startsWith("$2a$12$") && !createdUser.passwordHash.startsWith("$2b$12$")) {
    throw new Error("Password is not a bcrypt cost-12 hash!");
  }
  console.log("✓ Verified: Password is encrypted with real bcrypt (cost factor 12).");

  // Test 5: Verify legacy mock password auto-migration on login
  console.log("\n[Test 5] Testing legacy mock_ password auto-upgrade on login...");
  const legacyEmail = `legacy_${Date.now()}@sprintflow.dev`;
  const legacyPassword = "MyOldUnsafePassword!";
  // Manually seed a legacy mock_ user
  rawDb.users.push({
    id: "legacy_user_1",
    name: "Legacy User",
    email: legacyEmail,
    passwordHash: "mock_" + legacyPassword,
    settings: { sprintLength: 25, dailyGoal: 5 },
    tasks: [],
    sprints: [],
    rewards: { xp: 0, coins: 0, streak: 0, streakDays: [], achievements: [], history: [] },
    planner: { timeline: [], completedSprintsCount: 0 }
  });
  fs.writeFileSync("db.json", JSON.stringify(rawDb, null, 2));

  // Login with legacy user
  const legacyLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: legacyEmail, password: legacyPassword, rememberMe: true })
  });
  const legacyLoginData = await legacyLoginRes.json();
  console.log("Legacy login status:", legacyLoginRes.status, "Success:", legacyLoginData.success);

  // Check if hash was automatically updated to bcrypt
  const updatedDb = JSON.parse(fs.readFileSync("db.json", "utf8"));
  const updatedLegacyUser = updatedDb.users.find(u => u.email === legacyEmail);
  console.log("Updated hash after login:", updatedLegacyUser.passwordHash);
  if (!updatedLegacyUser.passwordHash.startsWith("$2a$12$") && !updatedLegacyUser.passwordHash.startsWith("$2b$12$")) {
    throw new Error("Legacy password was not auto-migrated to bcrypt!");
  }
  console.log("✓ Verified: Legacy mock_ hash successfully auto-migrated to bcrypt upon login.");

  // Test 6: Authenticated End-to-End flow
  console.log("\n[Test 6] Testing authenticated user workflow with session cookie...");
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: `sprintflow_session=${sessionToken}` }
  });
  const meData = await meRes.json();
  console.log("GET /api/auth/me status:", meRes.status, "Name:", meData.user?.name);
  if (!meRes.ok) throw new Error("GET /api/auth/me failed with valid session");

  // Save tasks
  const tasksRes = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `sprintflow_session=${sessionToken}` },
    body: JSON.stringify({
      tasks: [{ id: 101, name: "Audit SprintFlow security", duration: "25 min", priority: "High", completed: false }]
    })
  });
  console.log("POST /api/tasks status:", tasksRes.status);

  // Test 7: Account Deletion (before and after)
  console.log("\n[Test 7] Testing true account deletion...");
  const countBefore = JSON.parse(fs.readFileSync("db.json", "utf8")).users.filter(u => u.id === createdUser.id).length;
  console.log("User existence before deletion:", countBefore === 1 ? "Present (1)" : "Missing (0)");

  // Attempt delete with wrong password
  const failDeleteRes = await fetch(`${BASE_URL}/api/user`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Cookie: `sprintflow_session=${sessionToken}` },
    body: JSON.stringify({ confirmation: "DELETE", password: "wrongpassword" })
  });
  console.log("Delete with wrong password status:", failDeleteRes.status);
  if (failDeleteRes.status !== 403) throw new Error("Expected 403 for wrong password during deletion");

  // Delete with correct credentials
  const deleteRes = await fetch(`${BASE_URL}/api/user`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Cookie: `sprintflow_session=${sessionToken}` },
    body: JSON.stringify({ confirmation: "DELETE", password: testPassword })
  });
  const deleteData = await deleteRes.json();
  console.log("Delete with correct credentials status:", deleteRes.status, "Message:", deleteData.message);

  const countAfter = JSON.parse(fs.readFileSync("db.json", "utf8")).users.filter(u => u.id === createdUser.id).length;
  console.log("User existence after deletion:", countAfter === 0 ? "Completely Removed (0)" : "Still Present (1)");
  if (countAfter !== 0) throw new Error("Account was not removed from database!");

  // Verify session is also deleted
  const sessionAfter = JSON.parse(fs.readFileSync("db.json", "utf8")).sessions.filter(s => s.token === sessionToken).length;
  console.log("Session token count after deletion:", sessionAfter);
  if (sessionAfter !== 0) throw new Error("Session token was not purged upon deletion!");

  // Clean up legacy test user
  const finalDb = JSON.parse(fs.readFileSync("db.json", "utf8"));
  finalDb.users = finalDb.users.filter(u => u.email !== legacyEmail);
  fs.writeFileSync("db.json", JSON.stringify(finalDb, null, 2));

  console.log("\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(err => {
  console.error("Test failure:", err);
  process.exit(1);
});
