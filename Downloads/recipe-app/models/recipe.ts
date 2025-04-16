import mongoose, { Schema, type Document } from "mongoose"

export interface IRecipe extends Document {
  title: string
  description: string
  ingredients: string[]
  instructions: string
  cookingTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  imageUrl?: string
  user: mongoose.Types.ObjectId
  likes: number
  createdAt: Date
  updatedAt: Date
}

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema)
