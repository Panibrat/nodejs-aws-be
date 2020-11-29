import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'authorization-service',
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
    },
    iamRoleStatements: [
    ],
  },
  resources: {
    Resources: {
    }
  },
  functions: {
    basicAuthorizer: {
      handler: 'handler.basicAuthorizer',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
/*            authorizer: {
              type: "AWS::"
            },*/
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
