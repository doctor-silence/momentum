const asyncHandler = require('express-async-handler');
const Invoice = require('../models/invoiceModel');
const Product = require('../models/productModel');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'issueDate', order = 'desc', status, clientId } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (clientId) query.client = clientId;

  const invoices = await Invoice.find(query)
    .populate('client', 'companyName contactName')
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Invoice.countDocuments(query);

  res.json({
    invoices,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
    const { client, issueDate, dueDate, lineItems, notes, tax, status } = req.body;

    // Pre-process line items to fetch product data if only productId is given
    const processedLineItems = await Promise.all(lineItems.map(async (item) => {
        let { productId, description, quantity, unitPrice } = item;
        
        if (productId && (!description || !unitPrice)) {
            const product = await Product.findById(productId);
            if (!product) throw new Error(`Product with ID ${productId} not found`);
            description = description || product.name;
            unitPrice = unitPrice || product.price;
        }

        if (!description || !quantity || unitPrice == null) {
            throw new Error('Line items must include description, quantity, and unit price.');
        }

        return {
            productId,
            description,
            quantity,
            unitPrice,
            totalPrice: quantity * unitPrice,
        };
    }));

    const invoice = new Invoice({
        client,
        issueDate,
        dueDate,
        lineItems: processedLineItems,
        notes,
        tax,
        status,
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate('client', 'companyName email');
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});

// @desc    Mark an invoice as paid
// @route   PUT /api/invoices/:id/pay
// @access  Private
const markInvoiceAsPaid = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
        if (invoice.status === 'paid') {
            res.status(400);
            throw new Error('Invoice is already paid');
        }
        
        await invoice.markAsPaid();
        res.json({ message: `Invoice ${invoice.invoiceNumber} marked as paid.`});
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});


module.exports = {
    getInvoices,
    createInvoice,
    getInvoiceById,
    markInvoiceAsPaid,
}
