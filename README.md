# Campliance Policy

Project to check compliance policy of a webpage.

## Introduction

Brief description or introduction of your project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Node.js is required to run this project. If you don't have it installed, you can download it from [Node.js website](https://nodejs.org/).

## Getting Started

To set up and run this project locally, follow these simple steps.

### 1. Install Nodemon

Nodemon is a utility that monitors for changes in your source code and automatically restarts your server. Install it globally using the following command:

```bash
npm install -g nodemon
```

### 2. Install Project Dependencies

Navigate to the project directory and install the required dependencies using npm:

```bash
npm install
```

### 3. Run the Project in Development Mode

Start the project in development mode using the following command:

```bash
npm run dev
```

# POST Request

## Endpoint

**URL:** `http://18.221.58.137/check-policy`

## Request Body

The POST request requires the following fields in the request body:

```json
{
  "webpageUrl": "string" // url
}
```
