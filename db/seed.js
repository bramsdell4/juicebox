const { 
    client,
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    addTagsToPost,
    createTags
} = require('./index');

const dropTables = async () => {
    try {
        console.log("starting to drop tables!");

        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
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
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar (255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id)
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

const createIntitalPosts = async () => {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log("starting to create posts..");
        await createPost({
            authorId: albert.id,
            title: "first",
            content: "this is first post i hope blogs are writing love."
        });

        await createPost({
            authorId: sandra.id,
            title: "how work?",
            content: "srsly halp plz :["
        });

        await createPost({
            authorId: glamgal.id,
            title: "fierce glam",
            content: " like OMG thats totes adorbs :3"
        });
        console.log("fabulosly finishing creating hella posts");
    } catch (error) {
        console.log("error creating posts");
        throw error;
    }
}

const createInitialTags = async () => {
    try {
      console.log("Starting to create tags...");
  
      const [happy, sad, inspo, catman] = await createTags([
        '#happy', 
        '#worst-day-ever', 
        '#youcandoanything',
        '#catmandoeverything'
      ]);
  
      const [postOne, postTwo, postThree] = await getAllPosts();
  
      await addTagsToPost(postOne.id, [happy, inspo]);
      await addTagsToPost(postTwo.id, [sad, inspo]);
      await addTagsToPost(postThree.id, [happy, catman, inspo]);
  
      console.log("Finished creating tags!");
    } catch (error) {
      console.log("Error creating tags!");
      throw error;
    }
  }


const rebuildDB = async () => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createIntitalPosts();
        await createInitialTags();
    } catch (error) {
        console.log("error at rebuild");
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
        const updateUserResult = await updateUser(users[0].id,{
            name: "Names Goodman",
            location: "An area adjacent to a location"
        });
        console.log("result:", updateUserResult);

        const posts = await getAllPosts();
        console.log("result:", posts);

        console.log("calling updatePosts on posts[0]");
        const updatePostResult = await updatePost(posts[0].id,{
            title: "new title",
            content: "Updated content"
        });
        console.log("result:", updatePostResult);

        console.log("calling getUserById");
        const albert = await getUserById(1);
        console.log("result:", albert);

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














