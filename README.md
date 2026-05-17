# SkyTriage

AI-assisted disaster response platform for post-hurricane damage assessment, FEMA aid matching, and application draft generation.

Built for the AWS Bedrock Hackathon.

---

## Demo Video
https://www.loom.com/share/2c6bd12b12544326ba6142dd7f2e611d

## Overview

SkyTriage is a disaster-response command center designed to help responders and survivors rapidly assess property damage and generate FEMA-ready assistance drafts using:

- Computer vision damage classification
- AWS Bedrock agents
- Retrieval-augmented generation (RAG)
- FEMA policy matching
- Interactive emergency-response dashboards

The system combines satellite/drone imagery, AI-based damage assessment, and Bedrock agent workflows into a unified interface.

---

## Core Features

### Disaster Damage Map
- Interactive live-response map
- Color-coded building severity markers
- Search and filtering
- Building selection workflow

### ML Damage Assessment
- Before/after imagery comparison
- AI damage classification
- Confidence scoring
- Evidence indicators

### Bedrock Agent Trace
- Real-time workflow timeline
- Damage assessment tracking
- Household lookup
- FEMA policy retrieval
- Aid matching
- Application drafting

### FEMA Application Drafting
- AI-generated assistance drafts
- Aid program recommendations
- Citation-linked policy references
- Export-ready workflow

---

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

### Planned AWS Services
- AWS Bedrock
- Bedrock Agents
- Bedrock Knowledge Bases
- SageMaker
- Lambda
- API Gateway
- S3

### Planned ML Pipeline
- xBD disaster dataset
- YOLOv8 / Attention U-Net
- Satellite + drone imagery analysis

---

## Project Structure

```txt
src/
  components/
    agent/
    application/
    damage/
    layout/
    map/

  data/
    mockData.ts

  lib/
    api.ts
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

---

## Current Status

Frontend MVP completed:
- modular dashboard UI
- mock disaster data
- Bedrock workflow visualization
- application draft panels
- frontend API abstraction layer

Backend AWS integration currently in progress.

---

## Future Integrations

- Real SageMaker inference endpoints
- Live Bedrock agent workflows
- FEMA Knowledge Base retrieval
- Real disaster imagery ingestion
- PDF application export
- Live geospatial layers

---

## Team

Built during the AWS Bedrock Hackathon.
