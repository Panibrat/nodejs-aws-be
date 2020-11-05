import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            adminName: 'Sasha',
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    }
}
