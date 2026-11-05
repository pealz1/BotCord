/* Copyright pealz1 © 2026. All rights reserved */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { app } = require("electron");
const root = fs.mkdtempSync(path.join(os.tmpdir(), "dbc-legacy-test-"));
// Sandbox appData too, so even a broken guard could only move this fake BotDeck folder.
const appData = path.join(root, "appData");
fs.mkdirSync(path.join(appData, "BotDeck"), { recursive: true });
app.setPath("appData", appData);
app.setPath("userData", path.join(root, "redirected"));
require("tsx/cjs");
const { adoptLegacyUserData } = require("../../src/AppCore/LegacyUserData.ts");

function legacyProfile (name) {
    const directory = path.join(root, name, "BotDeck");
    fs.mkdirSync(path.join(directory, "Local Storage"), { recursive: true });
    fs.writeFileSync(path.join(directory, "config.json"), "{\"version\":1}");
    return directory;
}
function check (name, run) {
    run();
    console.log(`PASS ${name}`);
}
let exitCode = 0;
try {
    check("moves legacy data into an empty userData folder", () => {
        const legacy = legacyProfile("empty");
        const target = path.join(root, "empty", "BotCord");
        fs.mkdirSync(target);
        assert.equal(adoptLegacyUserData(legacy, target), true);
        assert.equal(fs.existsSync(legacy), false);
        assert.equal(fs.readFileSync(path.join(target, "config.json"), "utf8"), "{\"version\":1}");
        assert.ok(fs.existsSync(path.join(target, "Local Storage")));
    });
    check("moves legacy data when userData does not exist yet", () => {
        const legacy = legacyProfile("missing");
        const target = path.join(root, "missing", "BotCord");
        assert.equal(adoptLegacyUserData(legacy, target), true);
        assert.ok(fs.existsSync(path.join(target, "config.json")));
    });
    check("never touches a userData folder that is already in use", () => {
        const legacy = legacyProfile("used");
        const target = path.join(root, "used", "BotCord");
        fs.mkdirSync(target);
        fs.writeFileSync(path.join(target, "config.json"), "{\"version\":1,\"settings\":{}}");
        assert.equal(adoptLegacyUserData(legacy, target), false);
        assert.ok(fs.existsSync(path.join(legacy, "config.json")));
        assert.equal(fs.readFileSync(path.join(target, "config.json"), "utf8"), "{\"version\":1,\"settings\":{}}");
    });
    check("does nothing without legacy data", () => {
        const target = path.join(root, "none", "BotCord");
        assert.equal(adoptLegacyUserData(path.join(root, "none", "BotDeck"), target), false);
        assert.equal(fs.existsSync(target), false);
    });
    check("import skipped the redirected userData folder", () => {
        assert.ok(fs.existsSync(path.join(appData, "BotDeck")));
        assert.equal(fs.existsSync(path.join(root, "redirected")), false);
    });
} catch (error) {
    console.error(error);
    exitCode = 1;
} finally {
    fs.rmSync(root, { recursive: true, force: true });
    app.exit(exitCode);
}
