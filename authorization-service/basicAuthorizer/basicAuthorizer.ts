import { generateApiReponseHeaders } from '../../product-service/utils/generateApiReponseHeaders';

export const basicAuthorizer = (e) => {
    console.log('e', e);

    return {
        statusCode: 200,
        body: 'Authorized?',
        headers: generateApiReponseHeaders(),
    }
};
