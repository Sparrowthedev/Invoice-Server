const Client = require("../models/clientModel");
const Vendor = require("../models/vendorModel");
const Invoice = require("../models/invoiceModel");
const mongoose = require("mongoose");
require("dotenv").config();

const addInvoice = async (req, res) => {
  const {
    clientId,
    invoiceDate,
    paymentTerms,
    productDescription,
    itemList,
    status,
  } = req.body;

  let total = 0;
  if (itemList) {
    itemList.forEach((i) => {
      total += i.total;
    });
  }

  try {
    if (
      !clientId ||
      !invoiceDate ||
      !paymentTerms ||
      !productDescription ||
      !status
    ) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    const newInvoice = new Invoice({
      ...req.body,
      client: clientId,
      vendor: req.vendor._id,
      grandTotal: total,
    });

    const invoice = await newInvoice.save();

    await Client.findByIdAndUpdate(clientId, {
      $push: { invoices: invoice._id },
    });

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getALlInvoice = async (req, res) => {
  try {
    const allInvoice = await Invoice.find({vendor: req.vendor._id})
      .sort({ createdAt: -1 })
      .populate(
        "client",
        "-vendor -clientPhone -invoices -_id -createdAt -updatedAt -__v"
      );
    res.status(200).json(allInvoice);
  } catch (error) {
    res.status(500).json({ Err: error.message });
  }
};

const getSingleInvoice = async (req, res) => {
  const {invoiceId} = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(invoiceId))
      return res.status(404).json({ Err: "No such item detail found" });

    const singleInvoice = await Invoice.findById(invoiceId).populate(
      "client",
      "-vendor -clientPhone -invoices -_id -createdAt -updatedAt -__v"
    );

    if (!singleInvoice)
      return res.status(404).json({ msg: "No such bill details found" });

    const billWasGivenBy = await Vendor.findById(req.vendor._id).select('-password  -createdAt -updatedAt -__v');

    res.status(200).json({ singleInvoice, billWasGivenBy });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateInvoice = async (req, res) => {
    const { invoiceId } = req.params 
    const { itemList } = req.body


    try {
        if(!mongoose.Types.ObjectId.isValid(invoiceId)) return res.status(404).json({msg: "No such invoice details found!!"})

        if(await Vendor.findById(req.vendor._id) === null) return res.status(404).json({msg: "Vendor not found"})

        const signedInvendor = await Vendor.findById(req.vendor._id);

        const invoiceToUpdate = await Invoice.findById(invoiceId)

        if(!invoiceToUpdate) return res.status(404).json({msg:"No such invoice details found!"})

        if(invoiceToUpdate.vendor.toString() !== signedInvendor._id.toString()) return res.status(401).json({msg: "Not authorized"})

        let grandTotal = 0;
        if (itemList) {
          itemList.forEach((i) => {
            grandTotal += i.total;
          });
        }

        const updatedInvoice = await Invoice.findOneAndUpdate({_id: invoiceId}, {...req.body, grandTotal, client: invoiceToUpdate.client}, {new: true})

        res.status(200).json(updatedInvoice)

    } catch (error) {
        res.status(500).json({Err: error.message})
    }

}
const deleteInvoice = async (req, res) => {
    const { invoiceId } = req.params 

    try {
        if(!mongoose.Types.ObjectId.isValid(invoiceId)) return res.status(404).json({msg: "No such invoice details found!!"})

        if(await Vendor.findById(req.vendor._id) === null) return res.status(404).json({msg: "Vendor not found"})

        const signedInvendor = await Vendor.findById(req.vendor._id);

        const invoiceToDelete = await Invoice.findById(invoiceId)

        if(!invoiceToDelete) return res.status(404).json({msg:"No such invoice details found!"})

        if(invoiceToDelete.vendor.toString() !== signedInvendor._id.toString()) return res.status(401).json({msg: "Not authorized"})

        const deletedInvoice = await Invoice.findOneAndDelete({_id: invoiceId})

        res.status(200).json(deletedInvoice)

    } catch (error) {
        res.status(500).json({Err: error.message})
    }

}

module.exports = {
  addInvoice,
  getALlInvoice,
  getSingleInvoice,
  updateInvoice,
  deleteInvoice
};
