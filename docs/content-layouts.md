# Content-aware slide layouts

The default pitch content stays in `lib/pitch.ts`. Open `/stress` to reproduce the six-source-slide FenaPix example, presented as nine pages. The example is fictional review content, not a statement about the product's actual issues. `/review/compare.html` shows before/after previews and the table/card continuation pages.

Use Node.js 24 (`nvm use`, or another Node version manager):

```sh
npm ci
npm test
npm run build
npm start
```

Node 24 is selected in `.nvmrc`; tests use built-in TypeScript stripping (Node 24+). A transient Next.js `Expected workStore to be initialized` error occurred while prerendering `/_not-found` in the local environment; a repeated build of the same source passed on Node 26.5.0. A Node-version cause has not been established.

## Behavior

- Long cards are prepared as one card per page; ordinary short cards retain the grid. Text and card order are preserved.
- Tables use at most four rows per page and a conservative line budget for longer cells. Every continuation repeats the original columns, title, lead, and footnote.
- Long covers and closing titles have smaller display-title variants. Body text gets more weight and room rather than being reduced to fit.
- Roadmaps put ordinal numbers inside the orbs and time labels outside them.
- Statements preserve explicit newlines. Closing slides optionally accept `action: { label, href }`, restricted to internal paths or HTTP(S).
- Hash changes select the displayed page, including continuation pages. Page labels identify the source slide and part.

`preparePitchDeck` works on the localized deck and does not change the source content. `Deck` also accepts an optional `pitchSlides` prop for the separate example route. The example's closing action links to the comparison page.

## Verification

`npm test` verifies source-copy preservation, table/card ordering, repeated table columns, pagination bounds, and unchanged short-card behavior.

To capture and inspect a running deck with the installed `agent-browser` CLI:

```sh
agent-browser --session review open http://localhost:3000/stress
node scripts/capture-review.mjs review 1920 1080
node scripts/capture-review.mjs review 1440 900
```

The script writes PNG captures and text-rectangle/image diagnostics under ignored `/review/`. The committed comparison previews are resized to 1280×720; the accompanying audit records refer to the original viewport captures.

## Limits

Content budgets are conservative heuristics, not a guarantee that arbitrary text fits. A single extremely long card, row, cell, or title can still exceed its page. The audit catches clipping in rendered pages; it does not prove that all layouts, languages, font fallback, accessibility conditions, or devices are covered. Portrait-phone reading and PDF/PPTX export are outside this change.
