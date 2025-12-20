# Operations — Backups & Retention (Template)

## Cel
Określić zasady kopii zapasowych i retencji danych dla produkcji (dla demo: brak persystencji = brak backupów).

## Zakres (produkcyjnie)
- konfiguracje integracji
- raporty i ustawienia dashboardu
- logi audytowe (jeśli wdrożone)

## Retencja (Template)
- Dane konta i rozliczeń: zgodnie z przepisami (min. [PLACEHOLDER])
- Dane operacyjne: [PLACEHOLDER]
- Dane z integracji: zgodnie z DPA, usunięcie do [PLACEHOLDER] dni

## Backupy (Template)
- Częstotliwość: [PLACEHOLDER]
- RPO/RTO: [PLACEHOLDER]
- Test restore: [PLACEHOLDER] (np. raz na kwartał)

## Usuwanie danych (Data Act / GDPR)
- eksport danych (CSV/JSON)
- procedura usunięcia: [PLACEHOLDER]
