# MediFlow - Plateforme de Gestion Numérique des Médicaments

MediFlow est une plateforme sécurisée de gestion des prescriptions médicales utilisant la blockchain Hedera pour l'audit et la traçabilité.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Gestion des prescriptions** complète (CRUD)
- **Audit blockchain** avec Hedera Hashgraph
- **Interface moderne** avec React et Tailwind CSS
- **Base de données** SQLite avec Sequelize ORM
- **Rôles utilisateurs** : Médecin, Pharmacien, Livreur, Patient, Admin
- **API REST** complète et documentée

## 🛠️ Technologies

### Backend
- **Node.js** avec Express.js
- **SQLite** avec Sequelize ORM
- **JWT** pour l'authentification
- **Hedera SDK** pour la blockchain
- **bcryptjs** pour le hachage des mots de passe

### Frontend
- **React 18** avec Vite
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Axios** pour les requêtes API

## 📦 Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### 1. Cloner le projet
\`\`\`bash
git clone <repository-url>
cd mediflow
\`\`\`

### 2. Installation Backend
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Configuration Backend
Créer un fichier `.env` dans le dossier `backend` :
\`\`\`env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=mediflow-secret-key-2024-super-secure

# Hedera (optionnel - fonctionne en mode démo sans ces clés)
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
AUDIT_TOPIC_ID=0.0.123457
\`\`\`

### 4. Installation Frontend
\`\`\`bash
cd frontend
npm install
\`\`\`

## 🚀 Lancement

### Backend (Terminal 1)
\`\`\`bash
cd backend
npm start
\`\`\`
Le serveur démarre sur http://localhost:5000

### Frontend (Terminal 2)
\`\`\`bash
cd frontend
npm run dev
\`\`\`
L'application démarre sur http://localhost:5173

## 👥 Comptes de Démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Médecin | doctor@hospital.com | demo123 |
| Pharmacien | pharmacist@pharmacy.com | demo123 |
| Livreur | driver@delivery.com | demo123 |
| Patient | patient@email.com | demo123 |
| Admin | admin@mediflow.com | demo123 |

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Prescriptions
- `GET /api/prescriptions` - Liste des prescriptions
- `GET /api/prescriptions/:id` - Détails d'une prescription
- `POST /api/prescriptions` - Créer une prescription
- `PUT /api/prescriptions/:id` - Modifier une prescription
- `DELETE /api/prescriptions/:id` - Supprimer une prescription

### Santé
- `GET /api/health` - Vérification de l'état du serveur

## 🔐 Sécurité

- **Authentification JWT** avec expiration
- **Hachage des mots de passe** avec bcrypt
- **Validation des données** côté serveur
- **Audit blockchain** avec Hedera
- **Gestion des rôles** et permissions

## 🏗️ Architecture

\`\`\`
mediflow/
├── backend/
│   ├── controllers/     # Logique métier
│   ├── models/         # Modèles de données
│   ├── routes/         # Routes API
│   ├── services/       # Services (auth, etc.)
│   ├── hedera/         # Intégration Hedera
│   └── index.js        # Point d'entrée
├── frontend/
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── pages/      # Pages de l'application
│   │   ├── contexts/   # Contextes React
│   │   ├── services/   # Services API
│   │   └── App.jsx     # Composant principal
│   └── public/         # Fichiers statiques
└── README.md
\`\`\`

## 🐳 Docker

### Lancement avec Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

### Build manuel
\`\`\`bash
# Backend
cd backend
docker build -t mediflow-backend .

# Frontend
cd frontend
docker build -t mediflow-frontend .
\`\`\`

## 🧪 Tests

### Backend
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📈 Développement

### Scripts disponibles

#### Backend
- `npm start` - Démarrage production
- `npm run dev` - Démarrage développement avec nodemon
- `npm test` - Lancement des tests
- `npm run lint` - Vérification du code

#### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build
- `npm run lint` - Vérification du code

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

## 🔄 Changelog

### Version 1.0.0
- Authentification JWT complète
- CRUD prescriptions
- Intégration Hedera pour l'audit
- Interface utilisateur moderne
- Gestion des rôles utilisateurs
- API REST documentée

---

**MediFlow** - Révolutionner la gestion des médicaments avec la blockchain 🚀
