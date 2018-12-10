import express from 'express';
import fs from 'fs';
import http from 'http';
import bodyParser from 'body-parser';
import routeApi from './routes';
import config from './config.json';

var creds = {
  key: fs.readFileSync('./src/csr.pem', 'utf8'),
  cert: fs.readFileSync('./src/server.crt', 'utf8')
};

let app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
  limit: config.bodyLimit
}));


app.use('/api', routeApi());

app.server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});


