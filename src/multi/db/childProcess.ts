import { router } from '../../router';
import { IncomingMessage, ServerResponse } from 'http';

import { TReqMessage } from '../../types/worker';

class CustomResponse {
    statusCode: number
    headers: Record<string, string>
    body: string

    end(body: string) {
        this.body = body;
    }

    writeHead(statusCode: number, headers: Record<string, string>) {
        this.statusCode = statusCode;
        this.headers = headers;
    }
}

process.on('message', async (message: TReqMessage) => {
    const { workerPid, ...req } = message;
    console.log(`DB has message from worker ${message.workerPid}: method - ${req.method}, url - ${req.url}, body - ${req.body}`);
    const res = new CustomResponse();

    // TODO: refactor custom req, res (use native tools)
    // @ts-ignore
    await router(req as IncomingMessage, res as ServerResponse);

    const { statusCode, headers, body } = res;

    process.send({ workerPid, statusCode, headers, body });
});
