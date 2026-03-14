import { DataTypes, Model, Sequelize } from 'sequelize'

// Modèle USER
export class User extends Model {
  // Pas de champs publics pour éviter le conflit avec Sequelize
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

// Modèle ANNEESCOLAIRE
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

// Modèle ELEVE
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

// Modèle CLASSE
export class Classe extends Model {
  public id_classe!: number
  public nom_classe!: string
  public niveau!: string
  public delegue_1!: number | null
  public delegue_2!: number | null
  public meilleur_eleve!: number | null
  public titulaire!: string | null
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

// Modèle INSCRIPTION
export class Inscription extends Model {
  public id_inscription!: number
  public id_classe!: number
  public id_eleve!: number
  public id_annee!: number
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
        references: {
          model: Classe,
          key: 'id_classe',
        },
      },
      id_eleve: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    }
  )
}

// Modèle TYPEFRAIS
export class TypeFrais extends Model {
  public id_type_frais!: number
  public libelle!: string
  public detail!: string
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
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: true,
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

// Modèle TARIF
export class Tarif extends Model {
  public id_tarif!: number
  public id_classe!: number
  public id_annee!: number
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
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TypeFrais,
          key: 'id_type_frais',
        },
      },
      montant_fixe: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Tarif',
      tableName: 'TARIFS',
      timestamps: false,
    }
  )
}

// Modèle PAIEMENT
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
        references: {
          model: Inscription,
          key: 'id_inscription',
        },
      },
      id_type_frais: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TypeFrais,
          key: 'id_type_frais',
        },
      },
      montant_paye: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      date_paiement: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Paiement',
      tableName: 'PAIEMENTS',
      timestamps: false,
    }
  )
}

// Fonction pour initialiser tous les modèles et définir les associations
export const initializeModels = (sequelize: Sequelize) => {
  // Initialisation des modèles
  initUser(sequelize)
  initAnneeScolaire(sequelize)
  initEleve(sequelize)
  initClasse(sequelize)
  initInscription(sequelize)
  initTypeFrais(sequelize)
  initTarif(sequelize)
  initPaiement(sequelize)

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
