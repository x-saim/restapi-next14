import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: { type: 'string', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, //this will add reference to User model
  },
  { timestamps: true }
);

export const Category = models.Category || model('Category', CategorySchema);
