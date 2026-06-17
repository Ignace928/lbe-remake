# Composants Charts Réutilisables

Ce dossier contient des composants de graphiques réutilisables basés sur Recharts, avec un style cohérent pour l'application LBE Schoolar.

## Composants disponibles

### LineChart
Graphique linéaire pour afficher des données chronologiques ou des tendances.

```typescript
import { LineChart } from '@/components/charts'

<LineChart
  data={data}
  lines={[
    { dataKey: 'valeur', name: 'Ventes' },
    { dataKey: 'objectif', name: 'Objectif' }
  ]}
  xAxisDataKey="mois"
  title="Évolution des ventes"
  titleColor="text-blue-400"
  height={300}
/>
```

### BarChart
Graphique à barres pour comparer des valeurs entre différentes catégories.

```typescript
import { BarChart } from '@/components/charts'

<BarChart
  data={data}
  bars={[
    { dataKey: 'inscrits', name: 'Inscrits' },
    { dataKey: 'diplomes', name: 'Diplômés' }
  ]}
  xAxisDataKey="classe"
  title="Résultats par classe"
  titleColor="text-emerald-400"
  layout="vertical" // ou "horizontal"
/>
```

### PieChart
Graphique circulaire pour afficher des proportions ou répartitions.

```typescript
import { PieChart } from '@/components/charts'

<PieChart
  data={data}
  dataKey="valeur"
  nameKey="categorie"
  title="Répartition des frais"
  titleColor="text-amber-400"
  colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
  showLegend={true}
/>
```

### AreaChart
Graphique en aires pour visualiser des données cumulées ou des tendances avec volume.

```typescript
import { AreaChart } from '@/components/charts'

<AreaChart
  data={data}
  areas={[
    { dataKey: 'revenus', name: 'Revenus' },
    { dataKey: 'depenses', name: 'Dépenses' }
  ]}
  xAxisDataKey="mois"
  title="Évolution financière"
  titleColor="text-violet-400"
  stackId="1"
/>
```

### CardChart
Conteneur stylisé pour envelopper les graphiques avec titre et description.

```typescript
import { CardChart, LineChart } from '@/components/charts'

<CardChart title="Statistiques des élèves" description="Année scolaire 2024-2025" titleColor="text-blue-400">
  <LineChart
    data={data}
    lines={[{ dataKey: 'effectif', name: 'Élèves' }]}
    xAxisDataKey="mois"
    height={250}
  />
</CardChart>
```

## Props communes

Tous les composants partagent des props similaires :

- `data`: Tableau de données à afficher
- `width` et `height`: Dimensions du graphique
- `title`: Titre optionnel du graphique
- `titleColor`: Couleur du titre (utilise les classes Tailwind)

## Couleurs du thème

Les composants utilisent les couleurs CSS définies dans `globals.css` :

```css
--chart-1: oklch(0.488 0.243 264.376);  // Bleu
--chart-2: oklch(0.696 0.17 162.48);   // Vert
--chart-3: oklch(0.769 0.188 70.08);   // Orange
--chart-4: oklch(0.627 0.265 303.9);   // Violet
--chart-5: oklch(0.645 0.246 16.439);  // Cyan
```

Utilisation dans les composants :
```typescript
stroke: 'hsl(var(--chart-1))'  // Utilise la couleur chart-1
fill: 'hsl(var(--chart-2))'   // Utilise la couleur chart-2
```

## Thème

Les composants utilisent un thème sombre cohérent :
- Fond : `#1f2937` (slate-800)
- Grille : `#374151` (slate-700)
- Texte : `#f3f4f6` (slate-100)
- Axes : `#9ca3af` (slate-400)

## Exemple d'utilisation complet

```typescript
import { CardChart, LineChart, BarChart, PieChart } from '@/components/charts'

export function DashboardPage() {
  const ventesData = [
    { mois: 'Jan', montant: 12000, objectif: 15000 },
    { mois: 'Fev', montant: 15000, objectif: 15000 },
    { mois: 'Mar', montant: 18000, objectif: 16000 },
  ]

  const categoriesData = [
    { categorie: 'Primaire', effectif: 120 },
    { categorie: 'Secondaire', effectif: 80 },
    { categorie: 'Lycée', effectif: 45 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CardChart title="Évolution des ventes" titleColor="text-blue-400">
        <LineChart
          data={ventesData}
          lines={[
            { dataKey: 'montant', name: 'Ventes' },
            { dataKey: 'objectif', name: 'Objectif' }
          ]}
          xAxisDataKey="mois"
          height={250}
        />
      </CardChart>

      <CardChart title="Effectifs par catégorie" titleColor="text-emerald-400">
        <BarChart
          data={categoriesData}
          bars={[{ dataKey: 'effectif', name: 'Élèves' }]}
          xAxisDataKey="categorie"
          height={250}
        />
      </CardChart>
    </div>
  )
}
```

## Avantages

- **Cohérence visuelle** : Utilise les couleurs définies dans le thème
- **Maintenabilité** : Changement centralisé des couleurs dans `globals.css`
- **Flexibilité** : Possibilité de surcharger les couleurs par composant
- **Accessibilité** : Couleurs optimisées pour le contraste
- **Thème unifié** : Tous les graphiques partagent la même palette
