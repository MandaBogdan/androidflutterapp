const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const http = require('http');

const apiEndpoint = 'http://localhost:8000';

const axios = require('axios');

async function sendStringToFlutter(yourString) {
  const flutterServerUrl = 'http://localhost:49430/'; // Replace with your Flutter server URL

  try {
    const response = await axios.post(`${flutterServerUrl}/api/upload`, {
      yourString: yourString,
    });

    console.log('String uploaded successfully. Server response:', response.data);
  } catch (error) {
    console.error('Failed to upload string. Error:', error.message);
  }
}

// Example usage
const yourString = 'Hello, Flutter!'; // Replace with your actual string
sendStringToFlutter(yourString);


// Parse incoming JSON requests
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.post('/', (req, res) => {
    if (req.body.hasOwnProperty('image')) {
        // Access the uploaded image using req.body
        console.log('HELOOOOOOOOOOOO');
        var realFile = Buffer.from(req.body.image, "base64");
        fs.writeFileSync('image.jpg', realFile);

        // Send a response
        res.status(200).json({ message: 'Image uploaded successfully' });

        const userid = Math.floor(Math.random() * 1000000);

        // Make an HTTP POST request to the other server without waiting for a response
        const apiReq = http.request(apiEndpoint, { method: 'POST' }, (apiRes) => {
            apiRes.on('data', () => {}); // Consume the response data to avoid memory leaks
            apiRes.on('end', () => {
            console.log('uid sent to other server');
            });
        });

        apiReq.on('error', (error) => {
            console.error('Error sending uid to other server:', error.message);
        });

        // Write the yesno decision to the request body
        apiReq.write(JSON.stringify({ uid: userid }));

        // End the request
        apiReq.end();

        sendImageToServer(req.body.image);


    } else if (req.body.hasOwnProperty('yesno')) {
        // Access the decision (yes or no)
        const decision = req.body.yesno;

        // Your yesno handling logic here
        console.log("decision")
        console.log(decision)

        // Send a response
        res.status(200).json({ message: `Decision received: ${decision}` });

        // Make an HTTP POST request to the other server without waiting for a response
        const apiReq = http.request(apiEndpoint, { method: 'POST' }, (apiRes) => {
            apiRes.on('data', () => {}); // Consume the response data to avoid memory leaks
            apiRes.on('end', () => {
            console.log('Yesno decision sent to other server');
            });
        });

        apiReq.on('error', (error) => {
            console.error('Error sending yesno decision to other server:', error.message);
        });

        // Write the yesno decision to the request body
        apiReq.write(JSON.stringify({ yesno: decision }));

        // End the request
        apiReq.end();


    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



function sendImageToServer(base64Image) {
    const postData = JSON.stringify({ image: base64Image });
  
    const options = {
      hostname: 'localhost', // Replace with the other server's hostname
      port: 3000, // Replace with the other server's port
      path: '/', // Replace with the other server's upload endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };
  
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
  
      res.on('data', (chunk) => {
        console.log(chunk.toString());
      });
    });
  
    req.on('error', (error) => {
      console.error(`Error making request: ${error.message}`);
    });
  
    // Write data to request body
    req.write(postData);
    req.end();
  }

  