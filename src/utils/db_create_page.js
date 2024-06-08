
import { loadDb } from './db.js'

function toGameArray() {
    if (!this.data.tags_game) {
        return undefined;
    }
    return this.data.tags_game.map(item => ({ id: item }));
}

export async function getCreatePageDb() {
    const db = await loadDb('db_create_page', { tags_game: [] });

    db.toGameArray = toGameArray;

    return db;
}

export default async function handler(req, res) {
    const db = await getCreatePageDb();
    console.log("Method: " + req.method + " " + req.path);
    if (req.method == "GET") {
        res.status(200).json(db.data);
    } else if (req.method == "PUT" || req.method == "POST") {
        if ('tags_game' in req.body) {
            db.data.tags_game = req.body.tags_game;
        }
        await db.save();
        res.status(200).json({});
    } else {
        res.status(500).end();
    }
}