# Lambda Uploader package

A simple package made to upload lambda files to amazon services automatically

## Instalation
You need to have AWS CLI installed and configured, if you don't, checkout [this repo](https://github.com/awslabs/aws-shell) and follow its instructions

## Usage
Try to follow the naming convention below:

```
METHOD-lambda-name
```

The following names are valid through this convention:

```
GET-operators
POST-validation
DELETE-operation-managers
```

Before uploading the files make sure to build them using `npm run build` or do it automatically using `Build`

![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
