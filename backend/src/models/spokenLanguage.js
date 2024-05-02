import mongoose from 'mongoose'
import { nativeNames } from '../utils/languages'

const Schema = mongoose.Schema

const SpokenLanguageSchema = new Schema({
  language: {
    type: String,
    enum: nativeNames,
    required: true
  },
  level: {
    type: String,
    required: true
  }
})

export default mongoose.model('SpokenLanguage', SpokenLanguageSchema)
