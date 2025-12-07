<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>



## Run Locally

**Prerequisites:** Node.js (LTS recommended)

### Wymagane pakiety
- `react` `react-dom` `framer-motion` `lucide-react`
- `@types/node` `@vitejs/plugin-react` `typescript` `vite`

Wszystkie powyzsze zaleznosci sa skonfigurowane w `package.json` i instalowane jednym poleceniem `npm install`.

### Uruchomienie przez PowerShell

Gotowy do wklejenia blok PowerShell (uruchom go w katalogu projektu):

```powershell
Set-Location 'C:\Users\awisn\Desktop\www.papadata.pl'
npm install
# ustaw GEMINI_API_KEY w pliku .env.local przed uruchomieniem, np.:
# (edytuj .env.local i dodaj GEMINI_API_KEY=twoj_klucz)
npm run dev
```

1. Wgraj swoj klucz Gemini do [.env.local](.env.local) jako `GEMINI_API_KEY`.
2. `npm run dev` wlaczy serwer deweloperski.
