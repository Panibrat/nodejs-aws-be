import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';

export const basicAuthorizer: APIGatewayAuthorizerHandler = (
    event,
    _context,
    cb,
) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    if (event.type !== 'TOKEN') {
        return cb('Unauthorized');
    }

    try {
        const encodedCreds = event.authorizationToken.split(' ')[1];
        const [username, password] = Buffer.from(encodedCreds, 'base64')
            .toString('utf-8')
            .split(':');

        const userPassword = process.env[username];

        const effect =
            !userPassword || userPassword !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        return cb(null, policy);
    } catch (e) {
        console.error(e);
        return cb('Unauthorized');
    }
};

const generatePolicy = (
    principalId: string,
    Resource: string,
    Effect: 'Allow' | 'Deny' = 'Allow',
): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect,
                    Resource,
                },
            ],
        },
    };
};
