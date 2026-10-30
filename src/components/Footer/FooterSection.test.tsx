import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import FooterSection from "./FooterSection"

describe("FooterSection", () => {
  test("routes tutoring inquiries to the contact page", () => {
    const markup = renderToStaticMarkup(<FooterSection />)

    expect(markup).toContain('href="/contact"')
    expect(markup).toContain("Tutoring")
    expect(markup).not.toContain("fiverr.com")
  })
})
