import { app } from 'electron';
import path from 'path';
import { Sequelize } from 'sequelize';

export const connection = async (file: string): Promise<Sequelize> => {
    const dataDir = path.join(app.getPath('userData'), 'data', `${file}`)
    const sequelize = new Sequelize(
        {
            dialect:"sqlite",
            logging:false,
            dialectOptions:{
                timezone:'Etc/GMT-3'
            },
            storage:dataDir
        }
    )
    
    try {
        await sequelize.authenticate()
        return sequelize
    } catch (err) {
        throw err
    }
}

export const synchronize = async (sequelize: Sequelize, options: { alter?: boolean; force?: boolean } = {}) => {
    const defaultOptions = {
        alter: false,
        force: false,
        ...options
    }

    try {
        await sequelize.sync(defaultOptions)
        return { success: true, message: 'Synchronisation réussie' }
    } catch (error) {
        return { success: false, message: error.message }
    }
}

