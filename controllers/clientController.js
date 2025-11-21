const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');

// @desc    Get all clients with filtering, sorting, and pagination
// @route   GET /api/clients
// @access  Private
const getClients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.companyName = { $regex: search, $options: 'i' };
  }

  const clients = await Client.find(query)
    .populate('managedBy', 'firstName lastName')
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Client.countDocuments(query);

  res.json({
    clients,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalClients: count,
  });
});

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone, address, status } = req.body;

  const client = new Client({
    companyName,
    contactName,
    email,
    phone,
    address,
    status,
    managedBy: req.user._id, // Assign logged-in user as manager
  });

  const createdClient = await client.save();
  res.status(201).json(createdClient);
});

// @desc    Get a single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate('managedBy', 'fullName email');

  if (client) {
    res.json(client);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone, address, status, managedBy } = req.body;

  const client = await Client.findById(req.params.id);

  if (client) {
    client.companyName = companyName || client.companyName;
    client.contactName = contactName || client.contactName;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.address = address || client.address;
    client.status = status || client.status;
    if (req.user.role ==='admin' && managedBy) {
        client.managedBy = managedBy;
    }

    const updatedClient = await client.save();
    res.json(updatedClient);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = asyncHandler(async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (client) {
        await client.deleteOne();
        res.json({ message: 'Client removed' });
    } else {
        res.status(404);
        throw new Error('Client not found');
    }
});


module.exports = {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
};
