import React, { useState } from 'react';
import  Header from '../../components/Header';
import  Footer from '../../components/Footer';

function FetchFolderButton() {
    const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'http://server:5000'; 

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFetchFolder = async () => {
        setLoading(true);
        setMessage('');
        try {
          // Fetch the message from the backend
          const response = await fetch(`${API_BASE_URL}/api/updateFolder`, {
              method: 'GET',
          });
  
          if (response.ok) {
              const data = await response.json();
              setMessage(data.message); // Set the test message from the backend
              console.log("Message from backend:", data.message); // Log the message to the console
          } else {
              const errorData = await response.json();
              setMessage(`Error: ${errorData.message}`);
          }
      } catch (error) {
          console.error("Error fetching folder data:", error.message || error);
          setMessage('Error fetching folder data. Please try again later.');
      } finally {
          setLoading(false);
      }
    };

    return (
        <div style={{ textAlign: 'center' }}>
          <Header />
            <button style={{ padding: '100px' }} onClick={handleFetchFolder} disabled={loading}>
                {loading ? 'Fetching...' : 'Update APP'}
            </button>
            {message && <p>{message}</p>}
          <Footer />
        </div>
    );
}

export default FetchFolderButton;
