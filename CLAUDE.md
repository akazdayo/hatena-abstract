# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers application built with Hono framework that provides AI text generation capabilities using Google's Generative AI (Gemini). The application is written in TypeScript and deployed to Cloudflare's edge network.

## Architecture

- **Framework**: Hono - A lightweight web framework for Cloudflare Workers
- **AI Integration**: Uses `@ai-sdk/google` and `ai` packages to integrate with Google's Gemini model
- **Runtime**: Cloudflare Workers with TypeScript
- **Main Entry Point**: `src/index.ts` - Contains the Hono app with two routes:
  - `/` - Health check endpoint
  - `/generate` - AI text generation endpoint using Gemini 1.5 Flash

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Deploy to Cloudflare Workers
npm run deploy

# Generate TypeScript types for Cloudflare bindings
npm run cf-typegen
```

## Environment Configuration

The application requires the following environment variable to be configured in Cloudflare Workers:
- `GOOGLE_GENERATIVE_AI_API_KEY` - API key for Google Generative AI services

## Project Structure

- `src/index.ts` - Main application file with Hono routes and AI integration
- `wrangler.jsonc` - Cloudflare Workers configuration
- `tsconfig.json` - TypeScript configuration with Hono JSX support
- `package.json` - Dependencies and npm scripts

## Key Dependencies

- `hono` - Web framework optimized for Cloudflare Workers
- `@ai-sdk/google` - Google AI SDK integration
- `ai` - AI utilities and text generation functions
- `wrangler` - Cloudflare Workers CLI tool