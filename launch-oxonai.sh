#!/bin/bash
cd /home/arushgupta/Desktop/OxonAI
# Cleanup existing processes on common ports
lsof -ti:5173,3000 | xargs kill -9 2>/dev/null || true
npm run dev
