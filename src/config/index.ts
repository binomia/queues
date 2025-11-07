import {Sequelize} from "sequelize";
import {DOCKER_MODE} from "@/constants";


export const db = new Sequelize({
    dialect: "postgres",
    database: "postgres",
    host: DOCKER_MODE ? "postgres" : "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    logging: false
})

export const dbConnection = async () => {
    try {
        await db.authenticate()
        await db.sync()
        console.log('\nDatabase connection has been established successfully.');
    } catch (error) {
        console.log('\nUnable to connect to the database:', error);
    }
}