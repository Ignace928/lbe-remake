<p align="center"><img src="https://i.imgur.com/a9QWW0v.png"></p>

# 🚀LBE Desktop NEXTRON 
Application web de gestion des élèves recréer avec Nextjs et 👉electron pour desktop
avec **Nextron**.

Mes Remerciement : *Yoshihide Shiono* <shiono.yoshihide@gmail.com>

## 📋 GUIDE D'INSTALLATION ET BUILD

### Create an App
0️⃣*J'utilise pnpm comme gestionnaire de paquet*
```
# with npx
$ npx create-nextron-app my-app --example with-tailwindcss

# with yarn
$ yarn create nextron-app my-app --example with-tailwindcss

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-tailwindcss
```
1️⃣En utilisant pnpm, on doit creer un fichier `.npmrc` : `echo node-linker=hoisted > .npmrc` dans la racine
**pourquoi?** -> pour resoudre les problèmes de système de fichier entre *Electron* et le *symlink* du pnpm

### Installation de tailwindcss v4
💥 Verifiez d'abord le package.json
```
{
    //...
    "next": "^14.2.4",
    tailwindcss: "3.x.x"
}
```
On peut mettre à jour les dépendance pour la stabilité, Mais suivant les règles suivant:
**NEXTRON**, plus precisement electron supporte mal avec les changements modernes comme `/app` router de **next 15**

**Tailwindcss v4** change de mode de configuration. Plus de `tailwind.config.js` tout passe par css

0️⃣ Mettre à jour tailwindcss
``` 
pnpm add tailwindcss@latest @tailwindcss/postcss@latest postcss@latest 
```

Dans `renderer/styles/globals.css` : 
```
@import "tailwindcss";

/* On indique à Tailwind où chercher tes classes */
@source "../pages/**/*.{ts,tsx,js,jsx}";
@source "../components/**/*.{ts,tsx,js,jsx}";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  body {
    @apply bg-gray-900 text-white;
  }
}

@layer components {
  .btn-blue {
    @apply text-white font-bold px-4 py-2 rounded bg-blue-600 hover:bg-blue-500;
  }
}

```

Creer ou modifier `postcss.config.mjs`: 
```
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```
1️⃣ On peut installer notre tailwindcss v4

```
# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install
```


#### Configuration Tailwind CSS v4
```bash
# Mettre à jour Tailwind si nécessaire
pnpm add tailwindcss@latest @tailwindcss/postcss@latest postcss@latest
```

#### 4. Configuration shadcn/ui


### Installation de shadcnUI
💥 Avec **Nextron**:  les fichiers Next.js sont cachés dans le dossier renderer/, le CLI de shadcn ne reconnaît pas la structure à la racine du projet
Il faut configurer manuellement:

```bash
# Créer components.json à la racine
cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "renderer/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
EOF
```

2️⃣ Creer le fichier utilitaire `renderer/lib/utils.ts`
```
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```


### 🎯 Prérequis système

#### Windows (obligatoire pour SQLite3)
```bash
# 1. Installer Visual Studio Build Tools
# Télécharger depuis : https://visualstudio.microsoft.com/visual-cpp-build-tools/
# OU via Visual Studio Installer :
# - Cocher "Desktop development with C++"
# - Cocher "Windows 10 SDK" (dernière version)
# - Cocher "MSVC v143 - VS 2022 C++ x64/x86 build tools"

# 2. Installer Python (requis par node-gyp)
# Télécharger depuis : https://www.python.org/downloads/
# Version 3.8+ recommandée

# 3. Installer chocolatey (optionnel, pour faciliter les installations)
# PowerShell (en tant qu'administrateur) :
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 4. Installer les dépendances avec chocolatey
choco install python visualstudio2022buildtools
```

#### macOS
```bash
# 1. Installer Xcode Command Line Tools
xcode-select --install

# 2. Installer Homebrew (si non déjà installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Installer Python et autres dépendances
brew install python
```

#### Linux (Ubuntu/Debian)
```bash
# 1. Installer les dépendances de build
sudo apt-get update
sudo apt-get install -y build-essential python3 python3-pip

# 2. Installer node-gyp globalement
sudo npm install -g node-gyp
```

### 📦 Dépendances du projet

#### Framework et Runtime
- **nextron**: `^9.5.0` - Framework Electron + Next.js
- **electron**: `^34.0.0` - Runtime application desktop
- **next**: `^14.2.4` - Framework React
- **react**: `^18.3.1` - Bibliothèque UI
- **react-dom**: `^18.3.1` - DOM React

