// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import url from "url"

import { notion_post } from "../utils/notion_api.js";

/*
  0: Object { id: "0a0245ca-34af-45e2-9895-8d2082be6900", name: "⚪⚪", color: "brown", … }
  1: Object { id: "73faed14-6456-4643-97fb-ff702ceaa4af", name: "🕘🕐", color: "green", … }
  2: Object { id: "cd25a52d-86bb-4380-8734-b51fec42b301", name: "🕘🕐💻", color: "gray", … }
  3: Object { id: "e0d5b4ea-b943-4e23-8324-d01a7ae426a1", name: "⚪🕐", color: "blue", … }
  4: Object { id: "db53ab04-d41a-4875-bcec-af21f1608635", name: "⚪🕐💻", color: "default", … }
  5: Object { id: "7c467983-8d0d-4b5b-b567-780d802f73b5", name: "🕘⚪", color: "pink", … }
*/

const WEEK_DAYS = [
    { name: "日", work: "⚪⚪" },
    { name: "月", work: "🕘🕐" },
    { name: "火", work: "🕘🕐" },
    { name: "水", work: "🕘🕐" },
    { name: "木", work: "🕘🕐" },
    { name: "金", work: "🕘🕐" },
    { name: "土", work: "⚪⚪" },
];

function pad(num, size) {
    return ("000000000" + num).slice(-size);
}

export async function createPage() {
    const data = new Date();
    const yyyy = data.getFullYear();
    const mm = pad(data.getMonth() + 1, 2);
    const dd = pad(data.getDate(), 2);
    const weekDay = data.getDay();
    const title = `${yyyy} ${mm} ${dd} ${WEEK_DAYS[weekDay].name} new`;
    const obj = {
        "parent": {
            "database_id": "54a7cfe7-e6c2-4ba6-a6c3-c0daa22c0300"
        },
        "properties": {
            "title": [
                {
                    "text": {
                        "content": title,
                    }
                }
            ],
            "Date": {
                "start": `${yyyy}-${mm}-${dd}`
            },
            "Work": {
                "name": WEEK_DAYS[weekDay].work
            }
        }
    };
    return await notion_post('/v1/pages', obj);
}

export default async function handler(req, res) {
    console.log("Method: " + req.method);
    if (req.method == "GET") {
        const data_myself = await notion_post('/v1/search', { "query": "Daily Overview" });
        res.status(200).json(data_myself);
    } else if (req.method == "PUT" || req.method == "POST") {
        const data_myself = await createPage();
        res.status(200).json(data_myself);
    } else {
        res.status(500).end();
    }
}