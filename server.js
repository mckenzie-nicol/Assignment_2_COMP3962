const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// Create DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Middleware for parsing JSON body
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));


// Endpoint for adding a new todo item to DynamoDB
app.post('/api/todo_item', (req, res) => {
    //
    const params = {
        TableName: 'COMP3962-assignment2',
        Item: {
            todo_item: req.body.new_todo_item
        }
    };
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error('Error writing to DynamoDB:', err);
            res.status(500).json({ error: 'Error writing to DynamoDB' });
        } else {
            res.json({ status: 'success' });
        }
    });
});

// Endpoint for fetching todo list items from DynamoDB
app.get('/api/todo_item', (req, res) => {
    const params = {
        TableName: 'COMP3962-assignment2'
    };

    dynamodb.scan(params, (err, data) => {
        if (err) {
            console.error('Error reading from DynamoDB:', err);
            res.status(500).json({ error: 'Error reading from DynamoDB' });
        } else {
            res.json(data.Items);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
