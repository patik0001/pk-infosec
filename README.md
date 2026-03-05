# PK InfoSec — Sprint 1 MVP

Livrable visible immédiat avec 4 pages:
- Home (`index.html`)
- Services (`services.html`)
- About (`about.html`)
- Contact (`contact.html`)

## Aperçu rapide en local

Option 1 (Python):
```bash
python3 -m http.server 8080
```
Puis ouvrir: http://localhost:8080

Option 2 (Node):
```bash
npx serve .
```

## Backend V1 (Express)

Un backend a été ajouté dans `backend/` avec:

- `POST /api/contact`
- `POST /api/newsletter`
- validation/sanitization + rate limit + headers de sécurité
- stockage minimal local JSON sécurisé
- emails transactionnels (admin + accusé réception)

### Run backend en local

```bash
cd backend
cp .env.example .env
npm install
npm test
npm run dev
```

Détails: `backend/README.md`

## Note d’intégration Ghost

Le repo source était vide au moment de l’implémentation.
Ce MVP est livré en base statique pour validation visuelle immédiate.
Prochaine étape: convertir ces sections en templates Ghost (`home.hbs`, `page-services.hbs`, `page-about.hbs`, `page-contact.hbs`) selon le thème cible.
