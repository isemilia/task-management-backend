import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    required: true
  },
  labels: {
    type: Array,
    default: []
  },
  status: {
    type: Object,
    default: {
      id: 1
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('task', TaskSchema);