const Stripe = require('stripe');
const User = require('../models/User');

// Initialize stripe with a dummy key if env var is missing so the app doesn't crash, 
// but it will fail when trying to create a session if the real key isn't provided.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

exports.createCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    // MOCK CHECKOUT FLOW (For testing without actual Stripe API Keys)
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('No STRIPE_SECRET_KEY found. Mocking successful checkout.');
      
      // Instantly upgrade user for testing purposes
      user.plan = 'pro';
      await user.save();

      // Return a simulated success redirect URL
      const successUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?success=true`;
      return res.json({ url: successUrl });
    }

    // REAL STRIPE CHECKOUT FLOW
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DevBoost AI Pro',
              description: 'Unlimited AI Generations & Premium Tools',
            },
            unit_amount: 1500, // $15.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing?canceled=true`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
