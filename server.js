/* Elemental Blueprint local companion.
   Serves the static app and bridges POST /api/ask to the Claude Code
   CLI (claude -p), so follow-up questions run on the user's own
   Claude subscription. Binds to 127.0.0.1 only. Zero dependencies.
   The app works without this server; only the Ask section needs it. */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = 8873;
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon"
};

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function askClaude(prompt, cb) {
  /* prompt goes via stdin: no shell-quoting surface */
  const child = spawn("claude", ["-p", "--output-format", "text"],
    { cwd: ROOT, shell: true, windowsHide: true });
  let out = "", err = "", done = false;
  const finish = function (e, answer) {
    if (done) return;
    done = true;
    clearTimeout(killer);
    cb(e, answer);
  };
  const killer = setTimeout(function () {
    try { child.kill(); } catch (_) { /* ignore */ }
    finish(new Error("timeout"));
  }, 180000);
  child.stdout.on("data", function (d) {
    out += d;
    if (out.length > 200000) { try { child.kill(); } catch (_) { /* ignore */ } }
  });
  child.stderr.on("data", function (d) { err += d; });
  child.on("error", function (e) { finish(e); });
  child.on("close", function (code) {
    if (code === 0 && out.trim()) finish(null, out.trim());
    else finish(new Error(err.trim() || ("claude exited " + code)));
  });
  child.stdin.end(prompt);
}

const server = http.createServer(function (req, res) {
  if (req.url === "/api/health") return json(res, 200, { ok: true });

  if (req.method === "POST" && req.url === "/api/ask") {
    let body = "";
    req.on("data", function (d) {
      body += d;
      if (body.length > 200000) req.destroy();
    });
    req.on("end", function () {
      let prompt = "";
      try { prompt = String(JSON.parse(body).prompt || ""); }
      catch (e) { return json(res, 400, { error: "bad json" }); }
      if (!prompt.trim()) return json(res, 400, { error: "empty prompt" });
      const t0 = Date.now();
      askClaude(prompt, function (e, answer) {
        if (e) return json(res, 502, { error: e.message });
        json(res, 200, { answer: answer, ms: Date.now() - t0 });
      });
    });
    return;
  }

  if (req.method !== "GET") return json(res, 405, { error: "method" });
  const clean = path.normalize(decodeURIComponent(req.url.split("?")[0]))
    .replace(/^[.\\\/]+/, "");
  const file = path.join(ROOT, clean === "" ? "index.html" : clean);
  if (!file.startsWith(ROOT)) return json(res, 403, { error: "path" });
  fs.readFile(file, function (e, data) {
    if (e) return json(res, 404, { error: "not found" });
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", function () {
  console.log("Elemental Blueprint companion on http://localhost:" + PORT);
});
