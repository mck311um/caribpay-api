# Logging and Monitoring

### CloudWatch

AWS CloudWatch automatically tracks logs from EB.

#### Enable CloudWatch Log Streaming:

- Go to AWS Console → Elastic Beanstalk → Configuration.
- Under Monitoring, enable Log Streaming to CloudWatch.
- Save changes.

#### Logging Scripts:

##### View EB Logs:

```bash
eb logs
```

##### List Available Versions:

```bash
eb list
```

##### Restore a Previous Version:

```bash
eb restore <version_label>
```
