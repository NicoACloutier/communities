// post_id, parent_id (or NUL), content, comment_id
const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return [a] comment(s) stored in the `comments` table.
*/
router.get('/', (request, response) => {
    const comment_id = request.query['comment_id'];
    const parent_id = request.query['parent_id'];
    const post_id = request.query['post_id'];
    if (comment_id !== undefined) {
        pool.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    } else if (parent_id !== undefined) {
        pool.query('SELECT * FROM comments WHERE parent_id = $1', [parent_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    } else {
        pool.query('SELECT * FROM comments WHERE post_id = $1 AND parent_id = NULL', [post_id], (error, results) => { // TODO: check if NULL does what you want
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
});

/*
Create a comment and add to the `comments` table
*/
router.post('/', (request, response) => {
    const { post_id, parent_id, content } = request.body;
    const comment_id = uuid();
    pool.query('INSERT INTO comments (post_id, parent_id, content, comment_id) VALUES ($1, $2, $3, $4) RETURNING *', [post_id, parent_id, content, comment_id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Delete a given comment.
*/
router.delete('/', (request, response) => {
    const comment_id = request.query['comment_id'];
    if (comment_id === undefined) {
        response.status(404).json(request.query);
    } else {
        pool.query('DELETE FROM comments WHERE comment_id = $1', [comment_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
});

module.exports = router;
