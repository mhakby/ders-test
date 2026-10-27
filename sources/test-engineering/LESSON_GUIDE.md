# Test Engineering (CEN315) lesson card guide

The student knows almost nothing about test engineering yet and wants to learn *with* the questions:
read a short lesson before a set, then, after answering a question, open the card that explains exactly
that question's topic. The student reads English slowly, so every text exists in English **and** Turkish.

Each question set gets one lesson file. Lessons are written once from the same sources as the questions
and shown in the quiz app.

## Output
`sources/test-engineering/_lessons/<same base name as the question file>.json`
(e.g. `week01.json`, `book-ch05.json`, `tutorial-01.json`), UTF-8, valid JSON, 2-space indent:

```json
{
  "intro": {
    "en": "2–4 sentences: what this set is about and why it matters for a tester.",
    "tr": "Aynı içerik, doğal Türkçe."
  },
  "concepts": [
    {
      "id": "bva-variants",
      "title": { "en": "Boundary value analysis variants", "tr": "Sınır değer analizi çeşitleri" },
      "body": {
        "en": "Short explanation…\n\n- bullet\n- bullet\n\n**Example:** …",
        "tr": "Kısa açıklama…\n\n- madde\n- madde\n\n**Örnek:** …"
      },
      "source": "pp. 79–84"
    }
  ],
  "questions": {
    "1": { "concept": "bva-variants", "explanation_tr": "Sorunun İngilizce açıklamasının Türkçesi." },
    "2": { "concept": "…", "explanation_tr": "…" }
  }
}
```

- `concepts`: 5–10 cards per set, in teaching order (basics first). `id` is lowercase-kebab, unique in the file.
- `body`: about 80–200 English words per card. Markup allowed: blank line between paragraphs,
  lines starting with `- ` for bullets, `**bold**`, `*italic*`, and `` `code` `` (short identifiers/snippets only).
  No headings, tables or HTML. Formulas as plain text (`4n + 1`, `V(G) = e − n + 2p`).
- `source`: where the card's content comes from ("slides 9–11", "pp. 79–84", "article: Tips").
- `questions`: one entry for **every** question `n` in the matching question file
  (`sources/test-engineering/_questions/<name>.json`), keys are `n` as strings.
  - `concept`: the id of the card that explains what this question tests.
  - `explanation_tr`: faithful Turkish translation of that question's English `explanation`
    (you may add a few words of clarification; never change what it says).

## How to write the cards
1. Start from the questions: list what each question tests, then group those facts into cards. **Every fact a
   question needs must be explained in its card**, so a student who reads the card can answer the question.
   Do not reveal question-specific answers verbatim ("the answer to the triangle question is 15"); teach the
   rule/definition and, where useful, a *different* small worked example.
2. Beginner-first: each card opens with *what it is and why it matters* in one or two plain sentences, then the
   precise definition/rule, then a tiny example. Define every term the first time it appears.
3. Use only the sources of that set (slides for weeks; the book for book chapters; the article for the tutorial).
   No outside facts. Numbers, formulas and names must match the source exactly.
4. Where the slides and the book say different things about the same topic (e.g. which values boundary value
   analysis selects, coverage names like statement/branch vs C0/C1, cyclomatic formula), say so explicitly in
   the card ("The slides … ; the textbook …").
5. Keep each card self-contained and short; prefer bullets for lists, steps and comparisons.

## Turkish
- Natural, clear Turkish written for a student, not a word-for-word translation.
- The first time a technical term appears in a card, give the English term in parentheses:
  "sınır değer analizi (boundary value analysis)", "kapsam (coverage)", "saplama (stub)". Afterwards the Turkish
  term alone is fine. If there is no established Turkish term, keep the English one ("mock", "DD-path").
- Keep code, identifiers, formulas, numbers and names unchanged.
- Same meaning and the same facts as the English text — nothing added, nothing dropped.

## Check before finishing
- The file parses: `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>`
- Every question `n` has an entry; every `concept` id exists in `concepts`.
- Every card is used by at least one question or is a necessary basic for the set.
