const { 
    client,
    createUser,
    getAllUsers,
} = require('./index');

const dropTables = async () => {
    try {
        console.log("starting to drop tables!");

        await client.query(`
        DROP TABLE IF EXISTS users;
    `);

        console.log("finished dropping tables")
    } catch (error) {
        console.error("error dropping tables");
        throw error;
    }
}

const createTables = async () => {
    try {
        console.log("starting to build tables...");

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
            );
        `);

        console.log("finished building tables");
    } catch (error) {
        console.error("error building tables");
        throw error;
    }
}

const createInitialUsers = async () => {
    try {
        console.log("starting to create users...");

        const albert = await createUser({username: 'albert', password: 'bertie99'});
        const sandra = await createUser({username: 'sandra', password: '2dandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});

        console.log("finished creating users");
    } catch(error) {
        console.error("error creating users");
        throw error;
    }
}


const rebuildDB = async () => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        throw error;
    }
}


const testDB = async () => {
    try {
        console.log("starting to test database....");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("finished database tests");
    } catch (error) {
        console.error("error testing database");
        throw error;
    }
}







rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());














