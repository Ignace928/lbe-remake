import { DataTypes, Model, Sequelize } from 'sequelize'

<<<<<<< HEAD
// ─── USER ────────────────────────────────────────────────────────────────────
export class User extends Model {
  public id_user!: number
  public nom_user!: string
  public mdp!: string
  public role!: 'admin' | 'professeur' | 'secretaire'
=======
// Modèle USER
export class User extends Model {
  // Pas de champs publics pour éviter le conflit avec Sequelize
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom_user: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mdp: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'professeur', 'secretaire'),
        allowNull: false,
        defaultValue: 'secretaire',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'USERS',
      timestamps: false,
    }
  )
}

<<<<<<< HEAD
// ─── ANNEE SCOLAIRE ───────────────────────────────────────────────────────────
=======
// Modèle ANNEESCOLAIRE
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export class AnneeScolaire extends Model {
  public id_annee!: string
  public libelle!: string
}

export const initAnneeScolaire = (sequelize: Sequelize) => {
  AnneeScolaire.init(
    {
      id_annee: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      libelle: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'AnneeScolaire',
      tableName: 'ANNEESCOLAIRES',
      timestamps: false,
    }
  )
}

<<<<<<< HEAD
// ─── ELEVE ────────────────────────────────────────────────────────────────────
export class Eleve extends Model {
  public id_eleve!: number
  public matricule!: string
=======
// Modèle ELEVE
export class Eleve extends Model {
  public id_eleve!: number
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  public nom_eleve!: string
  public post_nom_eleve?: string
  public sexe!: 'M' | 'F'
  public date_naissance!: string
  public lieu_naissance?: string
  public nationalite?: string
  public adresse?: string
  public telephone?: string
  public email?: string
  public nom_pere?: string
  public nom_mere?: string
  public profession_pere?: string
  public profession_mere?: string
  public etat!: 'Actif' | 'Inactif'
  public maladie?: string
  public taille!: number
  public created_at!: Date
}

export const initEleve = (sequelize: Sequelize) => {
  Eleve.init(
    {
      id_eleve: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
<<<<<<< HEAD
      matricule: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      nom_eleve: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      post_nom_eleve: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sexe: {
        type: DataTypes.ENUM('M', 'F'),
        allowNull: false,
      },
      date_naissance: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lieu_naissance: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nationalite: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      adresse: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telephone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nom_pere: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nom_mere: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profession_pere: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profession_mere: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      etat: {
        type: DataTypes.ENUM('Actif', 'Inactif'),
        allowNull: false,
        defaultValue: 'Actif',
      },
      maladie: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      taille: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Eleve',
      tableName: 'ELEVES',
      timestamps: false,
    }
  )
}

<<<<<<< HEAD
// ─── CLASSE ───────────────────────────────────────────────────────────────────
=======
// Modèle CLASSE
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export class Classe extends Model {
  public id_classe!: number
  public nom_classe!: string
  public niveau!: string
<<<<<<< HEAD
  public delegue_1?: string | null
  public delegue_2?: string | null
  public meilleur_eleve?: string | null
  public titulaire?: string | null
=======
  public delegue_1!: number | null
  public delegue_2!: number | null
  public meilleur_eleve!: number | null
  public titulaire!: string | null
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}

export const initClasse = (sequelize: Sequelize) => {
  Classe.init(
    {
      id_classe: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom_classe: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      niveau: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      delegue_1: {
<<<<<<< HEAD
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      delegue_2: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      meilleur_eleve: {
        type: DataTypes.STRING(150),
        allowNull: true,
=======
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Eleve,
          key: 'id_eleve',
        },
      },
      delegue_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Eleve,
          key: 'id_eleve',
        },
      },
      meilleur_eleve: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Eleve,
          key: 'id_eleve',
        },
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      titulaire: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Classe',
      tableName: 'CLASSES',
      timestamps: false,
    }
  )
}

