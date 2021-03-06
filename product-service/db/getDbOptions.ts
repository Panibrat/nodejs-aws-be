const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const getDbOptions = () => {
    return {
        host: PG_HOST,
        port: PG_PORT,
        database: PG_DATABASE,
        user: PG_USERNAME,
        password: PG_PASSWORD,
        ssl: {
            rejectUnauthorized: false,
        },
        connectionTimeoutMillis: 10000,
    };
};
