# RPG V1

Første spillversjon av vektappen.

## Dette er med nå
- Hjemmeside med anime/eventyr-karakter og animerte ildfluer, blader og leirglød.
- Daglige quests: vekt, styrke, kondisjon, 10 000 skritt og vann.
- XP, levels, gull og tre stats: styrke, utholdenhet og disiplin.
- Ukentlig quest med styrkeøkter, aktive dager og kondisjon.
- Eventyrer-side med gear og oppgraderinger.
- Passiv leirbelønning som beregnes ut fra tiden siden sist du hentet gull.
- Gear påvirker XP, gull/time og hvor lenge offline-belønning kan lagres.
- Eksisterende Supabase-innveiinger, historikk, graf, mål og push-varsler er beholdt.
- Vekt er flyttet til siden Fremgang og blokkerer ikke lenger resten av appen.

## Viktig i V1
RPG-data (XP, gull, quests og gear) lagres i `localStorage` per innlogget bruker. Vektdata fortsetter å synkes med Supabase som før. Neste steg er å legge RPG-data i Supabase slik at også spillprogresjonen synkes mellom enheter.

## Publisering
Erstatt filene i GitHub-repoet med disse filene, commit og push. GitHub Pages bruker samme sti `/Vekt-app/` som før.
