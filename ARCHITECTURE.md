# 🏗️ Architecture LBE Schoolar

## Vue d'ensemble

LBE Schoolar est une application de gestion scolaire desktop construite avec une architecture **Electron + Next.js** utilisant le pattern **Nextron**. L'architecture sépare clairement le processus principal (backend) du processus de rendu (frontend) avec une communication sécurisée via IPC.

```
┌────────────────────────────────────────────────────────────────┐
│                    LBE Schoolar Architecture                   │
├────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    IPC     ┌────────────────────────────────┐ │
│  │   Main      │ ◄─────────►│         Renderer               │ │
│  │  (Backend)  │            │        (Frontend)              │ │
│  │             │            │                                │ │
│  │ • Electron  │            │ • Next.js                      │ │
│  │ • SQLite3   │            │ • React                        │ │
│  │ • Sequelize │            │ • Tailwind CSS                 │ │
│  │ • IPC       │            │ • Zustand                      │ │
│  └─────────────┘            │ • React Query                  │ │
│                             │ • shadcn/ui                    │ │
│                             └────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## 📁 Structure des dossiers

### Racine du projet
```
lbe-remake/
├── main/                    # Processus Electron principal
├── renderer/                # Application Next.js (frontend)
├── app/                     # Build de production
├── resources/               # Icônes et ressources
├── .vscode/                 # Configuration VS Code
├── package.json             # Dépendances et scripts
├── tsconfig.json           # Configuration TypeScript
├── electron-builder.yml    # Configuration packaging
└── README.md               # Documentation
```

## 🔧 Processus Principal (Main Process)

### Fichiers clés

#### `main/background.ts`
**Rôle** : Point d'entrée principal de l'application Electron
```typescript
// Responsabilités :
- Création et gestion de la fenêtre principale
- Configuration du menu application
- Gestion du cycle de vie de l'application
- Initialisation de la base de données
- Enregistrement des contrôleurs IPC
```

#### `main/preload.ts`
**Rôle** : Pont sécurisé entre le main et le renderer
```typescript
// Fonctionnalités :
- Exposition sécurisée des APIs IPC via contextBridge
- Définition des handlers pour les opérations utilisateur
- Validation des types pour la communication IPC
```

#### `main/lib/`
- **`sequelize.ts`** : Configuration de la connexion SQLite
- **`data-types.ts`** : Définition des modèles Sequelize
- **`selected-db.ts`** : Gestion de la sélection de base de données

#### `main/ipc/`
- **`channels.ts`** : Définition des canaux IPC
- **`USER/`** : Contrôleurs pour la gestion des utilisateurs
- **`DATABASE/`** : Contrôleurs pour les opérations de base de données
- **`index.ts`** : Enregistrement des contrôleurs

## 🎨 Processus de Rendu (Renderer Process)

### Architecture Next.js

#### Configuration
```javascript
// renderer/next.config.js
{
  output: 'export',           // Export statique pour Electron
  distDir: '../app',          // Build dans le dossier app/
  trailingSlash: true,        // URLs avec slash final
  images: { unoptimized: true } // Pas d'optimisation images
}
```

### Structure Frontend

#### `renderer/components/`
```
components/
├── ui/                      # Composants shadcn/ui réutilisables
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ...
├── charts/                  # Composants de graphiques
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── PieChart.tsx
│   └── README.md
└── ...                      # Autres composants métier
```

#### `renderer/features/`
Pattern **Feature-First** pour organiser le code métier :
```
features/
├── auth/                    # Authentification
│   ├── auth_types.ts
│   ├── auth_service.ts
│   ├── auth_VModel.ts
│   └── LoginButton.tsx
├── users/                   # Gestion des utilisateurs
│   ├── user_types.ts
│   ├── user_service.ts
│   ├── view/
│   │   └── user_form.tsx
│   └── ...
├── database/                # Gestion de base de données
│   ├── db_types.ts
│   ├── db_service.ts
│   └── DatabaseSelector.tsx
└── hello-world/             # Exemple de feature
```

#### `renderer/store/`
Gestion de l'état global avec **Zustand** :
```
store/
├── authStore.ts             # État d'authentification
├── userStore.ts             # État des utilisateurs
└── anneeStore.ts            # État des années scolaires
```

#### `renderer/pages/`
Pages Next.js avec routing statique :
```
pages/
├── index.tsx                # Page de connexion
├── home.tsx                 # Tableau de bord
├── admin/                   # Pages admin
├── start/                   # Pages secrétaire/professeur
└── _app.tsx                 # Layout principal
```

## 🔄 Communication IPC

### Architecture de communication

```
Renderer (Frontend)     ←→     Preload Script     ←→     Main Process
      │                        │                        │
      │                        │                        │
  React Hooks            contextBridge           Electron IPC
      │                        │                        │
      │                        │                        │
  window.ipc.user        Secure Exposure        SQLite/Sequelize
