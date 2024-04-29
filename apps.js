import express from 'express'
import cors from 'cors'
import { connectMongo } from './db/ConectionDb.js';
import router from './routes/CitasRouter.js'



const app = express();
app.use(cors());
app.use(express.json());
app.use('/citas', router);

const PORT = process.env.PORT || 3000;



//Conexion a la base de datos
connectMongo();
app.listen( PORT, () => {
    console.log('Servidor corriendo en el puerto ', PORT);
})



export default app;