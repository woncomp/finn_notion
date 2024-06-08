// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// import { Low } from 'lowdb'
// import { JSONFile } from 'lowdb/node'

const fs = require('fs');

export const ProjectDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const StorageDir = join(ProjectDir, "storage");
export const DbDir = join(StorageDir, "db");

const LoadingSymbol = "loading";

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

// // https://www.npmjs.com/package/lowdb
// export async function loadDb(filename, defaultData) {
//     if (!global._db) {
//         global._db = {};
//     }

//     if (!global._db[filename]) {
//         global._db[filename] = LoadingSymbol;
//         // db.json file path
//         const file = join(StorageDir, "db", filename + ".json")

//         // Configure lowdb to write data to JSON file
//         const adapter = new JSONFile(file)
//         var db = new Low(adapter, defaultData);

//         // Read data from JSON file, this will set db.data content
//         // If JSON file doesn't exist, defaultData is used instead
//         await db.read();

//         global._db[filename] = db;
//     }
//     while(global._db[filename] === LoadingSymbol) {
//         await sleep(10);
//     }
//     return global._db[filename];
// }


function Database(filename) {
    this.filename = filename;
    this.data = {};
}

Database.prototype.getFilePath = function () {
    return join(DbDir, this.filename + ".json");
}

Database.prototype.read = async function () {
    const filepath = this.getFilePath();
    if (fs.existsSync(DbDir)) {
        const data = fs.readFileSync(filepath, 'utf8');
        this.data = JSON.parse(data);
        return true;
    } else {
        return false;
    }
}

Database.prototype.save = function () {
    if (!fs.existsSync(DbDir)) {
        fs.mkdirSync(DbDir, { recursive: true });
    }

    const filepath = this.getFilePath();
    const jsonData = JSON.stringify(this.data, null, 2);
    try {
        fs.writeFileSync(filepath, jsonData);
    } catch (err) {
        console.error(err);
    }
}


export async function loadDb(filename, defaultData) {
    if (!global._db) {
        global._db = {};
    }

    if (!global._db[filename]) {
        global._db[filename] = LoadingSymbol;

        var db = new Database(filename);

        // Read data from JSON file, this will set db.data content
        // If JSON file doesn't exist, defaultData is used instead
        const loaded = await db.read();
        if (!loaded) {
            db.data = defaultData;
        }

        global._db[filename] = db;
    }
    while (global._db[filename] === LoadingSymbol) {
        await sleep(10);
    }
    return global._db[filename];
}