import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import axios from 'axios';

const myOpenApiKey = 'ae1e26d3a511f5058a8fc9ff40ffe2ad';
const Kyiv = {
  lat: 50.431759,
  lon: 30.517023,
};
const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Kyiv.lat}&lon=${Kyiv.lon}&appid=${myOpenApiKey}`;

export const handler: APIGatewayProxyHandler = async () => {

  const { data } = await axios.get(url);
  const currentWeather = data.current;

  return {
    statusCode: 200,
    body: JSON.stringify(currentWeather),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}
