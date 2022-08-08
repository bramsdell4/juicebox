const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("a request is being made to /tags");
   next();
});

tagsRouter.get('/posts', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags 
    });
});
tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    try {
        const tag = fetch(`/api/tags/${tag}/posts`);
        const response = await (tag);
        res.send{posts: response}
    }catch ({ name, message }) {
        ({name, message})
    }
});

module.exports = tagsRouter;
