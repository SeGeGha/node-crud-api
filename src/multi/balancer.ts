import { cpus } from 'os';
import http from 'http';

import { getReqBody } from '../utils/getReqBody';

import * as M from '../constants/messages';

let current = 1;
const limit = cpus().length;
const { PORT } = process.env;

export const balancer = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, url, headers } = req;
    const body = await getReqBody(req);
    const options = {
        hostname: headers.host.split(':')[0],
        port: Number(PORT) + current,
        path: url,
        method,
        headers,
    };

    const request = http.request(options, async (response) => {
        const body = await getReqBody(response);

        res.writeHead(response.statusCode, response.headers);
        res.end(body);
    });

    request.on('error', error => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    });

    request.write(body);
    request.end();

    current = (current + 1) % (limit + 1);
};
