# Pushing to Live

### Deployment to AWS

You can deploy the CaribPay API to the cloud using AWS Elastic Beanstalk:

#### AWS IAM Role Setup

Elastic Beanstalk needs permissions to manage resources like S3, RDS, and CloudWatch.

##### Verify IAM Role:

1. Go to AWS IAM → Roles.
2. Locate the Elastic Beanstalk Service Role.
3. Ensure the following permissions exist:
   - `CloudWatchLogsFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonRDSFullAccess`
   - `IAMFullAccess` (optional, for managing roles)

#### 1. Install Elastic Beanstalk CLI (optional)

Only needed for environment setup (not for deployment):

```bash
pip3 install awsebcli --upgrade --user
```

#### 2. Configure AWS credentials:

```bash
aws configure
```

Provide your:

- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1`

#### 3. Initialize the Project

```bash
eb init -p node.js caribpay --region us-east-1
```

- Choose or create an AWS keypair if prompted.

#### 4. Create the Environment

```bash
eb create caribpay-env --platform "Node.js 22 running on 64bit Amazon Linux 2023"
```

#### 5. Add Environment Variables

```bash
eb setenv DATABASE_URL='your-db-url' JWT_SECRET='your-super-secret' PORT=3000 NODE_ENV=production
```

Set:

- DATABASE_URL
- JWT_SECRET
- PORT
- NODE_ENV=production

#### 6. Build for Production

Once you've made changes to your code, run:

```bash
npm run build
```

#### 7. Zip the App

Prepare a production-ready zip (excluding source and config files):

```bash
zip -r deployment.zip . -x "src/*" "node_modules/*" ".env"
```

#### 8. Upload & Deploy via AWS Console

1. Go to the Elastic [Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/home)
2. Select your environment (caribpay-env)
3. Click Upload and Deploy
4. Upload deployment.zip
5. Click Deploy

Your app will now go live at:
`http://caribpay-env.eba-xyz123.us-east-1.elasticbeanstalk.com`

(URL will vary depending on your environment name)

---