```

### Canaux IPC définis

#### `main/ipc/channels.ts`
```typescript
export const IPC_CHANNELS = {
  // Utilisateurs
  userCreate: 'user:create',
  userGetAll: 'user:getAll',
  userGetById: 'user:getById',
  userUpdate: 'user:update',
  userDelete: 'user:delete',
  userAuth: 'user:auth',
  
  // Base de données
  fileCreateDB: 'file:createDB',
  fileDeleteDB: 'file:deleteDB',
  fileGetSelectedDB: 'file:getSelectedDB',
  dbSync: 'db:sync',
  
  // Système
  helloGetMessage: 'hello:getMessage'
}
```

### Types de communication

#### 1. Appels simples (invoke)
```typescript
// Renderer
const result = await window.ipc.user.create(userData)

// Main Process
ipcMain.handle('user:create', async (event, userData) => {
  return await User.create(userData)
})
```

#### 2. Types sécurisés
```typescript
// Types partagés entre main et renderer
export interface UserType {
  id_user: string
  nom_user: string
  mdp: string
  role: string
}

export interface UserType_noMDP {
  id_user: string
  nom_user: string
  role: string
}
```

## 🗄️ Architecture Base de Données

### SQLite3 + Sequelize

#### Modèles définis dans `main/lib/data-types.ts`
```typescript
// Utilisateurs
export class User extends Model {
  id_user: number
  nom_user: string
  mdp: string
  role: 'admin' | 'professeur' | 'secretaire'
}

// Années scolaires
export class AnneeScolaire extends Model {
  id_anne: number
  libelle: string
}

// Élèves
export class Eleve extends Model {
  id_eleve: number
  matricule: string
  nom_eleve: string
  // ...
}

// Classes
export class Classe extends Model {
  id_classe: number
  nom_classe: string
  niveau: string
}

// Inscriptions
export class Inscription extends Model {
  id_inscription: number
  id_eleve: number
  id_classe: number
  id_annee: number
}

// Paiements
export class Paiement extends Model {
  id_paiement: number
  id_inscription: number
  id_type_frais: number
  montant: number
  date_paiement: Date
}

// Types de frais
export class TypeFrais extends Model {
  id_type_frais: number
  libelle: string
  detail: string
}

// Tarifs
export class Tarif extends Model {
  id_tarif: number
  id_classe: number
  id_annee: number
  id_type_frais: number
  montant_fixe: number
}
```

### Relations entre modèles
```typescript
// User → (pas de relations directes)
// AnneeScolaire → Inscription → Eleve
// Classe → Inscription → Eleve
// TypeFrais → Tarif → Classe
// TypeFrais → Paiement → Inscription
```

## 🎯 Patterns Architecturels

### 1. Feature-First Pattern
Organisation du code par fonctionnalité plutôt que par type :
```
✅ Bon : features/auth/, features/users/
❌ Mauvais : components/, services/, types/
```

### 2. Separation of Concerns
- **Main Process** : Logique métier, base de données, système
- **Renderer Process** : UI, état utilisateur, interactions
- **Preload Script** : Communication sécurisée

### 3. Type Safety
- TypeScript partout
- Types partagés entre main et renderer
- Validation Zod pour les formulaires
- Types stricts pour IPC

### 4. State Management
- **Zustand** pour l'état global client
- **React Query** pour le cache serveur
- **sessionStorage** pour la persistence
- **SQLite** pour la persistence permanente

## 🔐 Sécurité

### 1. Sécurité IPC
```typescript
// preload.ts - Exposition sécurisée
const handler = Object.freeze({
  user: {
    create: (userData) => ipcRenderer.invoke(IPC_CHANNELS.userCreate, userData)
  }
})

