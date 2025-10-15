#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaClicksStack } from '../lib/cdk-lambda-clicks-stack';

const app = new cdk.App();
new CdkLambdaClicksStack(app, 'CdkLambdaClicksStack', {
});