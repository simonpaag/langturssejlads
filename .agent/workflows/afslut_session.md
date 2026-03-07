---
description: Afslutningsprocedure - Commit og Push alt arbejde
---
Når brugeren indikerer at en session eller en større opgave er ved at være færdig, eller du selv vurderer at det er tid til at "lukke ned" og aflevere, skal du altid følge disse trin for at sikre at intet arbejde går tabt lokalt:

// turbo
1. Kør `git status` for at få overblik over ændrede filer.
// turbo
2. Kør `git add .` (eller tilføj specifikt) for at stage alle relevante ændringer og nye filer.
// turbo
3. Kør `git commit -m "feat/fix/chore: [beskrivelse af hele sessionens arbejde]"`
// turbo
4. Kør `git push origin main` for at sende det hele afsted til remote repo, og derved udløse automatisk deploy (f.eks. på Render eller Vercel).
// turbo
5. Kør `git status` igen for at bekræfte at "branch is up to date".

Når proceduren er fuldført, informér brugeren om at arbejdet er gemt sikkert i skyen og deploy er sat i gang.
