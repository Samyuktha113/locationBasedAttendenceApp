import axios from 'axios';

// Function to send email notification
export const sendEmailNotification = async (email, details) => {
  try {
    const response = await axios.post('YOUR_BACKEND_ENDPOINT/sendEmail', {
      to: email,
      subject: 'New Onsite Work Assigned',
      text: `You have been assigned new onsite work at ${details.location}. Details: ${details.details}`,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email notification');
  }
};

// Function to send app notification (adjust this based on your FCM implementation)
export const sendAppNotification = async (eid, payload) => {
  try {
    const response = await axios.post('YOUR_BACKEND_ENDPOINT/sendNotification', {
      eid,
      payload,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending app notification:', error);
    throw new Error('Failed to send app notification');
  }
};
