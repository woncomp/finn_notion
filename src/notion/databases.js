// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import url from "url";

import { notion_get, notion_post } from "../utils/notion_api.js";

export default async function handler(req, res) {
    console.log("Method: " + req.method);
    if(req.method == "GET") {
        const data_myself = await notion_get('/v1/databases/54a7cfe7-e6c2-4ba6-a6c3-c0daa22c0300');
        res.status(200).json(data_myself);
    } else if(req.method == "PUT" || req.method == "POST") {
        const data_myself = await notion_post('/v1/search', { "query": "Daily Overview"});
        res.status(200).json(data_myself);
    } else {
        res.status(500).end();
    }
}

/*
    {
      object: 'database',
      id: '54a7cfe7-e6c2-4ba6-a6c3-c0daa22c0300',
      cover: null,
      icon: [Object],
      created_time: '2021-01-05T12:39:00.000Z',
      created_by: [Object],
      last_edited_by: [Object],
      last_edited_time: '2024-03-26T04:38:00.000Z',
      title: [Array],
      description: [Array],
      is_inline: false,
      properties: [Object],
      parent: [Object],
      url: 'https://www.notion.so/54a7cfe7e6c24ba6a6c3c0daa22c0300',
      public_url: null,
      archived: false
    }
    */