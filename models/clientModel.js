const mongoose = require('mongoose');
const Invoice = require('./invoiceModel'); // Import Invoice model

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
}, { _id: false });

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  phone: String,
  address: addressSchema,
  status: {
    type: String,
    enum: ['lead', 'active', 'inactive'],
    default: 'active',
    index: true,
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

// Mongoose Middleware: pre-hook for 'deleteOne'
clientSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  console.log(`Invoices for client ${this._id} are being removed.`);
  await Invoice.deleteMany({ client: this._id });
  next();
});


const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
