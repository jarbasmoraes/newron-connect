# newron-connect

Static sign-in relay for Newron Brain's Slack connection (AD-075). Slack returns the browser to
`/slack/relay/`, which forwards `code`, `state` and `error` to the Newron running on the same
computer (`http://localhost:<port>/connections/oauth-return`) and nowhere else. The code is
useless without the PKCE verifier, which never leaves that computer. No secret lives here.