contextBridge.exposeInMainWorld('ipc', handler)
```

### 2. Validation des données
```typescript
// Zod schemas pour la validation
const userSchema = z.object({
  nom_user: z.string().min(1).max(100),
  mdp: z.string().min(6),
  role: z.enum(['admin', 'professeur', 'secretaire'])
})
```

### 3. Gestion des mots de passe
- Hashage avec bcrypt
- Pas de stockage en clair
- Séparation des types avec/sans mot de passe

## 🚀 Flux de données

### 1. Flux d'authentification
```
User Input → React Hook Form → Zod Validation → React Query → 
IPC → Main Process → SQLite → Response → Zustand Store → UI Update
```

### 2. Flux de gestion des données
```
UI Action → Service Function → IPC Handler → Sequelize Model → 
Database Operation → Response → Cache Update → UI Refresh
```

### 3. Flux de navigation
```
Login Success → Role Check → Route Selection → Page Load → 
Data Fetch → State Update → Render
```

## 🎨 Architecture UI

### 1. Component Architecture
```
Pages → Features → Components → UI
  ↓        ↓           ↓         ↓
Routes  Logic    Business   Shadcn/ui
```

### 2. Styling Architecture
- **Tailwind CSS v4** pour le styling
- **CSS Variables** pour les thèmes
- **shadcn/ui** pour les composants de base
- **Custom components** pour la logique métier

### 3. Theme System
```css
/* Variables CSS dans globals.css */
:root {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  /* ... */
}

.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  /* ... */
}
```

## 🔧 Configuration et Build

### 1. Configuration TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable"],
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "jsx": "preserve"
  }
}
```

### 2. Configuration Electron Builder
```yaml
# electron-builder.yml
appId: com.lbe.schoolar
productName: LBE Schoolar
directories:
  output: dist
files:
  - main/**
  - app/**
  - resources/**
```

### 3. Scripts de build
```json
{
  "scripts": {
    "dev": "nextron",
    "build": "nextron build",
    "build:all": "nextron build --win --x64 --ia32"
  }
}
```

## 🧪 Testing Strategy

### 1. Unit Tests
- Tests des services avec Jest
- Tests des composants React
- Tests des modèles Sequelize

### 2. Integration Tests
- Tests des contrôleurs IPC
- Tests de la communication main/renderer
- Tests de la base de données

### 3. E2E Tests
- Tests des flux utilisateur complets
- Tests de l'application Electron
- Tests de la persistance des données

## 📈 Performance

### 1. Optimisations
- **Code splitting** avec Next.js
- **Lazy loading** des composants
- **Memoization** avec React.memo
- **Cache** avec React Query

### 2. Database Optimizations
- **Indexes** sur les champs fréquemment recherchés
- **Connection pooling** avec Sequelize
- **Query optimization** avec includes

### 3. Build Optimizations
- **Tree shaking** avec Webpack
- **Minification** du code
- **Asset optimization**

## 🔮 Évolution de l'architecture

### 1. Scalabilité
- **Microservices** pour les fonctionnalités complexes
- **API REST** pour les communications externes
- **WebSocket** pour le temps réel

### 2. Maintenance
- **Documentation** automatique avec TypeDoc
- **Monitoring** avec des logs structurés
- **Error tracking** avec Sentry

### 3. Déploiement
- **Auto-update** avec Electron Updater
- **CI/CD** avec GitHub Actions
- **Distribution** automatisée

---

## 📚 Références

- [Electron Documentation](https://www.electronjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Nextron Documentation](https://github.com/saltyshiomix/nextron)
- [Sequelize Documentation](https://sequelize.org/docs)
- [Zustand Documentation](https://zustand-docs.vercel.app)
- [React Query Documentation](https://tanstack.com/query/latest)

---

*Cette documentation est maintenue à jour avec l'évolution de l'architecture. Pour toute question, contacter l'équipe de développement.*
