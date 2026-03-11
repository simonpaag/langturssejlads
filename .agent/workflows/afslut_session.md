---
description: Afslutningsprocedure - Gem historik, Commit og Push alt arbejde
---

Når brugeren kører 'afslut_session' eller indikerer at arbejdet for i dag er slut, skal du eksekvere nedenstående trin. Dette sikrer at både kode og 'viden' overføres til fremtidige samtaler.

1. **Skriv Historik:** Start med at formulere et præcist resumé af sessionens største og vigtigste hændelser (f.eks "Implementerede aktivitetslogs", "Rettede layout i footer"). 
Skriv/tilføj herefter (ved brug af dit `write_to_file` / `replace_file_content` værktøj) sessionens dato og dette resumé ind i en fil i projektets rod: `CHANGELOG.md`. Hvis filen ikke findes, så opret den. Hver ny opdatering skal skrives ind **øverst** under titlen i filen, således at næste AI og bruger lynhurtigt kan læse historikken i filen, når en ny chat startes.

// turbo
2. Kør `git status` for at få overblik over ændrede filer.

// turbo
3. Kør `git add .` for at tilføje alle ændrede filer (inklusive CHANGELOG.md).

_VIGTIGT: Hvis du har lavet ændringer i backend/prisma/schema.prisma, skal du ALTID køre en manuel `db push` før du pusher koden:_
// turbo
4. Kør evt: `DATABASE_URL="postgresql://postgres:dyApAqGKOzJYYVZf@db.ctthpvrilheoiaxsktyu.supabase.co:5432/postgres" cd backend && npx prisma db push` (kun hvis relevant)

// turbo
5. Kør `git commit -m "feat/chore: [Din genererede beskrivelse af arbejdet]"`

// turbo
6. Kør `git push origin main`

// turbo
7. Kør `git status` igen for the sikre alt er rent.

Afslut ved at informere brugeren om, at loggen er skrevet, og koden er i skyen.
