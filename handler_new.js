'use strict';
const  DynamoDBClient = require( "@aws-sdk/client-dynamodb");
// const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-1'})
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand
  } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1"});
const ddbDocClient = DynamoDBDocumentClient.from(client); 


module.exports.createNote = async (event, context, cb) => {
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: 'notes',
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      //Pass condition to check if id is unique
      ConditionExpression: "attribute_not_exists(notesId)"
    }
    //make dpcument client a promise
    await ddbDocClient.send(new PutCommand(params)); 
    cb(null, {
      statusCode: 201,
      body: JSON.stringify(data)
    })
  } catch (err) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(err)
    })
  }

};

module.exports.updateNote = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `The note with the id of ${noteId} has been updated`,
      }
    ),
  };
};


module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `The note with the id of ${noteId} has been deleted`,
      }
    ),
  };
};


module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `You've retrieved all notes`,
      }
    ),
  };
};