<<<<<<< HEAD
// ─── INSCRIPTION ──────────────────────────────────────────────────────────────
=======
// Modèle INSCRIPTION
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export class Inscription extends Model {
  public id_inscription!: number
  public id_classe!: number
  public id_eleve!: number
<<<<<<< HEAD
  public id_annee!: string
  public somme!: number
=======
  public id_annee!: number
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  public passant!: boolean
}

export const initInscription = (sequelize: Sequelize) => {
  Inscription.init(
    {
      id_inscription: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_classe: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: Classe, key: 'id_classe' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
=======
        references: {
          model: Classe,
          key: 'id_classe',
        },
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      id_eleve: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: Eleve, key: 'id_eleve' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      id_annee: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: AnneeScolaire, key: 'id_annee' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      somme: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
=======
        references: {
          model: Eleve,
          key: 'id_eleve',
        },
      },
      id_annee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: AnneeScolaire,
          key: 'id_annee',
        },
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      passant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Inscription',
      tableName: 'INSCRIPTIONS',
      timestamps: false,
<<<<<<< HEAD
      indexes: [
        { unique: true, fields: ['id_eleve', 'id_annee'] },
        { fields: ['id_classe'] },
        { fields: ['id_eleve'] },
        { fields: ['id_annee'] },
        { fields: ['id_annee',"id_classe"] },
      ],
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  )
}

<<<<<<< HEAD
// ─── TYPE FRAIS ───────────────────────────────────────────────────────────────
export class TypeFrais extends Model {
  public id_type_frais!: number
  public libelle!: string
  public detail?: string
  public freq!: number

