const express = require('express');
const path = require('path');
const pool = require(path.join(__dirname, 'pool.js'));
const router = express.Router();

/*
Return subscriptions stored in `subscriptions` table.
*/
router.get('/', (request, response) => {
    const user_id = request.query["user_id"];
    const community_id = request.query["community_id"];
    if (user_id !== undefined) {
        pool.query('SELECT community_id FROM subscriptions WHERE user_id = $1', [user_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
    else {
        pool.query('SELECT user_id FROM subscriptions WHERE community_id = $1', [community_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
});

/*
Create a subscription and add to the `subscriptions` table.
*/
router.post('/', (request, response) => {
    const { user_id, community_id } = request.body;
    pool.query('INSERT INTO subscriptions (user_id, community_id) VALUES ($1, $2) RETURNING *', [user_id, community_id], (error, results) => {
        if (error) throw error;
        response.status(200).json(request.body);
    });
});

/* Delete subscription(s) from the `subscriptions` table.
 */
router.delete('/', (request, response) => {
    const { user_id, community_id } = request.body;
    if (user_id === undefined) {
        pool.query('DELETE FROM subscriptions WHERE community_id = $1 RETURNING *', [community_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    } else if (community_id === undefined) {
        pool.query('DELETE FROM subscriptions WHERE user_id = $1 RETURNING *', [user_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    } else {
        pool.query('DELETE FROM subscriptions WHERE community_id = $1 AND user_id = $2 RETURNING *', [community_id, user_id], (error, results) => {
            if (error) throw error;
            response.status(200).json(results.rows);
        });
    }
});

module.exports = router;
