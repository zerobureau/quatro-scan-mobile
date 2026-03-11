# Application de Gestion de Factures Immobilières

Application web mobile-first permettant de capturer des factures et de les envoyer par courriel avec les informations des immeubles concernés.

## Fonctionnalités

- **Capture de fichiers** : Prenez une photo ou sélectionnez un fichier (PDF, images)
- **Sélection d'immeubles** : Interface multi-sélection avec recherche pour choisir les propriétés concernées
- **Envoi par email** : Envoi automatique des factures avec les détails des propriétés

## Configuration

### 1. Variables d'environnement Supabase

Les variables Supabase sont déjà configurées dans `.env` :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 2. Configuration Airtable (optionnel)

Pour synchroniser les propriétés depuis Airtable, ajoutez dans `.env` :

```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

Les tables attendues dans Airtable :
- "Compte GL Jerzen Beleck"
- "Compte GL Chakaboudi"
- "Compte GL Patchak"
- "Compte GL Quatro"

Chaque table doit avoir une colonne "Adresse de la propriété".

### 3. Configuration Resend

Pour l'envoi d'emails, ajoutez dans `.env` :

```
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=votre-email@domaine.com
RESEND_TO_EMAIL=destinataire@domaine.com
```

## Utilisation

### Synchroniser les données Airtable

Pour synchroniser les propriétés depuis Airtable vers Supabase :

```bash
curl -X POST http://localhost:3000/api/sync-airtable
```

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

### Base de données

Table `properties` dans Supabase :
- `id` : UUID unique
- `address` : Adresse de la propriété
- `company` : Nom de la compagnie
- `gl_account` : Compte GL (optionnel)
- `created_at` / `updated_at` : Timestamps

### API Routes

- `POST /api/sync-airtable` : Synchronise les données depuis Airtable
- `GET /api/properties` : Récupère la liste des propriétés
- `POST /api/send-invoice` : Envoie la facture par email

### Composants

- `FileUpload` : Gestion de l'upload de fichiers avec drag & drop
- `PropertySelector` : Sélecteur multi-choix avec recherche

## Technologies

- **Frontend** : Next.js 14 (App Router), React, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
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

# Démarrer en production
npm start
```

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Validation des fichiers côté client et serveur
- Variables d'environnement pour les clés sensibles

## Notes

- L'application est optimisée pour une utilisation mobile-first
- Les propriétés avec la même adresse sont regroupées automatiquement
- Toutes les adresses sont dédupliquées dans l'interface utilisateur
