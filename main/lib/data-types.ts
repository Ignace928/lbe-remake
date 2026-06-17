import { DataTypes, Model, Sequelize } from 'sequelize'

// ─── USER ────────────────────────────────────────────────────────────────────
export class User extends Model {
  public id_user!: number
  public nom_user!: string
  public mdp!: string
  public role!: 'admin' | 'professeur' | 'secretaire'
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

// ─── ANNEE SCOLAIRE ───────────────────────────────────────────────────────────
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

// ─── ELEVE ────────────────────────────────────────────────────────────────────
export class Eleve extends Model {
  public id_eleve!: number
  public matricule!: string
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
      matricule: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
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

// ─── CLASSE ───────────────────────────────────────────────────────────────────
export class Classe extends Model {
  public id_classe!: number
  public nom_classe!: string
  public niveau!: string
  public delegue_1?: string | null
  public delegue_2?: string | null
  public meilleur_eleve?: string | null
  public titulaire?: string | null
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

// ─── INSCRIPTION ──────────────────────────────────────────────────────────────
export class Inscription extends Model {
  public id_inscription!: number
  public id_classe!: number
  public id_eleve!: number
  public id_annee!: string
  public somme!: number
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
        references: { model: Classe, key: 'id_classe' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      id_eleve: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      indexes: [
        { unique: true, fields: ['id_eleve', 'id_annee'] },
        { fields: ['id_classe'] },
        { fields: ['id_eleve'] },
        { fields: ['id_annee'] },
        { fields: ['id_annee',"id_classe"] },
      ],
    }
  )
}

// ─── TYPE FRAIS ───────────────────────────────────────────────────────────────
export class TypeFrais extends Model {
  public id_type_frais!: number
  public libelle!: string
  public detail?: string
  public freq!: number

  // Propriété virtuelle ajoutée par l'association many-to-many
  public Tarifs?: Tarif[]
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
        unique: true,
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      freq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'TypeFrais',
      tableName: 'TYPEFRAIS',
      timestamps: false,
    }
  )
}

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
        references: { model: Classe, key: 'id_classe' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: TypeFrais, key: 'id_type_frais' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      montant_fixe: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Tarif',
      tableName: 'TARIFS',
      timestamps: false,
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
    }
  )
}

// ─── PAIEMENT ─────────────────────────────────────────────────────────────────
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
        references: { model: Inscription, key: 'id_inscription' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: TypeFrais, key: 'id_type_frais' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      montant_paye: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      date_paiement: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Paiement',
      tableName: 'PAIEMENTS',
      timestamps: false,
      indexes: [
        { unique: true, fields: ['ref'] },
        { fields: ['id_inscription'] },
        { fields: ['id_type_frais'] },
        { fields: ['id_type_frais','id_inscription'] },
        { fields: ["date_paiement"] },
      ],
    }
  )
}

// ─── INITIALISATION GLOBALE ───────────────────────────────────────────────────
export const initializeModels = (sequelize: Sequelize) => {
  initUser(sequelize)
  initAnneeScolaire(sequelize)
  initEleve(sequelize)
  initClasse(sequelize)
  initInscription(sequelize)
  initTypeFrais(sequelize)
  initTarif(sequelize)
  initPaiement(sequelize)

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