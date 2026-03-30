import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import {
  getMetricsSummary,
  insertDemoEvent,
  insertLead
} from "./db.js";
import {
  validateEventInput,
  validateLeadInput
} from "./validators.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "freelance-demo-api",
    now: new Date().toISOString()
  });
});

app.post("/api/events", (req, res) => {
  const result = validateEventInput(req.body);
  if (!result.ok) {
    return res.status(400).json({
      ok: false,
      error: result.error
    });
  }

  const saved = insertDemoEvent(result.event);
  return res.status(201).json({
    ok: true,
    event: saved
  });
});

app.post("/api/leads", (req, res) => {
  const result = validateLeadInput(req.body);
  if (!result.ok) {
    return res.status(400).json({
      ok: false,
      error: result.error
    });
  }

  const savedLead = insertLead(result.lead);
  insertDemoEvent({
    event: "lead_submit",
    source: savedLead.origen,
    timestamp: savedLead.createdAt
  });

  return res.status(201).json({
    ok: true,
    lead: savedLead
  });
});

app.get("/api/metrics/summary", (_req, res) => {
  return res.json({
    ok: true,
    summary: getMetricsSummary()
  });
});

const clientDistPath = path.resolve(serverRoot, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`API ready on http://localhost:${port}`);
});
