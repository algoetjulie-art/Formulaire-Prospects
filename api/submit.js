const { Client } = require("@notionhq/client");

const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;

// Mapping form labels → Notion select values
const FRUSTRATION_MAP = {
  "Je perds du temps sur des tâches que je pourrais déléguer ou simplifier": "Tâches à simplifier",
  "J'ai du mal à suivre mon activité (clients, commandes, chiffres…)": "Suivi activité difficile",
  "Je bricole avec plein d'outils qui ne communiquent pas entre eux": "Outils non connectés",
  "Je fais trop de choses manuellement et ça me freine": "Trop de manuel",
  "J'aimerais offrir une meilleure expérience à mes clients": "Expérience client",
  "Je n'ai pas de vue claire sur ce qui fonctionne ou pas dans mon business": "Manque de visibilité",
  "Je me sens bloqué·e par la technique": "Bloqué par la technique",
};

const ESSAYE_MAP = {
  "Non, je ne sais pas par où commencer": "Non - ne sait pas par où commencer",
  "Oui, avec un dev mais c'était cher": "Oui - avec un dev (cher)",
  "Oui, j'ai testé des outils seul·e": "Oui - testé seul·e",
  "Oui, avec un·e freelance/VA": "Oui - avec freelance/VA",
};

const PROJET_MAP = {
  "Créer un site web ou une app": "Site web / app",
  "Automatiser des tâches (emails, relances, data…)": "Automatisation",
  "Construire un outil interne (CRM, dashboard, suivi…)": "Outil interne",
  "Connecter mes outils entre eux": "Connecter outils",
  "Créer un espace client / portail": "Espace client",
  "Je ne sais pas encore, j'ai besoin de conseil": "Besoin de conseil",
};

const URGENCE_MAP = {
  "C'est urgent — maintenant": "Urgent — maintenant",
  "Dans le mois": "Dans le mois",
  "Dans les 3 prochains mois": "Dans les 3 mois",
  "Pas de deadline, je me renseigne": "Pas de deadline",
};

function mapMulti(arr, map) {
  return (arr || []).map((v) => ({ name: map[v] || v }));
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const data = req.body;

    const properties = {
      "Prénom": { title: [{ text: { content: data.prenom || "" } }] },
      "Email": { email: data.email || null },
      "Secteur": data.activite ? { select: { name: data.activite } } : undefined,
      "Secteur (précision)": { rich_text: [{ text: { content: data.activite_autre || "" } }] },
      "Rôle": data.role ? { select: { name: data.role } } : undefined,
      "Rôle (précision)": { rich_text: [{ text: { content: data.role_autre || "" } }] },
      "Taille entreprise": data.taille ? { select: { name: data.taille } } : undefined,
      "Frustrations": { multi_select: mapMulti(data.frustrations, FRUSTRATION_MAP) },
      "Tâches chronophages": { rich_text: [{ text: { content: data.taches_chronophages || "" } }] },
      "Déjà essayé": data.deja_essaye
        ? { select: { name: ESSAYE_MAP[data.deja_essaye] || data.deja_essaye } }
        : undefined,
      "Type de projet": { multi_select: mapMulti(data.type_projet, PROJET_MAP) },
      "Urgence": data.urgence
        ? { select: { name: URGENCE_MAP[data.urgence] || data.urgence } }
        : undefined,
      "Commentaire": { rich_text: [{ text: { content: data.commentaire || "" } }] },
    };

    // Remove undefined properties
    Object.keys(properties).forEach((key) => {
      if (properties[key] === undefined) delete properties[key];
    });

    await notion.pages.create({
      parent: { database_id: NOTION_DB_ID },
      properties,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Notion API error:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi vers Notion" });
  }
};
