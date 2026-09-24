# Diff2000.github.io

Startside på https://diff2000.github.io med lenker til alle mine GitHub Pages-sider.

Listen hentes fra GitHub-API-et hver gang siden åpnes. Alle offentlige repoer med GitHub Pages aktivert tas med, uten gafler og arkiverte repoer. Et nytt Pages-repo dukker derfor opp automatisk.

- Lenken går til repoets *Website*-felt hvis det er satt, ellers til `https://diff2000.github.io/<repo>/`.
- Beskrivelsen er repoets *About*-tekst på GitHub.
- Private repoer vises ikke, siden API-et bare viser offentlige repoer uten innlogging.

## Kjøre lokalt

```bash
python -m http.server 3000
```
