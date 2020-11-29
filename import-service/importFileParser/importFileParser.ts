import * as AWS from 'aws-sdk';
import * as csvParser from 'csv-parser';

const BUCKET = 'panibrat-shop-assets'; // TODO: move to config
const { SQS_URL } = process.env;

export const importFileParser = (event) => {
    console.log('importFileParser: Event: ', JSON.stringify(event, null, 2));

    const s3 = new AWS.S3({ region: 'eu-west-1'});

    const sqs = new AWS.SQS();

    for (let record of event.Records) {

        const s3Stream = s3.getObject({
                                          Bucket: BUCKET,
                                          Key: record.s3.object.key
                                      }).createReadStream();

        s3Stream
            .pipe(csvParser())
            .on('data', (data) => {
                console.log(`SQS data --->  ${JSON.stringify(data)}`);
                console.log(`SQS_URL --->  ${SQS_URL}`);
                sqs.sendMessage({ QueueUrl: SQS_URL, MessageBody: JSON.stringify(data)}, (error, data) => {
                    if (error) {
                        console.log(`SQS Error --> ${error}`);
                    }

                    console.log(`callback from SQS with data: ${JSON.stringify(data)}`);
                });
            })
            .on('error', (error) => {
                console.log('parser error', error);
            })
            .on('end', async (error) => {
                if (error) {
                    console.error('Error: ', error);
                    return;
                }

                try {

                    console.log('END');

                    await s3
                        .copyObject({
                                        Bucket: BUCKET,
                                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                                        Key: record.s3.object.key.replace('uploaded/', 'parsed/'),
                                    })
                        .promise();

                    console.log('COPIED:', record.s3.object.key.replace('uploaded/', 'parsed/'));

                    await s3
                        .deleteObject({
                                          Bucket: BUCKET,
                                          Key: record.s3.object.key,
                                      })
                        .promise();
                } catch (e) {
                    console.error('Error: ', error);
                }
            });
    }
}
