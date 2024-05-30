import mongoose from "mongoose";

const citasSchema = new mongoose.Schema(
  {
    estadoCita: {
      type: String,
    },
    tipoCita: {
      type: String,
      required: true
    },
    agenda: {
      idAgenda: {
        type: String,
        required: true
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
        required: true
      },
      consultorio: {
        idConsultorio: {
          type: String,
          required: true
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
            type: String,
            required: true
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
        type: String,
        required: true
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
        required: true
      },
      documentoMedico: {
        type: String,
        required: true
      },
      estadoMedico: {
        type: String,
        required: true
      },
      especialidad: {
        type: String,
        required: true
      }
    },
    paciente: {
      idPaciente: {
        type: String,
        required: true
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
        required: true
      },
      documentoPaciente: {
        type: String,
        required: true
      },
      estadoPaciente: {
        type: String,
        required: true
      },
      correo: {
        type: String,
        required: true
      }
    }
  },
  { versionKey: false }
);

export default mongoose.model("Citas", citasSchema);

