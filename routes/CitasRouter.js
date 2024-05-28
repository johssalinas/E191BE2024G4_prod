import { Router } from "express";
import Citas from "../model/Citas.js";

import nodemailer from "nodemailer";

const router = Router();

const EstadoCita = Object.freeze({
	ACTIVA: "Activa",
	CANCELADA: "Cancelada",
});

// Configurar nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Cambia el servicio según tus necesidades
    auth: {
        user: 'jiperez60@misena.edu.co', // Cambia por tu dirección de correo electrónico
        pass: 'wlkf amrb nsjd fdpk' // Cambia por tu contraseña 
    }
});

// Función para enviar correo electrónico
async function enviarCorreo(destinatario, asunto, cuerpo) {
    const correoOptions = {
        from: 'jiperez60@misena.edu.co', // Cambia por tu dirección de correo electrónico
        to: destinatario,
        subject: asunto,
        html: cuerpo
    };

    try {
        await transporter.sendMail(correoOptions);
        console.log("Correo electrónico enviado correctamente.");
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
}

// Ruta para crear una cita
router.post("/Create", async (req, res) => {
    const cita = new Citas(req.body);

    try {
        console.log(cita);
        cita.estadoCita = EstadoCita.ACTIVA;
        const citaGuardada = await cita.save();

        // Enviar correo electrónico de recordatorio un día antes de la cita
        const fechaCita = new Date(citaGuardada.agenda.fechaAgenda);
        fechaCita.setDate(fechaCita.getDate() - 1); // Resta un día

        const destinatario = citaGuardada.paciente.correo;
        const asunto = 'Recordatorio de cita';
        const cuerpo = `Recuerda que tienes una cita programada para el día ${fechaCita.toLocaleDateString()} a las ${fechaCita.toLocaleTimeString()}.`;

        enviarCorreo(destinatario, asunto, cuerpo);

        res.status(201).json({
            mensaje: "Creada correctamente",
            data: citaGuardada,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Ocurrió un error al crear la cita' });
    }
});

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



// Cancelar una cita
router.patch('/CancelCita/:id', async (req, res) => {
    try {
        // Busca la cita por su ID y actualiza el estado
        const citaActualizada = await Citas.findByIdAndUpdate(req.params.id, { estadoCita: EstadoCita.CANCELADA }, { new: true });

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
