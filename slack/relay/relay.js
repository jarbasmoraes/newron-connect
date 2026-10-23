// Slack sends the browser here after the Allow screen. This page forwards Slack's answer to the
// Newron running on this computer and nowhere else: the host is always localhost, and only the
// port comes from the state, which the local Newron created as "<port>.<random>".
// The code is useless without the PKCE verifier, which never leaves that computer.
"use strict";

const STATE = /^(\d{4,5})\.[A-Za-z0-9_-]{32,128}$/;
const FORWARDED = ["code", "state", "error"];

function relayTarget(search) {
  const params = new URLSearchParams(search);
  const match = STATE.exec(params.get("state") || "");
  if (!match) return null;
  const port = Number(match[1]);
  if (port < 1024 || port > 65535) return null;
  const forwarded = new URLSearchParams();
  for (const key of FORWARDED) {
    const value = params.get(key);
    if (value !== null) forwarded.set(key, value);
  }
  return `http://localhost:${port}/connections/oauth-return?${forwarded}`;
}

if (typeof module !== "undefined") {
  module.exports = { relayTarget };
} else {
  const target = relayTarget(window.location.search);
  if (target) {
    window.location.replace(target);
  } else {
    document.getElementById("message").textContent =
      "This sign-in link is not valid. Start the Slack connection again from Newron.";
  }
}
