#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const srcDir = path.resolve(__dirname, '../public');
const distDir = path.resolve(__dirname, '../dist');

const srcConfigPath = path.resolve(srcDir, '_config.yml');
const distConfigPath = path.resolve(distDir, '_config.yml');

const srcRobotsPath = path.resolve(srcDir, 'robots.txt');
const distRobotsPath = path.resolve(distDir, 'robots.txt');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const conf = yamlLoad(fs.readFileSync(srcConfigPath, 'utf8')) as any;

if (process.env.GH_PAGES_URL) {
  conf['url'] = process.env.GH_PAGES_URL;
}
let robots = fs.readFileSync(srcRobotsPath, 'utf8');
robots = robots.replace(/\${GH_PAGES_URL}/g, process.env.GH_PAGES_URL || '');
robots = robots.replace(/\${APP_PATH}/g, process.env.APP_PATH || '/');
fs.writeFileSync(distRobotsPath, robots, 'utf8');
console.info(`output ${distRobotsPath}`);

if (process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID) {
  conf['google_tag_manager'] = process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID;
}

if (process.env.GOOGLE_SITE_VERIFICATION) {
  const siteVerificationFileName = `${process.env.GOOGLE_SITE_VERIFICATION}.html`;
  const distSiteVerification = path.resolve(distDir, siteVerificationFileName);
  fs.writeFileSync(
    distSiteVerification,
    `google-site-verification: ${siteVerificationFileName}`,
    'utf8',
  );
  console.info(`output ${distSiteVerification}`);

  const configDefaults: object[] = conf['defaults'] || [];
  configDefaults.push({
    scope: { path: siteVerificationFileName },
    values: { sitemap: false },
  });
}

fs.writeFileSync(distConfigPath, yamlDump(conf), 'utf8');
console.info(`output ${distConfigPath}`);
