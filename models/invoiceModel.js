const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Please provide the client that has this invoice"],
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Please provide the vendor that has this invoice"],
    },
    invoiceDate: {
      type: String,
      required: [true, "Please Provide the invoice date"],
    },
    paymentTerms: {
      type: String,
      required: [true, "Please Provide the payment terms"],
    },
    productDescription: {
      type: String,
      required: [true, "Please Provide the product desctiption"],
    },
    status: {
      type: String,
      required: [true, "Please add a bill status"],
    },
    itemList: [
      {
        itemName: String,
        itemQuantity: String,
        itemPrice: String,
        total: Number,
      },
    ],
    grandTotal: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
