import * as AWS from 'aws-sdk';
import { getClient } from '../../product-service/db/clientDb';
import { insertProductToTables } from '../../product-service/models/insertProductToTables';

export const catalogBatchProcess = (e) => {
    console.log(`catalogBatchProcess --> ${JSON.stringify(e)}`);
    e.Records.forEach(async (record) => {
        const product = JSON.parse(record?.body);
        const { title, description, price, count} = product;

        if (!title || !description || !price || !count) {
            return console.log('Error: Mandatory product data is missed :(');
        }

        try {
            const client = await getClient();

            await insertProductToTables(client, product);

            await client.end();

            console.log(`DB created: ${JSON.stringify(product)}`);

        } catch (e) {
            return console.log(`DB Error: Can't create new product :(( ${ JSON.stringify(e)}`);
        }
    })

    const sns = new AWS.SNS({ region: 'eu-west-1'});

    sns.publish({
                    Subject: 'Products created',
                    Message: JSON.stringify(e.Records),
                    TopicArn: process.env.SNS_ARN,
                },
                (error, data) => {
        if (error) {
            console.log(`SNS Error --> ${error}`);
        }

        console.log(`SNS Products created: ${JSON.stringify(data)}`);
    });
};
