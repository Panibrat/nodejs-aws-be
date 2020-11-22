import type { Serverless } from 'serverless/aws';

const BUCKET = 'panibrat-shop-assets';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-import-service',
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
      SQS_URL: {
        Ref: 'SQSQueue'
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: [`arn:aws:s3:::${BUCKET}`],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${BUCKET}/*`],
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: ['arn:aws:sqs:eu-west-1:618561913336:catalogItemsQueue'], // TODO: make auto sign
      },
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        }
      },
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            cors: true,
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: BUCKET,
            event: 's3:ObjectCreated:*',
            existing: true,
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '.csv',
              },
            ],
          },
        },
      ],
    },
    catalogBatchProcess : {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 2,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            }
          }
        },
      ],
    },

  }
}

module.exports = serverlessConfiguration;
