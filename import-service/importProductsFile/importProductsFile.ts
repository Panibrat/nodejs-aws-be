import * as AWS from 'aws-sdk';
import { generateApiReponseHeaders } from '../../product-service/utils/generateApiReponseHeaders';

const BUCKET = 'panibrat-shop-assets'; // TODO: move to config

export const importProductsFile = async (event) => {
    console.log('importProductsFile: Event: ', event);

    const fileName = event.queryStringParameters?.name;
    const pathName = `uploaded/${fileName}`;
    console.log('pathName', pathName);

    const s3 = new AWS.S3({ region: 'eu-west-1' });

    const params = {
        Bucket: BUCKET,
        Key: pathName,
        Expires: 60,
        ContentType: 'text/csv',
    };

    try {
        const signedUrl = await s3.getSignedUrl('putObject', params);

        return {
            statusCode: 200,
            body: signedUrl,
            headers: generateApiReponseHeaders(),
        };
    } catch(e) {
        console.log('error', e);

        return {
            statusCode: 500,
            body: JSON.stringify(`Server Error:, ${e}`),
            headers: generateApiReponseHeaders(),
        };
    }
}
