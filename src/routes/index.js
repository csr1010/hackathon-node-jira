import { Router } from 'express';
import status from './status';

export default () => {
    let api = Router();

    api.use('/status', status());

    api.get('/test', (req, res) => {
        console.log("testing")
        res.json({
            "data": "Succuesfully working !"
        });
    });

    return api;
}
