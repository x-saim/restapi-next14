import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: 'string', required: true, unique: true },
    username: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);
