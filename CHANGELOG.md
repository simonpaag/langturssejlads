# Changelog (Opdateringslog)

Dette dokument vedligeholdes af AI-assistenter via `/afslut_session` workflowet for at sikre kontinuitet, genkendelighed og overlevering mellem skiftende sessioner. Nyeste ændringer tilføjes altid øverst.

---

### [2026-03-11] - AI-Powered FAQ Editor & UI Fixes
- **Admin Dashboard & Integration:**
  - Oprettet et dedikeret AI-assistent panel ("Spørg Gemini") inde i Vidensbase & FAQ tabben.
  - Implementeret ny backend route (`/api/admin/ai/generate`) beskyttet af system-admin auth.
  - Tilknyttet `@google/genai` SDK'et til at lade Gemini 2.5 strukturere velformaterede HTML artikler på vegne af brugeren the direkte indsættelse i tekst-editoren.
  - **Forbedring:** Udvidet AI backend-kald med *System Instructions* the konversational forståelse, samt aktiveret *Google Search Grounding* så AI'en aktivt slår ny viden op The nettet.
- **Frontend & Navigation:**
  - Løst manglende side-navigation på mobilvisninger ved at indkode 'Både', 'Togter' og 'Vidensbase' links direkte i hamburgermenuens struktur (med flotte Lucide-ikoner for at bevare designlinjen).



### [2026-03-11] - Notification Center & Smårettelser
- **Admin Dashboard:**
  - Ombygget Notification Center emails til et kompakt List View hvor skabeloner vises mere overskueligt.
  - Tilføjet inline Editor til skabeloner, via "Rediger" knap, der åbner i en ny accordion block.
  - Integreret to faneblade i editoren: **HTML Kode** (til at taste tags og templates) og **Vis Forhåndsvisning** (som render HTML live og ser det udenfor kildekoden).
- **Frontend & Gastesider:**
  - Fjernet uønsket/grå og fastlåst hardcoded placeholder-tekst under brugernavnet på `Profil` siden.


### [2026-03-11] - Global Aktivitetslog & Velkomstmail
- **Nye Funktioner:**
  - Implementeret automatisk velkomstmail via Resend (i `authController`), der sendes i det øjeblik en ny bruger opretter sig.
  - Aktiveret overvågning (AuditLog) i databasen via ny hjælpe-util `logAction`. Der logges nu for kritiske hændelser som registreret login, togt-oprettelser, og rettelser på både/profiler.
- **Admin Dashboard:**
  - Omskrevet `LogsTab` i PosseidonAdmin fra tre kolonner til ét samlet, kronologisk, filtrerbart aktivitets-feed ('Alle', 'Platform', 'Mails', 'Kildekode') der fletter systemlogs, email-outbox og Git commits.
- **Workflows:**
  - Opdateret `/afslut_session` workflowet med et automatisk skridt til at føde dags-resumeer ind i denne fil.
