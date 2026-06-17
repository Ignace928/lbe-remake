# Synchronisation du modèle Élève - Backend ↔ Renderer

## 🔧 Corrections apportées

### 1. **Backend - Types IPC** (`/main/ipc/ELEVE/eleve.Type.ts`)
- ✅ Ajout du champ `matricule` dans `EleveType`
- ✅ Suppression du champ `matricule` de `EleveUpdateType` (géré par le backend)
- ✅ Conservation du champ `id_eleve` optionnel dans `EleveCreateType` pour premier élève

### 2. **Backend - Controller** (`/main/ipc/ELEVE/eleve.controller.ts`)
- ✅ Correction des noms de champs dans la réponse UPDATE
- ✅ Génération automatique du matricule dans CREATE et UPDATE
- ✅ Format matricule: `ID + Sexe/AA` (ex: `123M/24`)

### 3. **Backend - Data Types** (`/main/lib/data-types.ts`)
- ✅ Correction du type `id_annee` de `INTEGER` vers `UUID` dans `Inscription` et `Tarif`
- ✅ Mise à jour des types publics des modèles
- ✅ Cohérence des clés étrangères avec `AnneeScolaire`

### 4. **Renderer - Types** (`/renderer/features/eleves/eleve_types.ts`)
- ✅ Ajout du champ `matricule` dans `eleveSchema`
- ✅ Suppression de `matricule` des champs de création (géré par backend)
- ✅ Mise à jour de `BackendEleveResponse` avec les bons noms de champs
- ✅ Suppression des champs obsolètes (`bapteme`, `pere`, `mere`, `tel`, etc.)

### 5. **Renderer - Service** (`/renderer/features/eleves/eleve.service.ts`)
- ✅ Ajout du champ `matricule` dans la conversion backend→frontend
- ✅ Gestion du matricule retourné par le backend

### 6. **Renderer - Formulaire** (`/renderer/features/eleves/view/eleve_form.tsx`)
- ✅ Suppression de la génération de matricule dans le frontend
- ✅ Suppression du champ matricule en lecture seule
- ✅ Conservation du champ `id_eleve` pour premier étudiant uniquement
- ✅ Simplification des valeurs par défaut

### 7. **Renderer - Colonnes** (`/renderer/features/eleves/view/eleve_columns.tsx`)
- ✅ Utilisation directe du champ `matricule` depuis le backend
- ✅ Suppression de la logique de génération de matricule
- ✅ Simplification du filtrage sur matricule

## 🔄 Flux de données

### **Création d'un élève**
1. **Frontend**: Envoie les données SANS matricule
2. **Backend**: Génère automatiquement le matricule `ID+Sexe/AA`
3. **Backend**: Sauvegarde avec matricule généré
4. **Backend**: Retourne l'élève complet AVEC matricule
5. **Frontend**: Affiche le matricule retourné

### **Mise à jour d'un élève**
1. **Frontend**: Envoie les données SANS matricule
2. **Backend**: Recalcule le matricule si nécessaire
3. **Backend**: Met à jour avec nouveau matricule
4. **Backend**: Retourne l'élève complet AVEC matricule
5. **Frontend**: Affiche le matricule mis à jour

## 📋 Champs synchronisés

### **Backend → Frontend**
```typescript
interface Eleve {
  id_eleve: number
  matricule: string          // ✅ Géré par backend
  nom_eleve: string
  post_nom_eleve?: string
  sexe: 'M' | 'F'
  date_naissance: string
  lieu_naissance?: string
  nationalite?: string
  adresse?: string
  telephone?: string
  email?: string
  nom_pere?: string
  nom_mere?: string
  profession_pere?: string
  profession_mere?: string
  etat: 'Actif' | 'Inactif'
  maladie?: string
  taille: number
  created_at: Date
}
```

### **Frontend → Backend (Création)**
```typescript
interface CreateEleve {
  id_eleve?: number         // Optionnel, premier élève seulement
  // matricule non inclus    // ❌ Géré par backend
  nom_eleve: string
  post_nom_eleve?: string
  sexe: 'M' | 'F'
  date_naissance: string
  lieu_naissance?: string
  nationalite?: string
  adresse?: string
  telephone?: string
  email?: string
  nom_pere?: string
  nom_mere?: string
  profession_pere?: string
  profession_mere?: string
  etat?: 'Actif' | 'Inactif'
  maladie?: string
  taille?: number
}
```

### **Frontend → Backend (Mise à jour)**
```typescript
interface UpdateEleve {
  // matricule non inclus    // ❌ Géré par backend
  nom_eleve?: string
  post_nom_eleve?: string
  sexe?: 'M' | 'F'
  date_naissance?: string
  lieu_naissance?: string
  nationalite?: string
  adresse?: string
  telephone?: string
  email?: string
  nom_pere?: string
  nom_mere?: string
  profession_pere?: string
  profession_mere?: string
  etat?: 'Actif' | 'Inactif'
  maladie?: string
  taille?: number
}
```

## 🚀 Avantages de cette approche

1. **Centralisation**: Le matricule est généré par une seule source (backend)
2. **Cohérence**: Pas de conflit entre matricule généré frontend et backend
3. **Simplification**: Moins de logique dans le frontend
4. **Maintenabilité**: Changement du format de matricule = modification backend uniquement
5. **Intégrité**: Le backend garantit l'unicité des matricules

## ⚠️ Points d'attention

- Le champ `id_eleve` n'est visible que pour le premier étudiant (table vide)
- Le matricule est généré automatiquement par le backend
- Le format du matricule peut être modifié dans le backend uniquement
- Les types `id_annee` sont maintenant des UUID pour cohérence avec `AnneeScolaire`

## ✅ Tests recommandés

1. **Création**: Vérifier la génération automatique du matricule
2. **Mise à jour**: Vérifier la recalculation du matricule
3. **Affichage**: Vérifier l'affichage correct du matricule dans le tableau
4. **Filtrage**: Vérifier le filtrage sur le matricule
5. **Premier élève**: Vérifier l'affichage du champ `id_eleve` pour le premier élève
