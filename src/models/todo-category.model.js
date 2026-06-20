import mongoose from "mongoose";

const subtodoSchema = mongoose.Schema(
  {
    todoTitle: {
      type: String,
    required:[true," subtitle is the required field"]
    },
    status: {
      type: String,
      enum: ["completed", "pending", "delete"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const todoCategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
    required:[true," category name is the required field"]
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    subtodos: [subtodoSchema],
  },
  { timestamps: true },
);

export const TodoCategory = mongoose.model("TodoCategory", todoCategorySchema);
