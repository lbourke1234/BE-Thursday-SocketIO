import mongoose from 'mongoose'

const { Schema, model } = mongoose

const RoomsSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: String }]
  },
  { timestamps: true }
)

export default model('Room', RoomsSchema)
