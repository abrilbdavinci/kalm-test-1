import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  scoreKey: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [optionSchema]
});

const testSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [questionSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Test', testSchema, 'tests');
