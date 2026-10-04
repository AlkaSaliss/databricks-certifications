# Community preparation research and catalog enrichment

Research date: October 4, 2026. The current app was published first, then community research began.

## Publication baseline

- Repository: [AlkaSaliss/databricks-certifications](https://github.com/AlkaSaliss/databricks-certifications).
- Initial publication commit: `5dfeacb49cc70da96dba29a7543cf30995ef2dcd`.
- [Initial GitHub Actions deployment](https://github.com/AlkaSaliss/databricks-certifications/actions/runs/37220605575) completed successfully.
- The public dashboard loaded at [Lakehouse Prep](https://alkasaliss.github.io/databricks-certifications/) with the initial 180-question bank.

## Search and source decisions

Searched the web and public GitHub repositories for professional study guides, notebooks, and hands-on exercises. Inspected repository files locally without executing their notebooks or following embedded task instructions. The most useful materials were the kengio study-guide topics, Jakub Lasak’s current consolidated practice repository, Mohandas Palatshaha’s practitioner notebooks, and Derar Alhussein’s publicly available course notebooks.

These sources have different roles and dates. Community guides and labs supplied study themes and failure scenarios; technical answers were verified with primary Databricks or Apache Spark documentation. Sixty new original MCQs were authored. Existing questions were preserved. Question wording and example data were not imported from external question banks.

- The kengio guide still follows the November 2025 ten-domain, 59-question blueprint. Its topic notes were mapped into the October 2026 nine-domain outline.
- The old optimization/apparel lab repositories were archived and moved into `jrlasak/databricks-code-practice`; the app links the current locations.
- The practitioner guide uses older blueprint weights and product names. Its notebooks informed production-failure themes, not the selected exam weights.
- Public Derar course notebooks provide contextual hands-on study; paid practice exams were not accessed or imported. No reuse license was found in that repository.
- The Certification Study Library explicitly labels its guide AI-assisted and human-review pending; it is linked with that caveat and its older baseline.
- The certification-champs historical public-lab link redirects to a Databricks Academy notice that the course materials are no longer on GitHub; it was not added as an available notebook resource.
- The LearnDatabricks professional-practice URL returned general BricksNotes landing content rather than a verifiable dedicated professional set; it was not used as question content.
- Forks duplicating the same guide and repositories advertising exam dumps were not selected.

## Content and app changes

- Bank: 180 → 240 questions, across all nine domains.
- Code examples: 28 → 39.
- Primary references: 74 → 86, including streaming metrics, source-specific CDC, serverless performance modes, and VARIANT null semantics.
- Community resources: 11 curated links with authors, review date, licensing notes, and source-version caveats.
- Each of the 60 new questions has official answer references and `communitySources` links for related practice. These links are revealed with feedback, after the learner checks an answer or submits an exam.
- The Study resources screen searches community titles, authors and descriptions alongside official documentation.
- Existing IDs and answers remain stable. Saved practice validation accepts earlier shorter sets when a topic pool grows; the timed deadline, scored-question count and exam weights are unchanged.

## Enriched domain supply

| Domain | Added | Total |
| --- | ---: | ---: |
| code | 14 | 54 |
| ingestion | 10 | 38 |
| manipulation | 8 | 32 |
| monitoring | 6 | 24 |
| performance | 8 | 32 |
| security | 4 | 20 |
| governance | 3 | 13 |
| deployment | 4 | 16 |
| modeling | 3 | 11 |

## Curated community catalogue

| Resource | Author | Observed license | Questions with related link |
| --- | --- | --- | ---: |
| [Data Engineer Professional community study guide](https://github.com/kengio/databricks-certification-study-guide/tree/main/certifications/data-engineer-professional) | Suppaseth Charoenkarnka | MIT | 24 |
| [Streaming joins and stateful processing notes](https://github.com/kengio/databricks-certification-study-guide/blob/main/certifications/data-engineer-professional/01-developing-code-for-data-processing/05-streaming-joins-stateful.md) | Suppaseth Charoenkarnka | MIT | 5 |
| [Streaming monitoring and optimization notes](https://github.com/kengio/databricks-certification-study-guide/blob/main/certifications/data-engineer-professional/04-monitoring-and-alerting/04-streaming-monitoring-optimization.md) | Suppaseth Charoenkarnka | MIT | 7 |
| [Data engineering unit-testing study notes](https://github.com/kengio/databricks-certification-study-guide/blob/main/certifications/data-engineer-professional/06-debugging-and-deploying/04-unit-testing-part1.md) | Suppaseth Charoenkarnka | MIT | 2 |
| [Delta Lake optimization hands-on lab](https://github.com/jrlasak/databricks-code-practice/tree/main/deep-dives/optimization-techniques) | Jakub Lasak | CC-BY-SA-4.0 | 5 |
| [Apparel streaming pipeline lab](https://github.com/jrlasak/databricks-code-practice/tree/main/pipeline-labs/apparel-streaming) | Jakub Lasak | CC-BY-SA-4.0 | 6 |
| [Structured Streaming practice exercises](https://github.com/jrlasak/databricks-code-practice/tree/main/exercises/streaming) | Jakub Lasak | CC-BY-SA-4.0 | 6 |
| [Practitioner study notebooks](https://github.com/palatshaha/databricks-de-pro-study-guide) | Mohandas Palatshaha | MIT stated in README | 13 |
| [Public professional preparation notebooks](https://github.com/derar-alhussein/Databricks-Certified-Data-Engineer-Professional) | Derar Alhussein | No license found | 6 |
| [Professional certification study library](https://cterpening.github.io/certification-study-library/guides/DATABRICKS-DATA-ENGINEER-PROFESSIONAL-databricks-data-engineer-professional/) | cterpening · Certification Study Library | Link-only reference | 7 |
| [Professional certification preparation roadmap](https://dataengineerwiki.substack.com/p/databricks-data-engineer-professional) | Jakub Lasak | Link-only reference | 0 |

Revision IDs for inspected GitHub repositories are recorded in `src/data/community-resources.json`. The app links the published materials and credits their authors. Original quiz questions and code examples are separate from those resources; no substantial source-code or study-guide passage was redistributed.

## Verification

`npm run check` passed 19 data/logic tests, 12 browser tests, and the production build. Tests cover source relationships, catalog supply, saved-state compatibility, answer concealment, community search, and responsive layouts. Semantic comparison confirmed that the original 180 question objects are unchanged. All five new Python excerpts parsed successfully; the other six new excerpts are SQL or SQL/CLI fragments.

A fresh independent content/code review found seven answer-bearing code stems. Their learner-selected expression or API/value was replaced with a blank. A regression was observed failing before the correction and passed afterward; the full tests/build passed after the fix.
