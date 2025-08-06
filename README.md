# MediFlow - Plateforme de Gestion Numérique des Médicaments

MediFlow est une plateforme complète de gestion des médicaments utilisant la blockchain Hedera pour l'audit et la sécurité. Elle permet aux médecins, pharmaciens, livreurs et patients de gérer efficacement les prescriptions médicales.

## 🚀 Fonctionnalités

- **🔐 Authentification sécurisée** avec JWT
- **🛡️ Audit blockchain** avec Hedera Hashgraph
- **👥 Gestion des rôles** (Médecin, Pharmacien, Livreur, Patient, Admin)
- **📋 Gestion des prescriptions** complète
- **📱 Interface responsive** moderne
- **🔄 API REST** complète
- **🗄️ Base de données** SQLite avec Sequelize

## 🏗️ Architecture

### Backend
- **Node.js** avec Express.js
- **SQLite** avec Sequelize ORM
- **JWT** pour l'authentification
- **Hedera SDK** pour l'audit blockchain
- **bcryptjs** pour le hachage des mots de passe

### Frontend
- **React 18** avec Vite
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Axios** pour les appels API
- **Context API** pour la gestion d'état

## 📦 Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### 1. Cloner le repository
\`\`\`bash
git clone <repository-url>
cd mediflow
\`\`\`

### 2. Installation du Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement dans .env
npm start
\`\`\`

### 3. Installation du Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🔧 Configuration

### Variables d'environnement Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_OPERATOR_KEY=your-private-key
AUDIT_TOPIC_ID=0.0.YOUR_TOPIC_ID
\`\`\`

### Variables d'environnement Frontend
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🎯 Utilisation

### Comptes de démonstration
- **Médecin**: `doctor@hospital.com` / `demo123`
- **Pharmacien**: `pharmacist@pharmacy.com` / `demo123`
- **Livreur**: `driver@delivery.com` / `demo123`
- **Patient**: `patient@email.com` / `demo123`
- **Admin**: `admin@mediflow.com` / `demo123`

### URLs d'accès
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔗 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Prescriptions
- `GET /api/prescriptions` - Liste des prescriptions
- `POST /api/prescriptions` - Créer une prescription
- `GET /api/prescriptions/:id` - Détails d'une prescription
- `PUT /api/prescriptions/:id` - Modifier une prescription
- `DELETE /api/prescriptions/:id` - Supprimer une prescription

## 🐳 Docker

### Démarrage avec Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

### Build des images individuelles
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

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **Helmet** pour la sécurité des headers HTTP
- **Rate limiting** pour prévenir les attaques
- **Validation** des données d'entrée
- **Audit blockchain** avec Hedera

## 🌐 Blockchain Hedera

MediFlow utilise Hedera Hashgraph pour:
- **Audit des actions** (création, modification de prescriptions)
- **Traçabilité** des opérations
- **Immutabilité** des logs
- **Transparence** des processus

## 📱 Rôles et Permissions

### Médecin
- Créer des prescriptions
- Modifier ses prescriptions
- Voir ses prescriptions

### Pharmacien
- Voir toutes les prescriptions
- Valider les prescriptions
- Préparer les médicaments

### Livreur
- Voir les prescriptions à livrer
- Mettre à jour le statut de livraison

### Patient
- Voir ses prescriptions
- Suivre le statut de ses médicaments

### Admin
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Statistiques et rapports

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement de production
2. Build du frontend: `npm run build`
3. Démarrer le backend: `npm start`
4. Servir le frontend avec nginx ou un CDN

### Variables d'environnement de production
\`\`\`env
NODE_ENV=production
JWT_SECRET=complex-production-secret
HEDERA_OPERATOR_ID=production-account-id
HEDERA_OPERATOR_KEY=production-private-key
\`\`\`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support:
- Email: support@mediflow.com
- Documentation: [docs.mediflow.com](https://docs.mediflow.com)
- Issues: [GitHub Issues](https://github.com/mediflow/issues)

## 🙏 Remerciements

- [Hedera Hashgraph](https://hedera.com) pour la technologie blockchain
- [React](https://reactjs.org) pour le framework frontend
- [Express.js](https://expressjs.com) pour le framework backend
- [Tailwind CSS](https://tailwindcss.com) pour le styling

---

**MediFlow** - Révolutionner la gestion des médicaments avec la blockchain 🚀
