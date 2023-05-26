const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const region = "us-east-1"
const client = new DynamoDBClient({
    region,
    MaxRetries: 3,
    httpOptions: {
        timeout: 5000
    }
});

module.exports = client; 