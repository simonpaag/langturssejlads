# Changelog (Opdateringslog)

Dette dokument vedligeholdes af AI-assistenter via `/afslut_session` workflowet for at sikre kontinuitet, genkendelighed og overlevering mellem skiftende sessioner. Nyeste ændringer tilføjes altid øverst.

---

### [2026-03-16] - SEO og Indexeringsrettelser
- **Frontend & SEO:**
  - Tilføjet global `metadataBase` og default `canonical` tag i `layout.tsx`.
  - Håndteret "Soft 404" fejl ved at kaste rigtige 404 statuskoder med Next.js `notFound()` på dynamiske sider (`boats`, `posts`, `faq`, `profil`) i stedet for 200 OK med et fejlbesked UI.
  - Oprettet en visuel lækker global `not-found.tsx` der griber alle døde links.
  - Indsat `generateMetadata` metoder på alle dynamiske sidetræer for at sikre korrekte og specifikke `canonical` urls på hvert enkelt opslag/båd.



### [2026-03-15] - Forbedret Mobil Oplevelse
- **Frontend & Navigation:**
  - Omskrevet `Footer.tsx` til at være et klient-side komponent, der automatisk lytter på brugerens log-ind status.
  - Skjult footeren the indloggede brugere på mobilen, for the at give mere fokus the dashboardet uden unødvendigt scroll.


### [2026-03-15] - Audit Logging af Billede Uploads
- **Backend & Audit Logs:**
  - Opdateret `authController`, `boatController` og `postController` the at spore alle oprettelser og ændringer der indeholder billeder.
  - Oprettet dedikerede system events: `UPLOADED_PROFILE_IMAGE`, `UPLOADED_BOAT_IMAGE` og `UPLOADED_POST_IMAGE` som nu alle kan følges direkte fra systemets Audit Log.
  - Rettet en mangel i `postController` hvor der slet ikke var en grundlæggende `CREATED_POST` audit event tidligere, dette håndteres nu korrekt the the fange nye logbøger i administrationens oversigt.


### [2026-03-15] - Forbedring af mobilmenu & Navigation
- **Frontend & Navigation:**
  - Flyttet "Under Dæk" (dashboard-linket) fast ud i headeren for mobilvisning, så det altid er synligt ved siden af søgefeltet fremfor at være skjult i burgermenuen.
  - Tilføjet tekst til log-ind knappen ("Under Dæk (log ind)"), for at tydeliggøre funktionen og forbedre konverteringen for ikke-indloggede brugere.
  - Bevaret dashboard-undermenuen (Skriv Logbog, Indbakke mv.) inde i selve burgermenuen, når man er logget ind og befinder sig på dashboardet.


### [2026-03-11] - AI-Powered FAQ Editor & UI Fixes
- **Admin Dashboard & Integration:**
  - Oprettet et dedikeret AI-assistent panel ("Spørg Gemini") inde i Vidensbase & FAQ tabben.
  - Implementeret ny backend route (`/api/admin/ai/generate`) beskyttet af system-admin auth.
  - Tilknyttet `@google/genai` SDK'et til at lade Gemini 2.5 strukturere velformaterede HTML artikler på vegne af brugeren the direkte indsættelse i tekst-editoren.
  - **Forbedring:** Udvidet AI backend-kald med *System Instructions* the konversational forståelse, samt aktiveret *Google Search Grounding* så AI'en aktivt slår ny viden op The nettet.
- **Frontend & Navigation:**
  - Bygget og integreret `CookieBanner.tsx` som en "Consent Management" løsning. Google Analytics (GA4) er nu default blokeret, unless the besøgende aktivt klikker "Tillad Statistik".
  - Oprettet `ScriptsContainer` the nem integration af GTM, Meta Pixel osv.
  - Oprettet `/om/cookies` webside the transparens om cookies på platformen.
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
