---
description: Afslutningsprocedure - Commit og Push alt arbejde
---
Når brugeren indikerer at en session eller en større opgave er ved at være færdig, eller du selv vurderer at det er tid til at "lukke ned" og aflevere, skal du altid følge disse trin for at sikre at intet arbejde går tabt lokalt:

// turbo
1. Kør `git status` for at få overblik over ændrede filer.
// turbo
2. Kør `git add .` (eller tilføj specifikt) for at stage alle relevante ændringer og nye filer.

_VIGTIGT: Hvis du har lavet ændringer i `schema.prisma`, skal du ALTID køre en manuel `db push` før du pusher koden, da det automatiske CI/CD build script hos Render er deaktiveret grundet RAM problemer. Brug den direkte DB-forbindelse:_
// turbo
3. Kør `DATABASE_URL="postgresql://postgres:dyApAqGKOzJYYVZf@db.ctthpvrilheoiaxsktyu.supabase.co:5432/postgres" cd backend && npx prisma db push` (IKKE nødvendigt hvis schemaet er urørt).

// turbo
4. Kør `git commit -m "feat/fix/chore: [beskrivelse af hele sessionens arbejde]"`
// turbo
5. Kør `git push origin main` for at sende det hele afsted til remote repo, og derved udløse automatisk deploy (f.eks. på Render eller Vercel).
// turbo
6. Kør `git status` igen for at bekræfte at "branch is up to date".

Når proceduren er fuldført, informér brugeren om at arbejdet er gemt sikkert i skyen og deploy er sat i gang.
