import { Worker } from 'cluster';

type TWorker = {
    PORT: number
    worker: Worker
}

export type TWorkerList = Record<number, TWorker>

export type TReqMessage = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    url: string
    body: string
    workerPid?: number
}

export type TResMessage = {
    workerPid: number
    statusCode: number
    headers: Record<string, string>
    body: string
}
