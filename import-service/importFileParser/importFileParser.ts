import * as AWS from 'aws-sdk';

const BUCKET = 'panibrat-shop-assets'; // TODO: move to config

export const importFileParser = async (event) => {
    console.log('importFileParser: Event: ', event);
    console.log('hello from importFileParser');

    const s3 = new AWS.S3({ region: 'eu-west-1'});

    const params = {
        Bucket: BUCKET,
        Key: 'uploaded/catalogs.csv' //TODO: provide dynamic path
    };
    const s3Stream = await s3.getObject(params).createReadStream();

    s3Stream
        .on('data', (data) => {
            console.log('data', data);
        })
        .on('error', (error) => {
            console.log('error', error);
        })
        .on('end', () => {});
}
