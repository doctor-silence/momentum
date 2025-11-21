const cron = require('node-cron');
const Invoice = require('../models/invoiceModel');

// This job runs every day at 1:00 AM.
const scheduleOverdueCheck = () => {
  cron.schedule('0 1 * * *', async () => {
    console.log('Running a daily check for overdue invoices...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    try {
      const overdueInvoices = await Invoice.find({
        status: 'sent',
        dueDate: { $lt: today },
      });

      if (overdueInvoices.length === 0) {
        console.log('No overdue invoices found.');
        return;
      }

      console.log(`Found ${overdueInvoices.length} overdue invoices. Updating...`);

      for (const invoice of overdueInvoices) {
        invoice.status = 'overdue';
        await invoice.save();
        
        // --- NOTIFICATION LOGIC ---
        // Here you would integrate with an email service (e.g., SendGrid, Nodemailer)
        // or a notification service to alert the relevant user.
        console.log(`- Invoice ${invoice.invoiceNumber} for client ${invoice.client} marked as overdue. Sent notification.`);
        // Example: sendOverdueNotification(invoice.client.manager, invoice);
      }
    } catch (error) {
      console.error('Error checking for overdue invoices:', error);
    }
  });
};

module.exports = { scheduleOverdueCheck };
