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
    service: 'Gmail',
    auth: {
        user: 'jiperez60@misena.edu.co',
        pass: 'wlkf amrb nsjd fdpk'
    }
});

// Función para enviar correo electrónico
async function enviarCorreo(destinatario, asunto, cuerpo) {
    const correoOptions = {
        from: 'jiperez60@misena.edu.co',
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

//  verificar el rol y filtrar citas
const verificarRol = (req, res, next) => {
    const rol = req.headers['role'];
    const id = req.headers['userid']; 


    if (!rol || !id) {
        return res.status(400).json({ mensaje: 'Rol o ID de usuario no proporcionados' });
    }

    if (rol === 'administrador') {
        next(); // Si es administrador, puede ver todas las citas
    } else if (rol === 'medico') {
        req.filtro = { "medico.idMedico": id }; 
        next();
    } else if (rol === 'paciente') {
        req.filtro = { "paciente.idPaciente": id }; 
        next();
    } else {
        res.status(403).json({ mensaje: "No tiene permisos para ver esta información" });
    }
};



// Ruta para crear una cita
router.post("/Create", async (req, res) => {
    const cita = new Citas(req.body);

    try {
        console.log(cita);
        cita.estadoCita = EstadoCita.ACTIVA;
        const citaGuardada = await cita.save();

        const fechaCita = new Date(citaGuardada.agenda.fechaAgenda);
        fechaCita.setDate(fechaCita.getDate() - 1);

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


// Traer todas las citas (con filtro por rol)
router.get("/GetAll", verificarRol, async (req, res) => {
    try {
        const filtro = req.filtro || {}; // Si no hay filtro, es administrador y ve todas las citas
        const encontradas = await Citas.find(filtro);
        res.json({
            mensaje: "Encontradas correctamente",
            data: encontradas,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Ocurrió un error al buscar las citas' });
    }
});


// Traer todas las citas de un paciente
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

// Traer citas por id
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