#### Base de données et ORM
- **sqlite3**: `^5.1.7` - Base de données native (nécessite build tools)
- **sequelize**: `^6.37.7` - ORM pour SQLite

#### UI et Styling
- **tailwindcss**: `^4.1.18` - Framework CSS
- **@tailwindcss/postcss**: `^4.1.18` - PostCSS pour Tailwind v4
- **@radix-ui/***: Composants UI accessibles
  - `react-alert-dialog`: `^1.1.15`
  - `react-avatar`: `^1.1.11`
  - `react-popover`: `^1.1.15`
  - `react-progress`: `^1.1.8`
  - `react-scroll-area`: `^1.2.10`
  - `react-select`: `^2.2.6`
  - `react-slot`: `^1.2.4`
  - `react-switch`: `^1.2.6`
- **lucide-react**: `^0.563.0` - Icônes
- **framer-motion**: `^12.34.3` - Animations
- **next-themes**: `^0.4.6` - Thèmes

#### Formulaires et Validation
- **react-hook-form**: `^7.71.2` - Gestion formulaires
- **@hookform/resolvers**: `^5.2.2` - Intégration Zod
- **zod**: `^4.3.6` - Validation TypeScript

#### État et Données
- **zustand**: `^5.0.11` - État global
- **@tanstack/react-query**: `^5.90.21` - Gestion serveur
- **@tanstack/react-table**: `^8.21.3` - Tableaux
- **electron-store**: `^8.2.0` - Stockage Electron

#### Utilitaires
- **clsx**: `^2.1.1` - Classes CSS conditionnelles
- **tailwind-merge**: `^3.4.0` - Fusion classes Tailwind
- **class-variance-authority**: `^0.7.1` - Variants composants
- **date-fns**: `^4.1.0` - Manipulation dates
- **sonner**: `^2.0.7` - Notifications toast
- **react-day-picker**: `^9.13.2` - Calendrier

#### Graphiques et Export
- **recharts**: `2.15.4` - Graphiques React
- **@react-pdf/renderer**: `^4.3.2` - Génération PDF

#### Développement
- **typescript**: `^5.7.3` - TypeScript
- **@types/node**: `^20.11.16` - Types Node.js
- **@types/react**: `^18.2.52` - Types React
- **autoprefixer**: `^10.4.19` - Préfixes CSS
- **postcss**: `^8.5.6` - Post-processeur CSS
- **electron-builder**: `^24.13.3` - Packaging Electron

### 🚀 Installation complète

#### 1. Clonage et installation
```bash
# Cloner le projet
git clone <url-du-projet>
cd lbe-remake

# Installer les dépendances
npm install

# Ou avec yarn
yarn install

# Ou avec pnpm (recommandé)
pnpm install
```

#### 2. Configuration pnpm (si utilisé)
```bash
# Créer .npmrc à la racine
echo "node-linker=hoisted" > .npmrc

# Pourquoi? Résout les problèmes de système de fichier entre Electron et les symlinks pnpm
```


### 🔧 Scripts de build et développement

#### Scripts disponibles
```bash
# Développement
npm run dev              # Démarrer en mode développement
npm run dev:ts           # Vérification TypeScript

# Build
npm run build            # Build standard
npm run build:32         # Build 32-bit Windows
npm run build:all         # Build toutes architectures Windows

# Post-installation (automatique)
npm run postinstall       # Installation dépendances Electron
```

### 🐛 Résolution des problèmes courants

#### Erreurs SQLite3 sur Windows
**Symptôme** : `Error: Cannot find module 'sqlite3'` ou `gyp ERR!`

**Solutions :**
```bash
# 1. Nettoyer les caches
npm cache clean --force
rm -rf node_modules .next dist

# 2. Réinstaller
npm install

# 3. Si erreur persiste
npm rebuild sqlite3 --force
```

#### Build Tools Visual Studio
**Symptôme** : `MSB4011: Visual Studio Build Tools not found`

**Installation complète :**
```bash
# Via Chocolatey (recommandé)
choco install visualstudio2022buildtools

# Manuel : Télécharger depuis https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

#### Erreurs de permissions
**Symptôme** : `EACCES: permission denied`

**Solutions :**
```bash
# PowerShell en tant qu'administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Réinstaller avec permissions
npm install --force
```

### 📋 Vérification de l'environnement

#### Script de diagnostic
```bash
# Vérifier Node.js et npm
node --version
npm --version

# Vérifier Python
python --version

# Vérifier build tools (Windows)
where g++

# Vérifier build tools (Linux/macOS)
which gcc
```

#### Test de build
```bash
# Test complet
npm run build

# Test développement
npm run dev
```

