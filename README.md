
# cdk-lambda-clicks
This project provisions an AWS Lambda function that is triggered every 5 minutes by an Amazon EventBridge schedule. The function inserts records into a MongoDB database. As a security best practice, it retrieves the MongoDB connection URI from AWS Secrets Manager.

# Considerations
Before running CDK project ensure the following:

### AWS Account
The AWS account must allow creation of Lambda, EventBridge, secret manager and IAM resources.


### AWS CLI
The project requires AWS CLI version 2 to be installed and configured before deployment.

It is necessary to follow the following guide to configure and install the AWS CLI
[AWS GUIDE](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Node 
Additionally, to build and run this project, you must have Node.js and npm installed on your system. Follow the guide below to set them up. [GUIDE](https://nodejs.org/en/download)


### Install AWS Cloud Development Kit (CDK) with TypeScript

To use the AWS Cloud Development Kit (CDK) with TypeScript, it is essential to install the following global dependencies:

```bash
 npm install -g aws-cdk
 ```
```bash
 npm install -g typescript
 ```

### create a new project:

To create a new project structure, you can run the following command.

Note: This is not required to run the current project.
```bash
 cdk init nameproject --language typescript
```

### Deploy current project

To deploy the current project run the following commands:

Bootstrap the environment (installs the necessary AWS resources for CDK to operate):
```bash
cdk bootstrap
```

Synthesize the CloudFormation template to verify that the project compiles correctly:
```bash 
cdk synth
```
Deploy the CDK application on AWS account:
```bash 
cdk deploy
```


### Additional Consideration

The project uses a secret manager where the connection URI for Mongo will be stored.
Given the development of the Lambda function, which uses a variable called MONGO_URI, the secret value was passed to it using the ARN and the Lambda function's environment variable.
However, as a best practice, I also decided to add the "AWS-Parameters-and-Secrets-Lambda-Extension" layer.
This allows to cache the secret value within the code and obtain the following benefits:

The secret can be updated in AWS Secrets Manager without requiring a redeployment of the CDK stack.

The extension automatically manages caching and reduces calls to the Secrets Manager API.

The extension transparently handles decryption, improving both security and performance.