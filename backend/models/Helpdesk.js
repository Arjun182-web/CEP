//const mongoose = require("mongoose"); 

//const helpdeskSchema = new mongoose.Schema(
  //{
 //   userId: {
    //  type: mongoose.Schema.Types.ObjectId,
   //   ref: "User",
     // required: true,
   // },
    //message: String,
   // response: String,
   /// isResponded: {
    //  type: Boolean,
    //  default: false, // ✅ new field
    //},
  //},
  //{ timestamps: true }
//);

const mongoose = require("mongoose");

const helpdeskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Helpdesk", helpdeskSchema);