  // Propriété virtuelle ajoutée par l'association many-to-many
  public Tarifs?: Tarif[]
=======
// Modèle TYPEFRAIS
export class TypeFrais extends Model {
  public id_type_frais!: number
  public libelle!: string
  public detail!: string
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}

export const initTypeFrais = (sequelize: Sequelize) => {
  TypeFrais.init(
    {
      id_type_frais: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      libelle: {
        type: DataTypes.STRING(100),
        allowNull: false,
<<<<<<< HEAD
        unique: true,
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
<<<<<<< HEAD
      freq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    },
    {
      sequelize,
      modelName: 'TypeFrais',
      tableName: 'TYPEFRAIS',
      timestamps: false,
    }
  )
}

<<<<<<< HEAD
// ─── TARIF ────────────────────────────────────────────────────────────────────
/**
 * Tarif est la table de jointure entre Classe et TypeFrais.
 *
 * Relation : Classe ←──────── Tarif ────────→ TypeFrais
 *             1            (many-to-many)         1
 *
 * Règle métier :
 *   - Un même TypeFrais peut s'appliquer à plusieurs classes.
 *   - Une même Classe peut avoir plusieurs TypeFrais.
 *   - MAIS la paire (id_classe, id_type_frais) est UNIQUE :
 *     on ne peut définir qu'un seul montant par couple classe/frais.
 */
export class Tarif extends Model {
  public id_tarif!: number
  public id_classe!: number
=======
// Modèle TARIF
export class Tarif extends Model {
  public id_tarif!: number
  public id_classe!: number
  public id_annee!: number
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  public id_type_frais!: number
  public montant_fixe!: number
}

export const initTarif = (sequelize: Sequelize) => {
  Tarif.init(
    {
      id_tarif: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_classe: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: Classe, key: 'id_classe' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
=======
        references: {
          model: Classe,
          key: 'id_classe',
        },
      },
      id_annee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: AnneeScolaire,
          key: 'id_annee',
        },
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: TypeFrais, key: 'id_type_frais' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      montant_fixe: {
        type: DataTypes.DECIMAL(15, 2),
=======
        references: {
          model: TypeFrais,
          key: 'id_type_frais',
        },
      },
      montant_fixe: {
        type: DataTypes.DECIMAL(10, 2),
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Tarif',
      tableName: 'TARIFS',
      timestamps: false,
<<<<<<< HEAD
      indexes: [
        {
          // Garantit qu'un seul tarif existe pour chaque paire (classe, frais).
          unique: true,
          fields: ['id_classe', 'id_type_frais'],
          name: 'uq_tarif_classe_frais',
        },
        { fields: ['id_classe'] },
        { fields: ['id_type_frais'] },
      ],
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  )
}

<<<<<<< HEAD
// ─── PAIEMENT ─────────────────────────────────────────────────────────────────
=======
// Modèle PAIEMENT
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
export class Paiement extends Model {
  public id_paiement!: number
  public ref!: string
  public id_inscription!: number
  public id_type_frais!: number
  public montant_paye!: number
  public date_paiement!: Date
}

export const initPaiement = (sequelize: Sequelize) => {
  Paiement.init(
    {
      id_paiement: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ref: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      id_inscription: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: Inscription, key: 'id_inscription' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
=======
        references: {
          model: Inscription,
          key: 'id_inscription',
        },
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        references: { model: TypeFrais, key: 'id_type_frais' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      montant_paye: {
        type: DataTypes.DECIMAL(15, 2),
=======
        references: {
          model: TypeFrais,
          key: 'id_type_frais',
        },
      },
      montant_paye: {
        type: DataTypes.DECIMAL(10, 2),
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        allowNull: false,
      },
      date_paiement: {
        type: DataTypes.DATEONLY,
<<<<<<< HEAD
        defaultValue: DataTypes.NOW,
=======
        allowNull: false,
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
      },
    },
    {
      sequelize,
      modelName: 'Paiement',
      tableName: 'PAIEMENTS',
      timestamps: false,
<<<<<<< HEAD
      indexes: [
        { unique: true, fields: ['ref'] },
        { fields: ['id_inscription'] },
        { fields: ['id_type_frais'] },
        { fields: ['id_type_frais','id_inscription'] },
        { fields: ["date_paiement"] },
      ],
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    }
  )
}

<<<<<<< HEAD
// ─── INITIALISATION GLOBALE ───────────────────────────────────────────────────
export const initializeModels = (sequelize: Sequelize) => {
=======
// Fonction pour initialiser tous les modèles et définir les associations
export const initializeModels = (sequelize: Sequelize) => {
  // Initialisation des modèles
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
  initUser(sequelize)
  initAnneeScolaire(sequelize)
  initEleve(sequelize)
  initClasse(sequelize)
  initInscription(sequelize)
  initTypeFrais(sequelize)
  initTarif(sequelize)
  initPaiement(sequelize)

<<<<<<< HEAD
  // ── Inscription ──────────────────────────────────────────────────────────
  Classe.hasMany(Inscription, { foreignKey: 'id_classe', as: 'inscriptions' })
  Inscription.belongsTo(Classe, { foreignKey: 'id_classe', as: 'classe' })

  Eleve.hasMany(Inscription, { foreignKey: 'id_eleve', as: 'inscriptions' })
  Inscription.belongsTo(Eleve, { foreignKey: 'id_eleve', as: 'eleve' })

  AnneeScolaire.hasMany(Inscription, { foreignKey: 'id_annee', as: 'inscriptions' })
  Inscription.belongsTo(AnneeScolaire, { foreignKey: 'id_annee', as: 'anneeScolaire' })

  // ── Tarif (table de jointure many-to-many entre Classe et TypeFrais) ─────
  //
  //   Classe.belongsToMany(TypeFrais)  →  depuis une Classe, accéder à ses TypeFrais
  //   TypeFrais.belongsToMany(Classe)  →  depuis un TypeFrais, accéder aux Classes qui l'utilisent
  //
  //   through: Tarif          → Sequelize utilise TARIFS comme table pivot
  //   foreignKey              → clé étrangère côté source dans TARIFS
  //   otherKey                → clé étrangère côté cible dans TARIFS
  //
  Classe.belongsToMany(TypeFrais, {
    through: Tarif,           // table de jointure
    foreignKey: 'id_classe',  // FK dans TARIFS pointant vers CLASSES
    otherKey: 'id_type_frais',// FK dans TARIFS pointant vers TYPEFRAIS
    as: 'typesFrais',         // alias : Classe.getTypesFrais()
  })
  TypeFrais.belongsToMany(Classe, {
    through: Tarif,
    foreignKey: 'id_type_frais',
    otherKey: 'id_classe',
    as: 'classes',            // alias : TypeFrais.getClasses()
  })

  // Relations directes sur Tarif (utiles pour les includes ciblés)
  Classe.hasMany(Tarif, { foreignKey: 'id_classe', as: 'tarifs' })
  Tarif.belongsTo(Classe, { foreignKey: 'id_classe', as: 'classe' })

  TypeFrais.hasMany(Tarif, { foreignKey: 'id_type_frais', as: 'tarifs' })
  Tarif.belongsTo(TypeFrais, { foreignKey: 'id_type_frais', as: 'typeFrais' })

  // ── Paiement ─────────────────────────────────────────────────────────────
  Inscription.hasMany(Paiement, { foreignKey: 'id_inscription', as: 'paiements' })
  Paiement.belongsTo(Inscription, { foreignKey: 'id_inscription', as: 'inscription' })

  TypeFrais.hasMany(Paiement, { foreignKey: 'id_type_frais', as: 'paiements' })
  Paiement.belongsTo(TypeFrais, { foreignKey: 'id_type_frais', as: 'typeFrais' })
}
=======
  // Définition des associations
  Classe.hasMany(Eleve, { foreignKey: 'delegue_1', as: 'delegue1' })
  Classe.hasMany(Eleve, { foreignKey: 'delegue_2', as: 'delegue2' })
  Classe.hasMany(Eleve, { foreignKey: 'meilleur_eleve', as: 'meilleurEleve' })
  Eleve.belongsTo(Classe, { foreignKey: 'delegue_1', as: 'delegue1Classe' })
  Eleve.belongsTo(Classe, { foreignKey: 'delegue_2', as: 'delegue2Classe' })
  Eleve.belongsTo(Classe, { foreignKey: 'meilleur_eleve', as: 'meilleurEleveClasse' })

  Classe.hasMany(Inscription, { foreignKey: 'id_classe', as: 'inscriptions' })
  Eleve.hasMany(Inscription, { foreignKey: 'id_eleve', as: 'inscriptions' })
  AnneeScolaire.hasMany(Inscription, { foreignKey: 'id_annee', as: 'inscriptions' })
  Inscription.belongsTo(Classe, { foreignKey: 'id_classe', as: 'classe' })
  Inscription.belongsTo(Eleve, { foreignKey: 'id_eleve', as: 'eleve' })
  Inscription.belongsTo(AnneeScolaire, { foreignKey: 'id_annee', as: 'anneeScolaire' })

  TypeFrais.hasMany(Tarif, { foreignKey: 'id_type_frais', as: 'tarifs' })
  Classe.hasMany(Tarif, { foreignKey: 'id_classe', as: 'tarifs' })
  AnneeScolaire.hasMany(Tarif, { foreignKey: 'id_annee', as: 'tarifs' })
  Tarif.belongsTo(TypeFrais, { foreignKey: 'id_type_frais', as: 'typeFrais' })
  Tarif.belongsTo(Classe, { foreignKey: 'id_classe', as: 'classe' })
  Tarif.belongsTo(AnneeScolaire, { foreignKey: 'id_annee', as: 'anneeScolaire' })

  TypeFrais.hasMany(Paiement, { foreignKey: 'id_type_frais', as: 'paiements' })
  Inscription.hasMany(Paiement, { foreignKey: 'id_inscription', as: 'paiements' })
  Paiement.belongsTo(TypeFrais, { foreignKey: 'id_type_frais', as: 'typeFrais' })
  Paiement.belongsTo(Inscription, { foreignKey: 'id_inscription', as: 'inscription' })
}
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
