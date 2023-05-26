const { CognitoJwtVerifier } = require("aws-jwt-verify");
//Checks token, expiry and see what group user belongs to or assign them
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;


const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USER_POOL_ID,
    tokenUse: "id",  //Either ID (Contains info about the user) or access
    clientId: COGNITO_WEB_CLIENT_ID
})

const generatePolicy = (principalId, effect, resource) => {
    console.log('generate pikucy is running')
    let authResponse ={};
    authResponse.principalId = principalId;
    if(effect && resource) {
        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        };
  
      authResponse.policyDocument = policyDocument;  
    }

    //examples of flexibility of authorizer
    //validating oauth token
    authResponse.context = {
        foo: "bar"
    }
    return authResponse;
}

const handler = async (event, context, cb) => {
// Lambda authorizer code
// Take authorization  header and check it
    let token = event.authorizationToken; // allow or deny access to API
    try {
        console.log('TRY BLOCK GOINGGGG')
        // const payload = await jwtVerifier.verify(token);
        // console.log('PAYLOAD ISSSSS', payload);
        console.log('ARN is', event.methodArn);
        const payload = await jwtVerifier.verify(token);
        console.log('PAYLOAD ISSSSS', payload);
        cb(null, generatePolicy(
            "user",
            "Allow",
             event.methodArn // Return the ARN of the endpoint   
        ))

    } catch (err) {
        cb("Error: somethings not right", err);

    }

}


//Depricted
// const authorizer = (event, context, cb) => {
//     // Lambda authorizer code
//     // Take authorization  header and check it
//         let token = event.authorizationToken; // allow or deny access to API
//         switch(token) {
//             case "allow":
//                 cb(null, generatePolicy(
//                     "user",
//                     "Allow",
//                      event.methodArn // Return the ARN of the endpoint
//                 )) //Return the Iam policy
//                 break; 
//             case "deny":
//                 cb(null, generatePolicy(
//                     "user",
//                     "Deny"
//                 ))
//                 break;
//             default: 
//                 cb("Error: Invalid Token");
//         }
    
    
//     }

module.exports = {
    handler
}