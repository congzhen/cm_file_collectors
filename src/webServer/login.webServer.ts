import crypto from 'crypto'
import { Express } from 'express'
import { softWareConfigData } from "@/setup/softwareConfig"
const registerApilogin = (app: Express) => {
    app.get('/api/needLogin', async (req, res) => {
        res.json(softWareConfigData.serverPassword == '' ? false : true);
    });
    app.post('/api/login', async (req, res) => {
        let status = false;
        if (softWareConfigData.serverPassword == '') {
            status = true;
        } else {
            const password = req.body.password;
            if (password == softWareConfigData.serverPassword) {
                status = true;
            }
        }
        res.json(status);
    });
};


export { registerApilogin }
