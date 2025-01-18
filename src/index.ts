import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenue sur votre API TypeScript !');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});