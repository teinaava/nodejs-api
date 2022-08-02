import { Sequelize } from "sequelize";

export const db = new Sequelize({
    dialect: 'sqlite',
    storage: `db.sqlite`,
    logging: false,
});

export async function init() {
    try {
        await db.authenticate();
        await db.sync({ alter: true });
        console.log('Connection has been established successfully.');

    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}




