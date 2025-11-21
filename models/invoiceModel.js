const mongoose = require('mongoose');
// A simple counter model for auto-incrementing invoice numbers
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 }
});
const Counter = mongoose.model('Counter', counterSchema);


const lineItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'void'],
    default: 'draft',
    index: true,
  },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  lineItems: [lineItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: String,
  paidOn: { type: Date },
}, { timestamps: true });

// --- INSTANCE METHODS ---
invoiceSchema.methods.markAsPaid = function() {
  if (this.status === 'paid') {
    throw new Error('Invoice is already marked as paid.');
  }
  this.status = 'paid';
  this.paidOn = new Date();
  return this.save();
};

// --- HOOKS ---
invoiceSchema.pre('save', async function(next) {
    // Auto-increment invoice number
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'invoiceNumber' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.invoiceNumber = `INV-${counter.seq}`;
    }

    // Auto-calculate totals, but only if line items are modified
    if (this.isModified('lineItems') || this.isModified('tax')) {
      this.subtotal = this.lineItems.reduce((acc, item) => acc + item.totalPrice, 0);
      this.total = this.subtotal * (1 + (this.tax || 0) / 100);
    }
    
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
