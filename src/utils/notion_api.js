
const NOTION_URL = 'https://api.notion.com';
// const NOTION_KEY = "secret_aAdaVh7uDno4PcRAQ3EzjYtnDzXmNPhGJXcg5uPGOHO";

const NOTION_VERSION = '2022-06-28';

export async function notion_get(api, query_obj) {
    const qs = query_obj ? '?' + querystring.stringify(query_obj) : '';
    const req_url = `${NOTION_URL}${api}${qs}`;
    console.log(req_url);
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NOTION_KEY}`,
        'Notion-Version': NOTION_VERSION,
    };
    let res = await fetch(req_url, { headers });
    let json = await res.json();
    json.status = res.status;
    return json;
}


export async function notion_post(api, data, method) {
    if (!method) {
        method = "POST"
    }
    var result = { error: "unknown" };
    const req_url = `${NOTION_URL}${api}`;
    console.log(`notion_post ${method} req: ${req_url}`);
    console.log(data);
    result = await fetch(req_url, {
        method,
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': NOTION_VERSION,
        },
    });
    console.log(`notion_post resp: ${result.status} ${req_url}`);
    if (result.status != 200 && result.status != 204 && result.status != 201) {
        console.log(result.data);
    }
    const result_json = result.status == 204 ? {} : await result.json();
    console.log(result_json);
    return { status: result.status, data: result_json };
}