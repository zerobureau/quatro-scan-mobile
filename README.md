# Application de Gestion de Factures Immobilières

Application web mobile-first permettant de capturer des factures et de les envoyer par courriel avec les informations des immeubles concernés.

## Fonctionnalités

- **Capture de fichiers** : Prenez une photo ou sélectionnez un fichier (PDF, images)
- **Sélection d'immeubles** : Interface multi-sélection avec recherche pour choisir les propriétés concernées
- **Envoi par email** : Envoi automatique des factures avec les détails des propriétés

## Configuration

### Variables d'environnement

Ajoutez les variables suivantes dans `.env` :

```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=votre-email@domaine.com
RESEND_TO_EMAIL=destinataire@domaine.com
```

Sur Netlify, configurez ces mêmes variables dans **Site settings > Environment variables**.

## Utilisation

### Workflow de l'application

1. **Étape 1 : Facture**
   - Prenez une photo ou sélectionnez un fichier
   - Formats acceptés : PDF, PNG, JPG, GIF, WebP
   - Taille max : 10MB

2. **Étape 2 : Propriétés**
   - Recherchez et sélectionnez les immeubles concernés
   - Multi-sélection avec recherche en temps réel
   - Affichage des compagnies associées à chaque adresse

3. **Étape 3 : Envoi**
   - Entrez l'adresse email du destinataire
   - Vérifiez le résumé
   - Envoyez la facture

## Architecture

### API Routes

- `GET /api/buildings` : Récupère la liste des immeubles depuis Airtable
- `POST /api/send-invoice` : Envoie la facture par email via Resend

### Composants

- `FileUpload` : Gestion de l'upload de fichiers avec drag & drop
- `BuildingSelector` : Sélecteur multi-choix avec recherche

## Technologies

- **Frontend** : Next.js 13 (App Router), React, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Immeubles** : Airtable (via API REST)
- **Email** : Resend
- **Upload** : react-dropzone

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
```

## Sécurité

- Les clés API ne sont jamais exposées côté client
- Validation des fichiers côté client et serveur
- Variables d'environnement pour toutes les valeurs sensibles
