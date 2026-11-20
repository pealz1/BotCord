/* Copyright Elysia © 2025 */

import { execFileSync, spawnSync } from "child_process";
import path from "path";

export function applyDependencyPatch(directory: string, filename: string, prerequisite?: string) {
    const patch = path.resolve("scripts", filename);
    const applied = spawnSync("git", ["apply", "--reverse", "--check", patch], { cwd: directory });
    if (applied.status === 0) return;
    if (prerequisite) applyDependencyPatch(directory, prerequisite);
    execFileSync("git", ["apply", patch], { cwd: directory, stdio: "inherit" });
}
