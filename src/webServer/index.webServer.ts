import http from 'http';
import express from 'express';
import bodyParser from 'body-parser'
import setupConfig from '@/setup/config';
import { registerApiResrouces } from "@/webServer/resources.webServer"
import { registerApiBase } from './base.webServer';
import { registerApiPlayVideo } from './playVideo.webServer';
import { registerApilogin } from './login.webServer';
import { getLanIpAddress, portIsOccupied } from '@/assets/ipAndPort'
import { softWareConfigData } from '@/setup/softwareConfig';


interface ServerLink {
    status: boolean,
    server: null | http.Server,
    ip: string,
    port: number,
}

const serverLink: ServerLink = {
    status: false,
    server: null,
    ip: '',
    port: 80,
}



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(setupConfig.webPagePath));
app.get('/play*', (req, res) => {
    res.sendFile(setupConfig.webPagePath + 'index.html');
});
app.get('/login', (req, res) => {
    res.sendFile(setupConfig.webPagePath + 'index.html');
});
app.get('/', (req, res) => {
    res.sendFile(setupConfig.webPagePath + 'index.html');
});
registerApiResrouces(app);
registerApiBase(app);
registerApiPlayVideo(app);
registerApilogin(app);

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const createServer = async function () {
    serverLink.port = softWareConfigData.serverPort as number;
    serverLink.ip = getLanIpAddress();
    if (await portIsOccupied(serverLink.port) == false) {
        return serverLink;
    } else {
        serverLink.server = createWebServer(serverLink.ip, serverLink.port);
        serverLink.status = true;
        return serverLink;
    }
}
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const closeServer = function () {
    serverLink.server?.close();
    serverLink.status = false;
    serverLink.server = null;
    return serverLink;
}


// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const createWebServer = function (ip = '127.0.0.1', port = 12345) {
    const server = app.listen(port, ip, () => {
        console.log(`Example app listening on port ${port}`);
        //callBack(true, ip, port);
    })
    server.on('error', (err) => {
        console.log('server error', err);
        //callBack(false, ip, port, err.message);
    })
    return server;
}


export { createWebServer, createServer, closeServer }
