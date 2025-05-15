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

#### 1. Install Elastic Beanstalk CLI

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

Follow the prompts:

- Select your AWS keypair or create a new one.

#### 4. Create the Environment

```bash
eb create caribpay-env
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

#### 7. Deploy

Once you've made changes to your code, run:

```bash
eb deploy
```

This will apply all updates to your live environment.

After deployment, your app will be live at:
`http://caribpay-env.eba-xyz123.us-east-1.elasticbeanstalk.com`

---

### Optional

You can also use the `./deploy.sh` script to automate setup and deployment.

> **Note:** Before running the script, make sure to **update the environment variables** inside `deploy.sh` with your own `DATABASE_URL`, `JWT_SECRET`, and other sensitive values.

```bash
chmod +x deploy.sh
./deploy.sh
```

---
