import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/verify-email/${token}`);
        // handle successful verification
        console.log(response.data.message);
      } catch (error) {
        // handle error
        console.error('Email verification error:', error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      {/* Display some message or loading animation */}
      <p>Verifying email...</p>
    </div>
  );
};

export default EmailVerification;
