import express from 'express';
import bodyParser from 'body-parser';
import got from 'got';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const url_backend = process.env.URL_BACKEND || 'http://localhost:3001';
// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para analizar el cuerpo de las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para mostrar el formulario de login
app.get('/', (req, res) => {
    res.render('login', { message: '' }); // Inicializar message como una cadena vacía
});

// Ruta para manejar la solicitud POST del formulario de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let message = ''; // Inicializar message aquí

    try {
        const response = await got.post(`${url_backend}/login`, {
            json: { username, password },
            responseType: 'json'
        });

        const result = response.body;
        if (result.success) {
            
            message = {
                text: `Login Successful! Auth Token: ${result.token}`, 
                className: 'alert-success'
            };
            
        } else {
            message = {
                text: 'Login Failed! Invalid username or password.', 
                className: 'alert-danger'
            };
        }
    } catch (error) {
        message = {
            text: 'Login Failed! There was an error.', 
            className: 'alert-danger'
        };
    }

    res.render('login', { message }); // Pasar message al método render
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});
