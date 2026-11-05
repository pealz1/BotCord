# Changelog

All notable changes to BotCord (called BotDeck up to 1.0.0) are listed here. Versions follow [Semantic Versioning](https://semver.org).

## [Unreleased]

### Changed

- The local server now runs on Express 5. Wildcard routes use the new `/{*path}` syntax, and query strings are still parsed the Express 4 way, so the Discord client sees the same responses.
- Electron 45 (Chromium 156, Node.js 24.22).
- Development tooling: ESLint 10, pnpm 12 (builds Vencord), Vite 8 (builds the Settings window), jsdom 31 and js-beautify 2. The unused `eslint-plugin-import` and legacy `.eslintrc.json` are gone.

### Fixed

- Moving BotDeck's data into BotCord's folder now retries for up to two seconds if Windows briefly locks the folder (antivirus, search indexing), instead of starting with fresh settings.

## [1.1.0] - 2026-11-05

BotDeck is now **BotCord**, with a new logo. It is the same app: the app ID and update channel are unchanged, so BotDeck 1.0.0 updates itself on Windows and Linux.

### Changed

- New name and logo. The repository moved to [pealz1/BotCord](https://github.com/pealz1/BotCord); old links redirect.
- On first launch, BotCord moves BotDeck's settings and saved logins into its own data folder, so you stay logged in. If BotDeck is still running, BotCord starts with fresh settings instead.
- Startup messages and Settings descriptions say "BotCord" instead of "DBC".

### Security

- Updated `express`, `multer`, `undici` and their dependencies to fix advisories in `proxy-addr` (critical), `body-parser`, `path-to-regexp`, `qs`, `node-forge` and others. `npm audit` reports no vulnerabilities in the app's dependencies.
- The message editor's pinned Discohook build now uses patched `zod`, `postcss` and build tooling (`scripts/discohook-audit-fix.patch`).
- Dependabot now proposes npm dependency updates weekly, and GitHub Actions are on their current major versions.

### Fixed

- Removed dead code and fixed every lint warning in `src/`.

## [1.0.0] - 2026-10-20

First release of BotDeck, a community-maintained continuation of [DiscordBotClient](https://github.com/aiko-chan-ai/DiscordBotClient) 3.9.3 by aiko-chan-ai. BotDeck installs alongside DiscordBotClient and keeps its own settings, so log in again after installing.

### Highlights

- New name, app ID and update channel: BotDeck updates from [pealz1/BotDeck releases](https://github.com/pealz1/BotDeck/releases).
- Includes the DiscordBotClient v3 rework ([#379](https://github.com/aiko-chan-ai/DiscordBotClient/pull/379)): new Settings window, startup window with retry, sandboxed windows and an Electron integration test suite.
- The BotClient Vencord plugin now lives in this repository (`plugin/`), with its full history, so the app and plugin are versioned together.

### Security

- The local API server only listens on `127.0.0.1` and checks bot tokens with Discord before serving account data ([#383](https://github.com/aiko-chan-ai/DiscordBotClient/issues/383), [#366](https://github.com/aiko-chan-ai/DiscordBotClient/pull/366)); successful checks are cached for 60 seconds ([#384](https://github.com/aiko-chan-ai/DiscordBotClient/pull/384)).
- TLS errors are only accepted for the app's own local certificate instead of globally ([#369](https://github.com/aiko-chan-ai/DiscordBotClient/pull/369)).
- The main window cannot be navigated away from Discord; external links open in your browser ([#368](https://github.com/aiko-chan-ai/DiscordBotClient/pull/368)).

### Fixed

- Message edits longer than 2,000 characters were silently thrown away. The editor now enforces the bot limit and keeps your text ([#386](https://github.com/aiko-chan-ai/DiscordBotClient/issues/386)).
- The "Bot Intents" toast appeared on every reconnect, and two overlapping logins could both be sent ([#364](https://github.com/aiko-chan-ai/DiscordBotClient/issues/364)).
- The member list was not sorted: members without a nickname kept join order and the offline group was never sorted ([#363](https://github.com/aiko-chan-ai/DiscordBotClient/issues/363)).
- Remembered DMs came back without names after a restart ([#317](https://github.com/aiko-chan-ai/DiscordBotClient/issues/317)).
- `/switch guild` now checks the bot is in the server, waits for it to load, and works with a single shard ([#343](https://github.com/aiko-chan-ai/DiscordBotClient/issues/343)).
- `Ctrl` + `=` and `Ctrl` + numpad `+` now zoom in ([#380](https://github.com/aiko-chan-ai/DiscordBotClient/issues/380)).
- No more false "offline" errors on some Linux systems ([#357](https://github.com/aiko-chan-ai/DiscordBotClient/issues/357)); DNS-over-HTTPS falls back to system DNS ([#373](https://github.com/aiko-chan-ai/DiscordBotClient/issues/373)).
- macOS asks for microphone permission ([#333](https://github.com/aiko-chan-ai/DiscordBotClient/issues/333)).
- File uploads up to 20 MB ([#385](https://github.com/aiko-chan-ai/DiscordBotClient/issues/385)).
- A token containing "bot" anywhere could be corrupted at login; only a leading "Bot " prefix is removed now.

### Added

- Each bot's last shard is remembered across restarts ([#231](https://github.com/aiko-chan-ai/DiscordBotClient/issues/231)).
- Server notification settings are kept per bot ([#293](https://github.com/aiko-chan-ai/DiscordBotClient/issues/293)).
- Optional classic Embed Builder, selectable in the BotClient plugin settings ([#372](https://github.com/aiko-chan-ai/DiscordBotClient/issues/372)).
- Clear guidance when privileged intents are off, with a button to your bot's Developer Portal page ([#286](https://github.com/aiko-chan-ai/DiscordBotClient/issues/286)).

### Changed

- Installed builds only log failed API requests, which makes startup lighter on slow disks ([#299](https://github.com/aiko-chan-ai/DiscordBotClient/issues/299)).
- Electron 44, updated dependencies and GitHub Actions.

[1.0.0]: https://github.com/pealz1/BotDeck/releases/tag/v1.0.0
