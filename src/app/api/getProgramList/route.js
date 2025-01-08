import axios from "axios";

async function GET(req)
{
    const { channel, segment } = req.query;

    const timestamp = new Date().getTime();
    const rthkUrl = `https://www.rthk.hk/archive/archive_channel/${channel}_latest/${segment}?_t=${timestamp}`;

    console.log(rthkUrl);

    const result = await axios.get(rthkUrl);

    return new Response(
        JSON.stringify({ result: result?.data?.programmes?.programme }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}


export { GET }