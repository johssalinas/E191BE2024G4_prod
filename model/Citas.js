import mongoose from "mongoose";

const citasSchema = new mongoose.Schema(
	{
		estadoCita: {
		  type: String,
		  enum: ['Activa', 'Cancelada'],
		  required: true
		},
		tipoCita: {
		  type: String,
		  enum: ['Consulta general', 'Odontología', 'Psicología'],
		  required: true
		},
		agenda: {
		  idAgenda: {
			type: mongoose.Types.ObjectId,
			required: true,
			unique: true
		  },
		  fechaAgenda: {
			type: Date,
			required: true
		  },
		  horaAgenda: {
			type: String,
			required: true
		  },
		  estadoAgenda: {
			type: String,
			enum: ['Activa', 'Cancelada'],
			required: true
		  },
		  consultorio: {
			idConsultorio: {
			  type: mongoose.Types.ObjectId,
			  required: true,
			  unique: true
			},
			codigoConsultorio: {
			  type: String,
			  required: true
			},
			descripcionConsultorio: {
			  type: String,
			  required: true
			},
			sede: {
			  idSede: {
				type: mongoose.Types.ObjectId,
				required: true,
				unique: true
			  },
			  nombreSede: {
				type: String,
				required: true
			  },
			  direccionSede: {
				type: String,
				required: true
			  },
			  departamento: {
				type: String,
				required: true
			  },
			  municipio: {
				type: String,
				required: true
			  },
			  codigoUbicacion: {
				type: String,
				required: true
			  }
			}
		  }
		},
		medico: {
		  idMedico: {
			type: mongoose.Types.ObjectId,
			required: true,
			unique: true
		  },
		  nombresMedico: {
			type: String,
			required: true
		  },
		  apellidosMedico: {
			type: String,
			required: true
		  },
		  tipoDocumentoMedico: {
			type: String,
			enum: ['Cédula de ciudadanía', 'Tarjeta de Identidad', 'Cédula de Extranjería', 'Registro Civil de Nacimiento'],
			required: true
		  },
		  documentoMedico: {
			type: String,
			required: true
		  },
		  estadoMedico: {
			type: String,
			enum: ['Activo', 'Cancelado'],
			required: true
		  },
		  especialidad: {
			type: String,
			required: true
		  }
		},
		paciente: {
		  idPaciente: {
			type: mongoose.Types.ObjectId,
			required: true,
			unique: true
		  },
		  nombresPaciente: {
			type: String,
			required: true
		  },
		  apellidosPaciente: {
			type: String,
			required: true
		  },
		  tipoDocumentoPaciente: {
			type: String,
			enum: ['Cédula de ciudadanía', 'Tarjeta de Identidad', 'Cédula de Extranjería', 'Registro Civil de Nacimiento'],
			required: true
		  },
		  documentoPaciente: {
			type: String,
			required: true
		  },
		  estadoMedico: {
			type: String,
			enum: ['Activo', 'Cancelado'],
			required: true
		  },
		}
	},
);

export default mongoose.model("Citas", citasSchema);
