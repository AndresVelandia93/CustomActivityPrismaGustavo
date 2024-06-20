const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const decodeJwt = require('./JwtDecoder');

const secret = 'GvblUlBPtysgVUp4eRZb2Vbujm9TlsusexKSvZixpWuPXP4kel0DyXQnr53nPEj0z9qKyktzW-a6zwHrXqEVxro-79UXuteQKAcXaG570xCPW4FAg8irkbth-MBnhDtkuQP8YM0A8sNNImjci67YJrsdJvr8zOwNBvGhyC8YnV7k1lBPtLF7UWpj7BcNQCo-pJJ7T0ubLDGbve5WwKSlmNOOQhXp3EIYyO0HuVXXmLMyaYNKnGr1Dw7taU3Mtw2';
const pushApiUrl = 'https://cloud.mensajes.payway.com.ar/JSON_API_SendPushy';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.raw({ type: 'application/jwt' }));

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
    
    const inArguments = decoded.inArguments;
    
    if (!Array.isArray(inArguments) || inArguments.length === 0) {
        res.status(400).send('No inArguments provided');
        return;
    }
    const SelectContacto = inArguments.find(arg => 'SelectContacto' in arg)?.SelectContacto;
    const IdCampana = inArguments.find(arg => 'IdCampana' in arg)?.IdCampana;
    const TimeToLive = inArguments.find(arg => 'TimeToLive' in arg)?.TimeToLive;
    const Categoria = inArguments.find(arg => 'Categoria' in arg)?.Categoria;
    const Title = inArguments.find(arg => 'Title' in arg)?.Title;
    const ShortDescription = inArguments.find(arg => 'ShortDescription' in arg)?.ShortDescription;
    const LongDescription = inArguments.find(arg => 'LongDescription' in arg)?.LongDescription;
    const CallToAction = inArguments.find(arg => 'CallToAction' in arg)?.CallToAction;
    const CallToActionLabel = inArguments.find(arg => 'CallToActionLabel' in arg)?.CallToActionLabel;
    const SecondaryCallToAction = inArguments.find(arg => 'SecondaryCallToAction' in arg)?.SecondaryCallToAction;
    const SecondaryCallToActionLabel = inArguments.find(arg => 'SecondaryCallToActionLabel' in arg)?.SecondaryCallToActionLabel;
    const Nombre = inArguments.find(arg => 'Nombre' in arg)?.Nombre;
    const Modulo = inArguments.find(arg => 'Modulo' in arg)?.Modulo;
    const ExtensionDatos = inArguments.find(arg => 'ExtensionDatos' in arg)?.ExtensionDatos;
    const GrupoControlador = inArguments.find(arg => 'GrupoControlador' in arg)?.GrupoControlador;

    try {
        console.log('Enviando mensaje de push por API de Pushy en SFMC');
        const response = await axios.post(pushApiUrl, 
        {
            IdCampana: IdCampana,
            TimeToLive: TimeToLive,
            Categoria: Categoria,
            Title: Title,
            ShortDescription: ShortDescription,
            LongDescription: LongDescription,
            CallToAction: CallToAction,
            CallToActionLabel: CallToActionLabel,
            SecondaryCallToAction: SecondaryCallToAction,
            SecondaryCallToActionLabel: SecondaryCallToActionLabel,
            Nombre: Nombre,
            Modulo: Modulo,
            AccountID: SelectContacto,
            Ambiente: "QA",
            ExtensionDatos: ExtensionDatos,
            GrupoControlador: GrupoControlador
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Respuesta de envio:', JSON.stringify(response.data));

        if (response.status == 200 && response.data.Estado == 'Enviado') {
            res.status(200).send('Mensage de push enviada con exito');
        } else if (response.status == 200 && response.data.Estado == 'Error') {
            res.status(500).send(response.data.Estado);
        } else {
            res.status(400).send(response.data.Estado);
        }
    } catch (error) {
        console.error('Error al enviar mensaje de push:', error.message);
        res.status(500).send('Error al enviar mensaje de push');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
