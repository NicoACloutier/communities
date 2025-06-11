const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return a poll stored in the `posts` table.
*/
router.get('/', (request, response) => {
    const user_id = request.query["user_id"];
    const post_id = request.query["post_id"];
    const title = request.query["title"];
    if (id !== undefined) {
        pool.query('SELECT * FROM posts WHERE post_id = $1', [post_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
    else if (user_id !== undefined) {
        pool.query('SELECT * FROM posts WHERE user_id = $1', [user_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
    else if (poll_name !== undefined) {
        const queryLength = title.length;
        pool.query('SELECT * FROM posts WHERE SUBSTRING(title, 1, $1) = $2 LIMIT 10', [title.length, title], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
    });
    }
    else {
        pool.query('SELECT * FROM posts OFFSET (SELECT count(*) FROM posts)-10', [], (error, results) => { // TODO: allow for multiple pages
            if (error) throw error;
            response.status(200).json(results.rows.reverse());
        });
    }
});

/*
Create a poll and add to the `polls` table.
*/
router.post('/', (request, response) => {
    const { user_id, title, content, creation_date, community_id } = request.body;
    const post_id = uuid();
    pool.query('INSERT INTO posts (user_id, title, content, creation_date, community_id, post_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user_id, title, content, creation_date, community_id, post_id], (error, results) => {
        if (error) throw error;
        response.status(200).json({ post_id: post_id });
    });
});

/*
Delete a given poll.
*/
router.delete('/', (request, response) => {
    const post_id = request.query["post_id"];
    if (post_id === undefined) {
        response.status(404).json(request.query);
    }
    else {
        pool.query('DELETE FROM posts WHERE post_id = $1', [post_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
});


module.exports = router;
