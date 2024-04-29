import mongoose from "mongoose";

const citasSchema = new mongoose.Schema(
	{
		agenda: {
			id: {
				type: String,
				required: true,
				unique: true,
			},
			fecha: {
				type: Date,
				required: true,
			},
			consultorio: {
				id: {
					type: String,
					required: true,
					unique: true,
				},
				codigo: {
					type: String,
					required: true,
				},
				sede: {
					id: {
						type: String,
						required: true,
						unique: true,
					},
					direccion: {
						type: String,
						required: true,
					},
				},
			},
		},
		estadoCita: {
			type: String,
			required: true,
		},
		tipoCita: {
			type: String,
			required: true,
		},
		paciente: {
			id: {
				type: String,
				required: true,
			},
			nombre: {
				type: String,
				required: true,
			},
			apellido: {
				type: String,
				required: true,
			},
			telefono: {
				type: String,
				required: true,
			},
			correo: {
				type: String,
				required: true,
			},
		},
	},
	{
		colletion: "Citas",
		versionKey: false,
	}
);

export default mongoose.model("Citas", citasSchema);
