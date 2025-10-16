import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";



export class CdkLambdaClicksStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Define Lambda Role
    const clickLambdaRole = new iam.Role(this, 'clickLambdaRole', {
    roleName: 'clickLambdaRole',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  })

    clickLambdaRole.addToPolicy(
      new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter', 'secretsmanager:GetSecretValue', 'kms:Decrypt'],
      resources: ['*'],
      }),
    )

    //Define Secret
    const mongoDbSecret = new secretsmanager.Secret(this, 'MongoDBSecret', {
      secretName: 'mongodb-connection-uri',
    });


    //Define Lambda Function
    const clickLambda = new lambda.Function(this, 'ClickLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler.handler',
      code: Code.fromAsset("lambda"),
      description: 'Lambda function to registers clicks',
      timeout: cdk.Duration.seconds(10),
      role: clickLambdaRole,
      environment: {
        MONGO_URI: mongoDbSecret.secretArn, //optional
      },
    });

    //Define Lambda Layer to get de secrets
    const parametersAndSecretsExtension = lambda.LayerVersion.fromLayerVersionArn(
    this,
    'ParametersAndSecretsLambdaExtension',
    'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:20',

  )

    clickLambda.addLayers(parametersAndSecretsExtension)


    // Define EventBridge schedule rule
    const rule = new events.Rule(this, 'LambdaScheduleRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      description: 'Triggers ClickLambdaFunction every 5 minutes',
    });

    // Add Lambda as rule target
    rule.addTarget(new targets.LambdaFunction(clickLambda));

  }
}
