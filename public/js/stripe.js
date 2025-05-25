import axios from 'axios';
import { showAlert } from './alerts';
export const bookTour = async tourId => {
    const stripe = Stripe('pk_test_51RSOhfHBugTWRfi4JVfGXs6eC9uaxLmiNHUjoK75ITkFfGTQgLvv7E56nbWwbCKOtMqoKmiatzzrotcNTmRbO8r500789f9pSB');
    // 1) Get checkout session from API
    try{
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`, {
            method: 'GET',
            params: {
                tourId
            }
        });
        console.log(session);

        // 2) Create checkout form  + charge the credit card  
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
        
        // 3) If successful, show success message
        showAlert('success', 'Your payment was successful! Thank you for booking with us.');

    }catch(err){
        showAlert('error', 'There was an error processing your payment. Please try again later.');
        console.log('Error fetching checkout session:', err);
    }
    
};