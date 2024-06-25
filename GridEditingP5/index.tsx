const server = Bun.serve({
    port: 3000,
    fetch: async (req) => {
        const path = new URL(req.url).pathname;
        const url = new URL(req.url);
        const file = Bun.file(path.replace('/', ''));

        if (url.pathname === '/save') {
            if (req.method === "POST") {
                const payload = await req.json();
                await save(payload.name, payload.data)
                return new Response("Success");
            }
        }

        if (url.pathname === '/read') {
            if (req.method === "POST") {
                const payload = await req.json();
                const file = await read(payload.name)
                return new Response(file);
            }
        }
        return new Response(file);
    },
});
console.log(`Listening on localhost:${server.port}`);

const save = async (path: string, array: any[] = []) => {
    const file = Bun.file('/Users/ilyusin/Desktop/RoomMapP5/models/' + path);
    return await Bun.write(file, JSON.stringify(array, null, 2));
}

const read = async (path: string) => {
    const file = Bun.file('/Users/ilyusin/Desktop/RoomMapP5/models/' + path);
    const pkg = await file.json();
    return JSON.stringify(pkg);
}

