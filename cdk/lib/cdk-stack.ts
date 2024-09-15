import { GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

export interface CdkStackProps extends cdk.StackProps {
  appName: string;
  ownerName: string;
  repositoryName: string;
  secretNameForGitHubToken: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CdkStackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "AmplifyAppReactSample", {
      appName: props.appName,

      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: props.ownerName,
        repository: props.repositoryName,
        oauthToken: cdk.SecretValue.secretsManager(props.secretNameForGitHubToken)
      }),

      environmentVariables:
      {
        "AMPLIFY_MONOREPO_APP_ROOT": "frontend",
        "AMPLIFY_DIFF_DEPLOY": "true"
      },

      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: 1,
        applications: [
          {
            appRoot: 'frontend',
            frontend: {
              phases: {
                preBuild: {
                  commands: ['npm ci'],
                },
                build: {
                  commands: ['npm run build'],
                },
              },
              artifacts: {
                baseDirectory: '.build',
                files: ['**/*'],
              },
              cache: {
                paths: ['node_modules/**/*'],
              },
            }
          }
        ]
      })
    })

    amplifyApp.addBranch("main", { stage: "DEV" })
  }
}
