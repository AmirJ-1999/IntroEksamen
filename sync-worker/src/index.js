/* Study Lab sync API — a deliberately simple account system.
   Accounts are username + password (PBKDF2-hashed). Each account stores one JSON blob with the
   page's localStorage progress. Login returns a random session token used as a Bearer token.

   POST /api/register {username, password}  -> {token, username, rev}
   POST /api/login    {username, password}  -> {token, username, rev}
   POST /api/logout                          -> {ok}
   GET  /api/data                            -> {data, rev, updated}
   PUT  /api/data     {data, baseRev}        -> {rev}  | 409 {data, rev} when another device saved first
*/

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};
const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
const MIN_PASSWORD = 4;
const MAX_DATA_BYTES = 1_000_000;
const SESSION_DAYS = 365;
const PBKDF2_ITERATIONS = 100_000;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
const fail = (status, error) => json({ error }, status);

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const randomHex = (bytes) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));

async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256));
}

function sameHex(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  return x.byteLength === y.byteLength && crypto.subtle.timingSafeEqual(x, y);
}

async function readCredentials(request) {
  let body;
  try { body = await request.json(); } catch { return { error: "Ugyldig forespørgsel." }; }
  const username = String(body?.username ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!USERNAME_RE.test(username))
    return { error: "Brugernavnet skal være 3–32 tegn: små bogstaver, tal, punktum, - eller _." };
  if (password.length < MIN_PASSWORD) return { error: `Passwordet skal være mindst ${MIN_PASSWORD} tegn.` };
  return { username, password };
}

async function newSession(env, username) {
  const token = randomHex(32);
  await env.DB.prepare("INSERT INTO sessions (token, username, created_at) VALUES (?, ?, ?)").bind(token, username, Date.now()).run();
  return token;
}

async function sessionUser(request, env) {
  const m = /^Bearer ([0-9a-f]{64})$/.exec(request.headers.get("Authorization") || "");
  if (!m) return null;
  const row = await env.DB.prepare("SELECT username, created_at FROM sessions WHERE token = ?").bind(m[1]).first();
  if (!row || Date.now() - row.created_at > SESSION_DAYS * 864e5) return null;
  return { username: row.username, token: m[1] };
}

async function register(request, env) {
  const c = await readCredentials(request);
  if (c.error) return fail(400, c.error);
  const salt = randomHex(16), hash = await hashPassword(c.password, salt), now = Date.now();
  const res = await env.DB.prepare(
    "INSERT INTO users (username, salt, hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(username) DO NOTHING"
  ).bind(c.username, salt, hash, now, now).run();
  if (!res.meta.changes) return fail(409, "Brugernavnet er allerede taget.");
  return json({ token: await newSession(env, c.username), username: c.username, rev: 0 });
}

async function login(request, env) {
  const c = await readCredentials(request);
  if (c.error) return fail(400, c.error);
  const user = await env.DB.prepare("SELECT salt, hash, rev FROM users WHERE username = ?").bind(c.username).first();
  // hash even for unknown users so the response time doesn't reveal which usernames exist
  const hash = await hashPassword(c.password, user?.salt ?? "00".repeat(16));
  if (!user || !sameHex(hash, user.hash)) return fail(401, "Forkert brugernavn eller password.");
  return json({ token: await newSession(env, c.username), username: c.username, rev: user.rev });
}

async function getData(user, env) {
  const row = await env.DB.prepare("SELECT data, rev, updated_at FROM users WHERE username = ?").bind(user.username).first();
  if (!row) return fail(401, "Kontoen findes ikke længere.");
  return json({ data: JSON.parse(row.data), rev: row.rev, updated: row.updated_at });
}

async function putData(request, user, env) {
  const text = await request.text();
  if (text.length > MAX_DATA_BYTES) return fail(413, "Data er for store til at blive gemt.");
  let body;
  try { body = JSON.parse(text); } catch { return fail(400, "Ugyldig JSON."); }
  if (!body || typeof body.data !== "object" || Array.isArray(body.data) || !Number.isInteger(body.baseRev))
    return fail(400, "Forventer {data, baseRev}.");
  // only save if nobody else saved since this device last synced (compare-and-swap on rev)
  const res = await env.DB.prepare(
    "UPDATE users SET data = ?, rev = rev + 1, updated_at = ? WHERE username = ? AND rev = ?"
  ).bind(JSON.stringify(body.data), Date.now(), user.username, body.baseRev).run();
  if (res.meta.changes) return json({ rev: body.baseRev + 1 });
  const row = await env.DB.prepare("SELECT data, rev FROM users WHERE username = ?").bind(user.username).first();
  if (!row) return fail(401, "Kontoen findes ikke længere.");
  return json({ error: "conflict", data: JSON.parse(row.data), rev: row.rev }, 409);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    const { pathname } = new URL(request.url);
    try {
      if (pathname === "/api/register" && request.method === "POST") return await register(request, env);
      if (pathname === "/api/login" && request.method === "POST") return await login(request, env);
      if (pathname.startsWith("/api/")) {
        const user = await sessionUser(request, env);
        if (!user) return fail(401, "Du er ikke logget ind.");
        if (pathname === "/api/data" && request.method === "GET") return await getData(user, env);
        if (pathname === "/api/data" && request.method === "PUT") return await putData(request, user, env);
        if (pathname === "/api/logout" && request.method === "POST") {
          await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(user.token).run();
          return json({ ok: true });
        }
      }
      if (pathname === "/") return new Response("Study Lab sync API", { headers: CORS });
      return fail(404, "Ukendt endpoint.");
    } catch (err) {
      console.error(err);
      return fail(500, "Serverfejl. Prøv igen om lidt.");
    }
  },
};
