/* Copyright pealz1 © 2026. All rights reserved */

import { app } from "electron";
import fs from "fs";
import path from "path";

// BotCord was called BotDeck up to v1.0.0, so its settings, saved logins and logs live under that name.
export const LegacyAppName = "BotDeck";

const TransientLockCodes = new Set(["EPERM", "EBUSY", "EACCES"]);
const RenameAttempts = 20;
const RenameRetryDelayMs = 100;

// Antivirus and search indexers briefly lock freshly touched folders on Windows, so retry for up to ~2 s.
function renameWithRetry (from: string, to: string) {
    for (let attempt = 1; ; attempt++) {
        try {
            return fs.renameSync(from, to);
        } catch (error) {
            const code = (error as NodeJS.ErrnoException).code ?? "";
            if (attempt >= RenameAttempts || !TransientLockCodes.has(code)) throw error;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, RenameRetryDelayMs);
        }
    }
}

/**
 * Moves the legacy data folder into place when `userData` has never been used.
 * Electron creates `userData` (empty) before app code runs, so "empty" means "first launch".
 */
export function adoptLegacyUserData (legacyDir: string, userDataDir: string): boolean {
    if (!fs.existsSync(legacyDir)) return false;
    if (fs.existsSync(userDataDir) && fs.readdirSync(userDataDir).length > 0) return false;
    try {
        // rmdir refuses non-empty folders, so this can never delete data.
        if (fs.existsSync(userDataDir)) fs.rmdirSync(userDataDir);
        renameWithRetry(legacyDir, userDataDir);
        return true;
    } catch (error) {
        // Usually BotDeck is still running and holds its files: start fresh instead of blocking startup longer.
        fs.mkdirSync(userDataDir, { recursive: true });
        console.error(`Could not move ${legacyDir} to ${userDataDir}:`, error);
        return false;
    }
}

// Runs on import, before anything reads userData. Skipped when userData was redirected (tests, --user-data-dir).
const appData = app.getPath("appData");
const userData = app.getPath("userData");
if (userData === path.join(appData, app.getName())) {
    adoptLegacyUserData(path.join(appData, LegacyAppName), userData);
}
