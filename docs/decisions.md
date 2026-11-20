# QCLEAR: Architecture Decision Records (ADRs)

## ADR 001: Vertex AI Integration via Application Default Credentials (ADC)
* **Status:** Accepted
* **Context:** In enterprise and Cloud Run deployments, hardcoding or mounting long-lived API keys creates security vectors and secret-rotation overhead.
* **Decision:** Connect to Gemini models using `@google/genai` in Vertex AI mode (`{ vertexai: true }`). In Cloud Run, identity is asserted through a dedicated IAM service account (`roles/aiplatform.user`). In local development, developers authenticate via `gcloud auth application-default login`. If credentials or `GOOGLE_CLOUD_PROJECT` are not present, QCLEAR gracefully degrades to high-quality curated offline guidance.
* **Consequences:** Eliminates API key storage; satisfies zero-trust security; seamless local fallback.

## ADR 002: Deterministic Impact Math Engine vs. Generative Estimation
* **Status:** Accepted
* **Context:** LLMs frequently hallucinate or produce inconsistent numbers when calculating numeric health metrics and carbon emissions.
* **Decision:** All quantitative calculations (indoor PM2.5 infiltration reduction %, commute inhaled dose avoided, weekly emissions avoided) are computed strictly via pure, deterministic TypeScript functions in `/src/lib/impact/calculator.ts`. Vertex AI selects and contextualizes actions; it is prohibited from inventing quantitative claims.
* **Consequences:** Transparent, auditable, and reproducible metrics. Every constant is explicitly documented in `assumptions.ts` with named literature citations or explicit `[Illustrative Assumption]` tags.

## ADR 003: Pure Dictionary Type-Safe i18n
* **Status:** Accepted
* **Context:** Heavy internationalization frameworks (such as `next-intl` or `i18next`) introduce substantial client bundle overhead, complex interpolation syntax, and hydration mismatch risks in Next.js App Router.
* **Decision:** Implement a lightweight, strongly typed dictionary pattern (`src/lib/i18n/en.ts` and `src/lib/i18n/hi.ts`). TypeScript enforces identical key signatures across both dictionaries (`type TranslationKey = keyof typeof en`).
* **Consequences:** Zero runtime bundle overhead for i18n libraries; compile-time and unit-tested guarantee of complete translation parity.

## ADR 004: In-Memory Dual TTL Caching and Cloud Run Scale-to-Zero
* **Status:** Accepted
* **Context:** External air quality APIs and LLM generation take 200ms to 2.5s. Repeated calls for the same coordinates or profile waste resources and upstream quotas.
* **Decision:** Implement server-side in-memory caching:
  1. Air quality responses are cached for 10 minutes keyed by coordinates rounded to 2 decimal places (`lat.toFixed(2)_lon.toFixed(2)`).
  2. Vertex AI recommendations are cached keyed by SHA-256 hash of the complete household profile, current AQI band, and language.
  3. Deploy Cloud Run with `--min-instances 0 --max-instances 3` for zero cost when idle and elastic burst handling for judging.
* **Consequences:** Ultra-low latency (<10ms) on cache hits; protects external quotas; keeps operational costs zero when idle.

## ADR 005: Separation of Indoor Infiltration vs. Outdoor Commute Dose
* **Status:** Accepted
* **Context:** Previous naive formulas mistakenly multiplied mask wear into indoor PM2.5 reduction, falsely implying wearing a mask cleans room air.
* **Decision:** Split the impact metrics into two independent dimensions:
  1. $\Delta \text{Indoor PM}_{2.5} = C_{\text{ambient}} \times F \times (1 - \prod (1 - \eta_{\text{indoor}}))$, where $F = 0.55$ represents building envelope infiltration.
  2. $\Delta \text{Outdoor Dose} = C_{\text{ambient}} \times V_{\text{breathing}} \times T_{\text{commute}} \times (\eta_{\text{filter}} \times \text{FitFactor})$.
  3. Indoor-source interventions (damp mopping, cooking exhaust timing) act as independent reduction terms on indoor-generated particulate matter.
* **Consequences:** Scientifically grounded, honest communication of risk reduction.

## ADR 006: Cloud Run In-Memory State & Reverse Proxy IP Extraction
* **Status:** Accepted
* **Context:** When running on Google Cloud Run with `--min-instances 0 --max-instances 3`, requests pass through Google Front End (GFE) load balancers. Standard remote addresses refer to proxy infrastructure rather than the end-user.
* **Decision:** Extract client IP using `getClientIp()` by inspecting the first comma-separated entry of `x-forwarded-for`, falling back to `x-real-ip`. For the `--max-instances 3` prototype, in-memory LRU caching and token-bucket rate limiting operate per container instance.
* **Horizontal Scaling Path:** If horizontal scale exceeds 3 instances, transition in-memory maps to Google Cloud Memorystore (Redis) to achieve shared distributed state across arbitrary container replicas.

