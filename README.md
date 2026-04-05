# 📋 Formulaire Prospect No-Code — Guide de déploiement

## Pré-requis
- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit) — https://vercel.com
- Ton workspace Notion

---

## Étape 1 : Créer une intégration Notion

1. Va sur https://www.notion.so/profile/integrations
2. Clique **"Nouvelle intégration"**
3. Donne-lui un nom : `Formulaire Prospect`
4. Sélectionne ton workspace
5. Clique **"Envoyer"**
6. **Copie le "Secret d'intégration interne"** (commence par `ntn_...`) → c'est ta clé API

## Étape 2 : Connecter l'intégration à ta base

1. Ouvre ta base **📋 Prospects No-Code** dans Notion
2. Clique sur **"..."** (menu en haut à droite de la page)
3. Clique **"Connexions"** → **"Connecter à"** → cherche **"Formulaire Prospect"**
4. Confirme l'accès

## Étape 3 : Récupérer l'ID de ta base de données

1. Ouvre ta base **📋 Prospects No-Code** dans le navigateur
2. L'URL ressemble à : `https://www.notion.so/TON-WORKSPACE/d341867e742b47099e4beb9089db8872?v=...`
3. L'ID de la base = la partie entre le dernier `/` et le `?`
4. Dans ton cas c'est : `d341867e742b47099e4beb9089db8872`

## Étape 4 : Pousser sur GitHub

1. Crée un nouveau repo sur GitHub (ex : `formulaire-prospect`)
2. Clone-le en local
3. Copie tous les fichiers de ce dossier dedans :
   ```
   formulaire-prospect/
   ├── public/
   │   └── index.html
   ├── api/
   │   └── submit.js
   ├── package.json
   └── vercel.json
   ```
4. Pousse sur GitHub :
   ```bash
   git add .
   git commit -m "Formulaire prospect no-code"
   git push origin main
   ```

## Étape 5 : Déployer sur Vercel

1. Va sur https://vercel.com/new
2. Importe ton repo GitHub `formulaire-prospect`
3. **IMPORTANT** — Avant de déployer, ajoute les variables d'environnement :
   - Clique sur **"Environment Variables"**
   - Ajoute :
     - `NOTION_API_KEY` = ta clé d'intégration (`ntn_...`)
     - `NOTION_DATABASE_ID` = `d341867e742b47099e4beb9089db8872`
4. Clique **"Deploy"**

## Étape 6 : Tester

1. Vercel te donne une URL du type `https://formulaire-prospect.vercel.app`
2. Remplis le formulaire avec des données test
3. Vérifie que ça tombe dans ta base Notion

## C'est prêt ! 🎉

Tu peux maintenant partager ce lien :
- Dans tes emails
- En bio de tes réseaux sociaux
- Sur ton site feesdelia.com
- Dans tes messages de prospection

---

## Optionnel : Domaine personnalisé

Tu peux connecter un sous-domaine comme `formulaire.feesdelia.com` :
1. Dans Vercel → Settings → Domains
2. Ajoute `formulaire.feesdelia.com`
3. Suis les instructions DNS (ajouter un CNAME)
