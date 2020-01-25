
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }
    
   // console.log('Received event (', rideId, '): ', event);
    const useruid = event.requestContext.authorizer.claims['sub'];
    const requestBody = JSON.parse(event.body);
    console.log('Received event (', requestBody.data, '): ', event);
    //vérifier si l'utilisateur a fourni les infos complémentaires
    no_info_comp(useruid).then(() => {
        callback(null, {});
    }).catch((err) => {
        errorResponse("no_info_comp", context.awsRequestId, callback);
    });
    
    
    //vérifier si les infos complémentaire de l'utilisateur sont validées
    no_info_comp_validated(useruid).then(() => {
        callback(null, {});
    }).catch((err) => {
        errorResponse("no_info_comp_validated", context.awsRequestId, callback);
    });
    
    switch(requestBody.action) {
        case "update":
                update_data(useruid,requestBody.data).then(() => {
                    callback(null, {
                                    statusCode: 200,
                                    body: "update ok",
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                    },
                                    });
                }).catch((err) => {
                    errorResponse("update_data", context.awsRequestId, callback);
                });
            break;
            
        case "load":
                load_data(useruid).then(() => {
                    callback(null,{
                                    statusCode: 200,
                                    body: "load ok",
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                    },
                                    });
                }).catch((err) => {
                    errorResponse("load_data", context.awsRequestId, callback);
                });
            break;
            

            
        default:
            errorResponse("requestBody.action illegal", context.awsRequestId, callback);
        } 
};

function no_info_comp(useruid) {
    return ddb.get({
        TableName: 'infos_utilisateurs_entreprises',
        Key:{"useruid":useruid},
    }).promise();
}


function no_info_comp_validated(useruid) {
    return ddb.get({
        TableName: 'infos_utilisateurs_entreprises',
        Key:{"useruid":useruid},
    }).promise();
}

function load_data(useruid) {
    return ddb.get({
        TableName: 'infos_utilisateurs_entreprises',
        Key:{"useruid":useruid},
        AttributesToGet: [
            'title',
            'start',
            'end'
        ],
    }).promise();
}

function update_data(useruid, data) {
    return ddb.put({
        TableName: 'calendrier_agent',
        Item: {
            useruid: useruid,
            title: data.title,
            start: data.start,
            end: data.end,
            RequestTime: new Date().toISOString()
        },
    }).promise();
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}