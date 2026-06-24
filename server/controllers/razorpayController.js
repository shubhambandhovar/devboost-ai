const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If key is missing, mock it
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('No Razorpay credentials found. Mocking order creation.');
      return res.json({
        id: 'order_mock_' + Date.now(),
        amount: 1500 * 100, // in paise
        currency: 'INR',
        mock: true
      });
    }

    const options = {
      amount: 1500 * 100, // 1500 INR in paise (or $15 equivalent)
      currency: 'INR',
      receipt: 'receipt_order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay createOrder error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (mock || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('Mock payment verification successful.');
      user.plan = 'pro';
      await user.save();
      return res.json({ success: true, message: 'Payment verified successfully (Mock)' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      user.plan = 'pro';
      await user.save();
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Signature mismatch' });
    }
  } catch (error) {
    console.error('Razorpay verifyPayment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
