
async function GET(req)
{
    const now = new Date();
    console.log(`Function ran at ${now.toISOString()}`);

    return new Response(
        JSON.stringify({ result: 'success' }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}

export { GET }