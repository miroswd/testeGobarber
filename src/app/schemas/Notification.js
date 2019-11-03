// Representação do schema no mongo
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    // Informando os campos dentro do schema
    content: {
      // conteúdo da notificação
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      // Se a notificação, esquema do facebook, quando abrir já será lida
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
