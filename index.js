const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const decodeJwt = require('./JwtDecoder');

const secret = 'GvblUlBPtysgVUp4eRZb2Vbujm9TlsusexKSvZixpWuPXP4kel0DyXQnr53nPEj0z9qKyktzW-a6zwHrXqEVxro-79UXuteQKAcXaG570xCPW4FAg8irkbth-MBnhDtkuQP8YM0A8sNNImjci67YJrsdJvr8zOwNBvGhyC8YnV7k1lBPtLF7UWpj7BcNQCo-pJJ7T0ubLDGbve5WwKSlmNOOQhXp3EIYyO0HuVXXmLMyaYNKnGr1Dw7taU3Mtw2';
const pushApiUrl = 'https://cloud.mensajes.payway.com.ar/JSON_API_SendPushy';


app.set('port', process.env.PORT || 3000);


app.use(bodyParser.raw({ type: 'application/jwt' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', (req, res) => {
    console.log('Save route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Save');
});

app.post('/publish', (req, res) => {
    console.log('Publish route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Publish');
});

app.post('/validate', (req, res) => {
    console.log('Validate route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Validate');
});

app.post('/stop', (req, res) => {
    console.log('Stop route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Stop');
});


app.post('/execute', async (req, res) => {
    console.log('Execute route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);

    //Aqui va codigo
    res.status(200).send('execute');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')));