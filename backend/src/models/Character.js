const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true 
    },
    input: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      characterClass: {
        type: String,
        trim: true
      },
      personality: {
        type: String,
        trim: true
      },
      appearance: {
        type: String,
        trim: true
      },
      specialFeatures: {
        type: String,
        trim: true
      },
      imageCount: {
        type: Number,
        default: 1,
        min: 1,
        max: 8
      }
    },
    generated: {
      images: {
        type: [imageSchema],
        default: []
      },
      story: {
        type: String
      }
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
      index: true
    }
  },
  {
    timestamps: true
  }
);

characterSchema.index({ userId: 1, createdAt: -1 });

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;
