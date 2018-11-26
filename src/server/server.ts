import 'reflect-metadata';
import * as express from 'express';
import * as config from 'config';
import * as bodyParser from 'body-parser';

let port: number = config.get('port') as number;

let app = express();

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./routes/data-routes')(app);
app.get('/app|css|fonts|img|js|server|favicon.ico', (req, res) => {
    res.sendFile(req.path, { root: 'dist' });
});

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
});

app.listen(port, () => {
    console.log(`Application is listening on port ${port}.`);
});

module.exports = app;
