const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();


/*
Return a community stored in the `communities` table.
*/
router.get('/', (request, response) => {
    const name = request.query['name'];
    const community_id = request.query['community_id'];
    if (community_id !== undefined) {
        pool.query('SELECT * FROM communities WHERE community_id = $1', [community_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    } else {
        pool.query('SELECT * FROM communities WHERE name = $1', [name], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows[0]);
        });
    }
});

/*
Create a community and add to the `communities` table.
*/
router.post('/', (request, response) => {
    const { name, user_id, creation_date } = request.body; // TODO: change creation date to finding on backend. Do the same with posts and other endpoints.
    const community_id = uuid();
    pool.query('INSERT INTO communities (name, user_id, creation_date, community_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, user_id, creation_date, community_id], (error, results) => {
        if (error) throw error;
        response.status(200).json(results.rows);
    });
});

/*
Delete a given community.
*/
router.delete('/', (request, response) => {
    const community_id = request.query['community_id'];
    if (community_id === undefined) {
        response.status(404).json(request.query);
    } else {
        pool.query('DELETE FROM communities WHERE community_id = $1', [community_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(request.body);
        });
    }
});

module.exports = router;
