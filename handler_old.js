'use strict';
const DynamoDB = require("@aws-sdk/clients/dynamodb")
const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-1'})
const AWS = require ("aws-sdk");
const  { uuid }   = require('uuidv4');


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
      ConditionExpression: "attribute_not_exists(notesId"
    }
    //make dpcument client a promise
    await documentClient.put(params).promise();
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
