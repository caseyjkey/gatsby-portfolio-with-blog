import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"

describe("GitHub Pages deployment", () => {
  test("publishes the no-Jekyll marker needed for Astro underscore assets", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url), "utf8")
    )

    expect(existsSync(new URL("../../static/.nojekyll", import.meta.url))).toBe(true)
    expect(packageJson.scripts.deploy).toContain("--dotfiles")
  })
})
