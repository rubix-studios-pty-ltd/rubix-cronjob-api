const fs = require("fs");
const axios = require("axios");
const path = require("path");

const LOG_FILE = path.resolve(__dirname, "cron-job-log.json");
const API_KEY = process.env.API_KEY || '';
const API_URL = "https://api.cron-job.org/jobs";

const businessName = process.env.BUSINESS_NAME || '';
const websiteUrl = process.env.WEBSITE_URL || '';

if (!API_KEY || !businessName || !websiteUrl) {
  console.error("Missing required config API_KEY, BUSINESS_NAME, WEBSITE_URL");
  process.exit(1);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function loadLog() {
  if (!fs.existsSync(LOG_FILE)) return {};
  try {
    const content = fs.readFileSync(LOG_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function saveLog(log) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

async function createCronJob(name, fullUrl, intervalMinutes, log) {
  if (log[fullUrl]) {
    console.log(`Skipping (already exists): ${fullUrl}`);
    return;
  }

  const schedule = {
    timezone: "Australia/Sydney",
    expiresAt: 0,
    hours: [-1],
    mdays: [-1],
    minutes: intervalMinutes === 1 ? Array.from({ length: 60 }, (_, i) => i) : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    months: [-1],
    wdays: [-1]
  };

  const job = {
    url: fullUrl,
    enabled: true,
    saveResponses: false,
    schedule,
    title: name,
    notification: {
        onDisable: true,
        onFailure: false,
        onSuccess: false
    },
  };

  try {
    const response = await axios.put(API_URL, { job }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      }
    });

    const jobId = response.data.jobId;
    console.log(`Created: ${fullUrl} → Job ID: ${jobId}`);
    log[fullUrl] = { jobId, name, createdAt: new Date().toISOString() };
    saveLog(log);
  } catch (error) {
    console.error(`Error creating job for ${fullUrl}`, error.response?.data || error.message);
  }
}

async function createJobsForBusiness(businessName, baseUrl) {
  const endpoints = [
    { path: "/?seraph_accel_at=TO", interval: 1 },
    { path: "/?seraph_accel_at=O", interval: 1 },
    { path: "/?seraph_accel_at=M", interval: 1 },
    { path: "/wp-cron.php?doing_wp_cron", interval: 5 },
  ];

  const log = loadLog();

const sanitizedBaseUrl = baseUrl.replace(/\/+$/, "");

for (const endpoint of endpoints) {
  const fullUrl = `${sanitizedBaseUrl}${endpoint.path}`;
  await createCronJob(businessName, fullUrl, endpoint.interval, log);
  await delay(1100);
}
}

createJobsForBusiness(businessName, websiteUrl);
