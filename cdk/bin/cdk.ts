#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  appName: "AmplifyAppReactSample",
  ownerName: process.env.GITHUB_OWNER_NAME || "",
  repositoryName: process.env.GITHUB_REPOSITORY_NAME || "",
  secretNameForGitHubToken: process.env.SECRET_NAME_GITHUB_TOKEN || "",
});