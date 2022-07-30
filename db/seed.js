const { 
    client,
    createUser,
    getAllUsers,
    updateUser,
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
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active BOOLEAN DEFAULT true
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

        await createUser({username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia'});
        await createUser({username: 'sandra', password: '2dandy4me', name: 'Just Sandra', location: "Ain't tellin'"});
        await createUser({username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side'});

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

        console.log("calling getAllUsers")

        const users = await getAllUsers();
        console.log("result:", users);

        console.log("calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Names Goodman",
            location: "An area adjacent to a location"
        });
        console.log("result:", updateUserResult);

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














