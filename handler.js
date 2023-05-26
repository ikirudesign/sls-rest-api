'use strict';

const db = require("./db")

const { 
  marshall , 
  unmarshall
} = require("@aws-sdk/util-dynamodb");
const { 
  PutItemCommand, 
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand


} = require("@aws-sdk/client-dynamodb");

const createNote = async (event) => {
  const response = { statusCode: 201, headers: { 'Access-Control-Allow-Origin': '*' }  };
  try {
    //Parse the event body first
    const body = JSON.parse(event.body);
    //get all the keys in the body
    const params = {
      TableName: 'notes',
      //Put the item we want tos tore in dynamodb
      Item: marshall(body || {}),
      //Male sure there is no copy
      ConditionExpression: "attribute_not_exists(notesId)"
      //Uses update expression specific to dynamo. Updates existing docs in the table. 
    };
    const updateResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully created the note.",
      createResult
    })
  } catch (e) {
    console.error(e);
    response.statusCode = 500; 
    response.body = JSON.stringify({
      message: "Failed to update a note",
      errorMsg: e.message,
      errorStack: e.stack,
    })
  }
}

const updateNote = async (event) => {
  const response = { statusCode: 200 };
  try {
    //Parse the event body first
    const body = JSON.parse(event.body);
    const params = {
      TableName: 'notes',
      //Put the item we want tos tore in dynamodb
      Key: marshall({ noteId: event.pathParameters.noteId }),
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
          ...acc,
          [`:value${index}`]: body[key],
      }), {})),
    };
    const createResult = await db.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully createde note.",
      createResult
    })
  } catch (e) {
    console.error(e);
    response.statusCode = 500; 
    response.body = JSON.stringify({
      message: "Failed to create a note",
      errorMsg: e.message,
      errorStack: e.stack,
    })
  }
}


const deleteNote = async (event) => {
  const response = { statusCode: 200 };
  try {
    //Parse the event body first
    const body = JSON.parse(event.body);
    const params = {
      TableName: 'notes',
      //Put the item we want tos tore in dynamodb
      Key: marshall({ noteId: event.pathParameters.noteId })
    };
    const createResult = await db.send(new DeleteItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully deleted.",
      createResult
    })
  } catch (e) {
    console.error(e);
    response.statusCode = 500; 
    response.body = JSON.stringify({
      message: "Failed to delete the note",
      errorMsg: e.message,
      errorStack: e.stack,
    })
  }
}



const getAllNotes = async (event, context, cb) => {
  const response = {
    headers:{
      statusCode:200,
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Credentials':"true",
      "Content-Type":"application/json"
    },
     };
  try {
      const { Items } = await db.send(new ScanCommand({ 
        TableName: 'notes'
      }));

      response.body = JSON.stringify({
          message: "Successfully retrieved all notes.",
          data: Items.map((item) => unmarshall(item)),
          Items,
      });
      console.log('event is...', JSON.stringify(event))
  } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.body = JSON.stringify({
          message: "Failed to retrieve notes.",
          errorMsg: error.message,
          errorStack: error.stack,
      });
      throw error; 
  } 
return response; 
};


module.exports = {
  createNote,
  updateNote,
  deleteNote,
  getAllNotes

}
