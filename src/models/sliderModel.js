const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      index: true,
      default: 1,
    },
    Name: {
      type: String,
      required: true,
    },
    // Page: {
    //   type: String,
    //   required: true,
    // },
    Slides: [
      {
        Image: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "media",
        },
        General: {
          Caption1: {
            type: String,
          },
          Caption2: {
            type: String,
          },
          Direction: {
            type: String,
          },
          CallToActionText: {
            type: String,
          },
          CallToActionURL: {
            type: String,
          },
          NewWindow: {
            type: Boolean,
          },
        },
        Options: [
          {
            target: {
              type: String,
            },
            Delay: {
              type: Number,
            },
            Effect: {
              type: String,
            },
          },
        ],
      },
    ],
    Settings: {
      Speed: {
        type: Number,
      },
      Fade: {
        type: Boolean,
      },
      Autoplay: {
        type: Boolean,
      },
      AutoplaySpeed: {
        type: Number,
      },
      Dots: {
        type: Boolean,
      },
      Arrows: {
        type: Boolean,
      },
    },
  },
  { timestamps: true }
);


function autoPopulateSubs(next) {
  this.populate("Slides.Image");
  next();
}

sliderSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

module.exports = Slider = mongoose.model("slider", sliderSchema);
