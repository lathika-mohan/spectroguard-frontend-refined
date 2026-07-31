# SpectraGuard Production Deployment & Operations Guide

## 1. Overview
This document outlines the production release architecture, environment setup, rollout procedures, rollback strategies, and routine operations for the SpectraGuard frontend application.

## 2. Production Checklist
- [x] Environment variables configured via .env.production based on .env.example.
- [x] Production build artifact generated (dist/ directory and .zip archive).
- [x] Nginx container routing configured with SPA fallback (	ry_files \ \/ /index.html).
- [x] Security review passed and vulnerability posture documented (React Router advisory deferred to maintenance backlog).
- [x] Operational health probes and smoke test scripts verified.

## 3. Rollback Procedure
If a critical runtime fault is detected post-deployment:
1. Immediately revert traffic routing at the load balancer or ingress layer to the previous stable release tag.
2. Pull the prior stable release archive artifact (spectraguard-frontend-release.zip).
3. Redeploy the static assets into the web server root directory (/usr/share/nginx/html).
4. Validate system health via scripts/validate-connectivity.ps1.

## 4. Disaster Recovery & Operations
- **Static Assets:** Cached via immutable headers at the CDN edge. Invalidate CDN cache upon new release tags.
- **API Connectivity:** Ensure backend core infrastructure (spectraguard-core-infra) on port 8000 is reachable and healthy (/api/v1/system/health).
