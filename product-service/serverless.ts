import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-typescript-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: process.env.RDS_HOST,
      PG_PORT: process.env.RDS_PORT,
      PG_DATABASE: process.env.RDS_DATABASE,
      PG_USERNAME: process.env.RDS_USERNAME,
      PG_PASSWORD: process.env.RDS_PASSWORD
    },
  },
  functions: {
    getProductsList: {
      handler: 'getProductsList.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    postProduct: {
      handler: 'postProduct.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    migrateTables: {
      handler: 'migrateTables.handler',
      events: []
    },
    getProductById: {
      handler: 'getProductById.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  id: true
                }
              }
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
