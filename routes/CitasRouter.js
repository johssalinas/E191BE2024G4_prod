import { Router } from "express";
import Citas from "../model/Citas.js";
import cron from "node-cron";
import moment from "moment-timezone";
import nodemailer from "nodemailer";

const router = Router();

/*
{
    user: 'fkm7a5zj6o3zkjrp@ethereal.email',
    pass: 'k7EsMJRTbmKDDf7xHu',
    smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
    imap: { host: 'imap.ethereal.email', port: 993, secure: true },
    pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
    web: 'https://ethereal.email'
} */
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	secure: false,
	auth: {
		user: "fkm7a5zj6o3zkjrp@ethereal.email",
		pass: "k7EsMJRTbmKDDf7xHu",
	},
});

// Tarea programada para verificar y enviar recordatorios 1 días antes de la cita
// Para pruebas tamibien se comprueba cada 30 segundos
cron.schedule("*/30 * * */1 * *", async () => {
	const mañana = moment()
		.tz("America/Bogota")
		.startOf("day")
		.add(1, "days")
		.hour(0)
		.minute(0)
		.second(0);

	const pasadoMañana = moment(mañana)
		.add(1, "days")
		.hour(0)
		.minute(0)
		.second(0);

	try {
		// Buscar citas para mañana
		const citas = await Citas.find({
			"agenda.fecha": {
				$gte: mañana.toDate(), // Mayor o igual que la medianoche de hoy
				$lt: pasadoMañana.toDate(), // Menor que la medianoche del día siguiente
			},
			estadoCita: "Confirmada",
		});

		// Enviar recordatorio para cada cita encontrada
		for (const cita of citas) {
			await enviarRecordatorio(cita);
		}
	} catch (error) {
		console.error("Error al enviar recordatorio:", error);
	}
});

// Función para enviar el recordatorio
async function enviarRecordatorio(cita) {
	try {
		const data = await transporter.sendMail({
			from: "jbsalinas@uts.edu.co",
			to: cita.paciente.correo,
			subject: "Recordatorio de cita",
			text: `<p>Este es un recordatorio para tu cita de aquí:</p>
                   <p>Fecha: ${moment(cita.agenda.fecha)
											.tz("America/Bogota")
											.format("YYYY-MM-DD HH:mm:ss")}</p>
                   <p>No faltes!</p>`,
		});
		console.log(
			"Recordatorio enviado correctamente al correo:",
			cita.paciente.correo
		);
	} catch (error) {
		console.error(
			"Error al enviar el recordatorio para la cita:",
			cita._id,
			error
		);
	}
}

//Traer todas las citas
router.get("/GetAll", async (req, res) => {
	const encontradas = await Citas.find();
	try {
		res.json({
			mensaje: "Encontradas correctamente",
			data: encontradas,
		});
	} catch (error) {
		console.log(error);
	}
});

//Traer todas las citas de un paciente
router.get("/SearchByIdPaciente/:id", async (req, res) => {
	try {
		const citas = await Citas.find({ "paciente.id": req.params.id });

		res.json({
			mensaje: "Citas encontradas correctamente",
			data: citas,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ mensaje: "Ocurrió un error al buscar las citas" });
	}
});

//Traer citas por id
router.get("/SearchByIdCita/:id", async (req, res) => {
	try {
		const cita = await Citas.findById(req.params.id);

		res.json({
			mensaje: "Cita encontrada por id correctamente",
			data: cita,
		});
	} catch (error) {
		console.log(error);
	}
});

//Crear una cita
router.post("/Create", async (req, res) => {
	const cita = new Citas(req.body);

	try {
		const citaGuardada = await cita.save();

		res.json({
			mensaje: "Creada correctamente",
			data: citaGuardada,
		});
	} catch (error) {
		console.log(error);
	}
});

//Actualizar estado una cita
router.patch('/Update/:id', async (req, res) => {
    try {
        // Busca la cita por su ID y actualiza el estado
        const citaActualizada = await Citas.findByIdAndUpdate(req.params.id, { estadoCita: req.body.estadoCita }, { new: true });

        res.json({
            mensaje: 'Estado de cita actualizado correctamente',
            data: citaActualizada
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Ocurrió un error al actualizar la cita' });
    }
});

export default router;
