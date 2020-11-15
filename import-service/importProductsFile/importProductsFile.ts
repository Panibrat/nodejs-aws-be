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

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (error, url) => {
            if (error) {
                console.log('error', error);
                return reject(error);
            }
            resolve({
                        statusCode: 200,
                        body: url,
                        headers: generateApiReponseHeaders(),
                    });
        })
    });
}
