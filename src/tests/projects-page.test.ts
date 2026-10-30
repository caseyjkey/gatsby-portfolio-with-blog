import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"

describe("projects page hydration", () => {
  test("hydrates project cards without relying on a visible island wrapper", () => {
    const source = readFileSync(new URL("../pages/projects.astro", import.meta.url), "utf8")

    expect(source).toContain("client:idle={{ timeout: 2000 }}")
    expect(source).not.toContain("client:visible")
  })
})
