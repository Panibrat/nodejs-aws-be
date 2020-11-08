import { Client } from 'pg';

import { getDbOptions } from './getDbOptions';

const dbOptions = getDbOptions();

export const getClient = async() => {

    const client = new Client(dbOptions);
    await client.connect();

    return client;
};
