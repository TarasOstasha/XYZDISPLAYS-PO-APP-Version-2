// import React, { useState } from 'react';
// import  Header from '../../components/Header';
// import  Footer from '../../components/Footer';

// function FetchFolderButton() {
//     const API_BASE_URL =
//     window.location.hostname === 'localhost'
//       ? 'http://localhost:5000'
//       : 'https://xyzdisplays-po-app-version-2-1.onrender.com'; 

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');

//     const handleFetchFolder = async () => {
//         setLoading(true);
//         setMessage('');
//         try {
//           // Fetch the message from the backend
//           const response = await fetch(`${API_BASE_URL}/api/updateFolder`, {
//               method: 'GET',
//           });
  
//           if (response.ok) {
//               const data = await response.json();
//               setMessage(data.message); // Set the test message from the backend
//               console.log("Message from backend:", data.message); // Log the message to the console
//           } else {
//               const errorData = await response.json();
//               setMessage(`Error: ${errorData.message}`);
//           }
//       } catch (error) {
//           console.error("Error fetching folder data:", error.message || error);
//           setMessage('Error fetching folder data. Please try again later.');
//       } finally {
//           setLoading(false);
//       }
//     };

//     return (
//         <div style={{ textAlign: 'center' }}>
//           <Header />
//             <button style={{ padding: '100px' }} onClick={handleFetchFolder} disabled={loading}>
//                 {loading ? 'Fetching...' : 'Update APP'}
//             </button>
//             {message && <p>{message}</p>}
//           <Footer />
//         </div>
//     );
// }

// export default FetchFolderButton;


import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function FetchFolderButton() {
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://xyzdisplays-po-app-version-2-1.onrender.com';

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(null);

    const pollProgress = () => {
        const interval = setInterval(async () => {
            const res = await fetch(`${API_BASE_URL}/api/updateFolder/progress`);
            const data = await res.json();
            setProgress(data);
    
            if (data.complete) {
                clearInterval(interval);
                setLoading(false);
                setMessage('Download complete!');
            }
        }, 1000);
    };

    const handleFetchFolder = async () => {
        setLoading(true);
        setMessage('');
        setProgress(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/updateFolder`);
            const data = await res.json();
            setMessage(data.message);

            pollProgress();
        } catch (error) {
            console.error(error);
            setMessage('Error starting download');
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Header />
            <button style={{ padding: '100px' }} onClick={handleFetchFolder} disabled={loading}>
                {loading ? 'Fetching...' : 'Update APP'}
            </button>
            {/* {progress && (
                <p>
                    Downloaded {progress.downloaded} of {progress.totalFiles}{' '}
                    {progress.currentFile && `(Current: ${progress.currentFile})`}
                </p>
            )} */}
            {message && <p>{message}</p>}
            {progress && (
                <>
                    <div style={{
                    width: '50%',
                    height: '25px',
                    margin: '20px auto',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0'
                    }}>
                    <div style={{
                        width: `${(progress.downloaded / progress.totalFiles) * 100}%`,
                        height: '100%',
                        backgroundColor: '#4caf50',
                        transition: 'width 0.3s ease'
                    }} />
                    </div>
                    <p>
                    Downloaded {progress.downloaded} of {progress.totalFiles}
                    {progress.currentFile && ` (Current: ${progress.currentFile})`}
                    </p>
                </>
            )}
            <Footer />
        </div>
    );
}

export default FetchFolderButton;
