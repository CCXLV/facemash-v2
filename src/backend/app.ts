import express from 'express';

import sqlite3 from 'sqlite3';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

import { ImageDataFetch, ImageRatingFetch } from './utils/interfaces';
import { Duel, Player }from '@ihs7/ts-elo';

const app = express();
const port = 3001;

const db = new sqlite3.Database('./database/database.db');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


app.post('/api/submit', async (req, res) => {
    const { data } = req.body;
    const uniqueId = uuidv4().substring(0, 13);
    const imageData = data.image.data.split(',')[1];
    const decodedData = Buffer.from(imageData, 'base64')


    db.serialize(() => {
        const statement = db.prepare('INSERT INTO images (unique_id, data, name) VALUES (?, ?, ?)');
        statement.run(uniqueId, decodedData, data.name); 
        statement.finalize();
    });

    return res.json({ success: 'Successfully uploaded image' });
});

app.get('/api/images', async (req, res) => {
    const data: ImageDataFetch[] = [];

    db.serialize(() => {
        db.each('SELECT * FROM images', (err, row: ImageDataFetch) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'An error occurred while fetching images' });
            } else {

                const base64ImageData = Buffer.from(row.data).toString('base64');
                data.push({
                    id: row.id,
                    name: row.name,
                    rating: row.rating,
                    data: base64ImageData,
                });
            }
        }, () => {
            res.json({ data: data });
        });
    });
});


app.post('/api/rating', async (req, res) => {
    const data: ImageRatingFetch[] = [];
    const { reqData } = req.body;

    db.serialize(() => {
        db.each('SELECT * FROM images', (err, row: ImageRatingFetch) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'An error occurred while fetching images' });
            } else {
                data.push({
                    id: row.id,
                    name: row.name,
                    rating: row.rating,
                    unique_id: row.unique_id
                });
            }
        }, () => {
            const winnerId = data[reqData.winner].unique_id;
            const loserId = data[reqData.loser].unique_id;

            const winnersRating = data[reqData.winner].rating;
            const losersRating = data[reqData.loser].rating;

            const match = new Duel();

            match.addPlayer(new Player(winnerId, winnersRating), true);
            match.addPlayer(new Player(loserId, losersRating), false);
            const results = match.calculate();

            db.serialize(() => {
                const winnersStatement = db.prepare('UPDATE images SET rating = ? WHERE unique_id = ?');
                winnersStatement.run(results.results[0].rating, winnerId); 
                winnersStatement.finalize();

                const losersStatement = db.prepare('UPDATE images SET rating = ? WHERE unique_id = ?');
                losersStatement.run(results.results[1].rating, loserId); 
                losersStatement.finalize();
            });

            res.json({ data: 'Updated rating' });
        });
    });
});


app.listen(port, function() {
    console.log(`Server is listening on port ${port}`);
});
