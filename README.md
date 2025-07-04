# Cron Job Automation Script

This script automates the creation of recurring HTTP requests (cron jobs) using the [cron-job.org](https://cron-job.org) API. It is designed to simplify setting up automated tasks for websites, including WordPress cron triggers and cache preloading endpoints for **Seraphine Accelerator**.

## Features

- Creates multiple cron jobs per website.
- Prevents duplicate job creation via local logging (`cron-job-log.json`).
- Configurable job schedules.
- Supports Australia/Sydney timezone.

## Requirements

- Node.js v18 or later
- API Key from cron-job.org

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example environment file and configure:

```bash
cp .env.sample .env
```

3. Edit `.env` and add:

```plaintext
API_KEY=your_api_key_here
BUSINESS_NAME=Your Business Name
WEBSITE_URL=https://yourwebsite.com
```

## Usage

Run the script:

```bash
node index.js
```

This will:

- Create the predefined cron jobs.
- Store job details in `cron-job-log.json`.

## Endpoints

> Notes
> Existing jobs are automatically skipped based on the log.
> All jobs are scheduled under the Australia/Sydney timezone.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or inquiries:

- X: [@rubixvi](https://x.com/rubixvi)
- Facebook: [rubixvi](https://www.facebook.com/rubixvi/)
- Website: [Rubix Studios](https://rubixstudios.com.au)

## Author

Rubix Studios Pty. Ltd.  
[https://rubixstudios.com.au](https://rubixstudios.com.au)
