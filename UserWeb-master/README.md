# User Web

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/AuraHealth/UserWeb/tree/master.svg?style=svg&circle-token=d22f3c4e4f5845d91f8777156b86f08d0c165121)](https://dl.circleci.com/status-badge/redirect/gh/AuraHealth/UserWeb/tree/master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Purpose

This repository contains the user web application to browse and play content from Aura library. Optimized for SEO using `getStaticProps` from NextJS.

## Contacts

Name | Email | Slack
-|-|-
Rohan Agarwal | rohanx96@gmail.com | @rohanx96

## Environment Variables

The project uses environment variables to configure api keys and environment constants. See `.env.sample` to get the list of required environment variables.

## Tasks

Commonly used tasks - please check package.json for an exhaustive list.
Command | Description
-|-
`npm run dev` | Runs express server in development mode. Default port 3000
`npm run build` | Generates pages using static paths/data and builds a production version of the app
`npm run serve` | Runs the server in production mode

## Exporting pages for SEO

The web app uses `getStaticProps` functionality from NextJS to generate static content pages. Read more about it here: [Data Fetching - NextJS](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)
