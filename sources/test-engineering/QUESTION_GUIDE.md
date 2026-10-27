# Test Engineering (CEN315) question writing guide

Questions are for a computer engineering student preparing for a multiple-choice midterm/final in English.
They are generated once from the course slides and shown in a quiz app.

## Input
- `sources/test-engineering/_text/weekNN.md`: slide text and speaker notes, one `## Slide N` section per slide.
- Slides marked `Slide images (read these for content): img/...` carry their content in images
  (paths are relative to `sources/test-engineering/_text/`). Open every listed image with the Read tool
  and use what it shows. For image-only decks (weeks 9–13) the images ARE the lecture.
- Use only these slides. Do not add facts from outside knowledge, even if true. If a slide only names a
  concept without explaining it, do not invent the explanation.

## Output
Write `sources/test-engineering/_questions/weekNN.json` (UTF-8, valid JSON, 2-space indent):

```json
{
  "week": 3,
  "title": "Advanced Unit Testing: TDD & Mocking",
  "questions": [
    {
      "n": 1,
      "prompt": "In TDD, what is the purpose of the \"red\" step?",
      "options": [
        "Write a failing test that specifies the next piece of behavior",
        "Refactor the production code while all tests stay green",
        "Write the minimum production code that makes the test pass",
        "Measure statement coverage of the new code",
        "Replace slow dependencies with mocks before writing tests"
      ],
      "explanation": "Red means writing a test that fails because the behavior does not exist yet; making it pass is the green step and cleaning up is refactor.",
      "slide": 7
    }
  ]
}
```

- `title`: the deck's topic as a short English title (no "Week N:" prefix).
- `n`: 1, 2, 3… in order. Never reuse or renumber once written.
- `options`: exactly 5. **`options[0]` is ALWAYS the correct answer.** The app shuffles options later,
  so position never matters to you.
- `explanation`: 1–2 English sentences: why the correct answer is right and, when useful, why the most
  tempting distractor is wrong. Refer to options by content, never by letter or position.
- `slide`: the slide number (from `## Slide N`) the answer is based on.

## Rules
1. Exactly one correct option; the other four must be clearly wrong according to the slides, not merely
   "less good". If two options could be defended, rewrite.
2. Forbidden: "All of the above", "None of the above", "Both A and B", any option that refers to other
   options, and letters/positions in explanations. Avoid "NOT"/"EXCEPT" questions unless the negation is
   written in capitals and the question is still unambiguous; use them rarely.
3. Distractors come from the same topic (preferably other terms from the same deck), are plausible, and
   have roughly the same length and grammatical form as the correct option. The correct option must not
   stand out by being longer, more precise or more hedged.
4. Mix of question types across the deck (roughly):
   - ~35% definition / recall of a key fact or term
   - ~25% distinguishing two related concepts (e.g. verification vs. validation, stub vs. mock)
   - ~25% short scenario / application (e.g. "a field accepts 1–100; which values does boundary value
     analysis select?", "which test type fits this situation?", compute coverage for a tiny snippet)
   - ~15% comparison / "which statement is true" about a slide's model, list or table
5. Cover the whole deck proportionally; every substantive slide should feed at least one question if it
   has testable content. Skip title, agenda, reading-list and pure decoration slides.
6. No two questions may test the same fact. Prompts should be self-contained (no "according to slide 5").
7. Keep prompts concise; code snippets may use `\n` line breaks and should stay short (≤ 8 lines).
8. Numbers, formulas, percentages and names must match the slide exactly.

## Textbook questions (Jorgensen, *Software Testing: A Craftsman's Approach*, 2nd ed.)
The midterm covers Parts I–III of this book (chapters 1–11, book pages 1–183) in addition to the slides.
The book is a scanned PDF rendered to images, two book pages per image:
`C:\Users\Mhakby\AppData\Local\Temp\claude\C--Users-Mhakby-ce-test\19bd1f74-9064-4863-9fcb-64dba499b848\scratchpad\book\pages\pNNN.png`.
Even page on the left half, odd page on the right half. Up to book page 49 (image p034), page *n* is on
`p{floor(n/2)+10}` (pages 4–5 are `p012.png`); the scan skips a few pages around p035, and from p036 (pages 56–57)
on, page *n* is on `p{floor(n/2)+8}` (page 183 is on `p099.png`). Always confirm with the printed page numbers in
the corners.

Output `sources/test-engineering/_questions/book-chNN.json`:

```json
{
  "chapter": 5,
  "title": "Boundary Value Testing",
  "questions": [
    { "n": 1, "prompt": "...", "options": ["correct", "...", "...", "...", "..."], "explanation": "...", "page": 81 },
    { "n": 2, "prompt": "...", "options": ["..."], "explanation": "...", "page": 95, "exercise": "3" }
  ]
}
```

- `page`: the printed book page the answer is based on (instead of `slide`).
- `exercise`: only for questions derived from the chapter's end-of-chapter **Exercises** section — the exercise
  number as printed. The instructor may reuse these exercises on the exam, so every exercise whose answer can be
  determined unambiguously from the chapter must produce at least one question (turn open "develop/compute" exercises
  into a question about the key result: e.g. the number of test cases, which classes/cases result, which value
  is correct). Skip only exercises that are purely open-ended opinion/essay tasks.
- All other rules above apply; "slides" means "book pages" here. Use only what the book says.
- Keep the book's own terminology and notation (e.g. its names for test case counts, coverage metrics, graph terms).

When done, re-read your file once against the slides: check that `options[0]` really is the answer, that
each distractor is wrong per the slides, and that the JSON parses
(`node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>`).
