/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	AI: Ai;
}

type RequestBody = {
	baselineText?: string;
	currentText?: string;
};

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Content-Type": "application/json; charset=utf-8",
};

function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length) {
		throw new Error("Embedding dimension mismatch");
	}

	let dot = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}

	if (normA === 0 || normB === 0) return 0;

	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function rescaleWithThreshold(score: number, threshold = 0.35): number {
	if (score <= threshold) return 0;
	return (score - threshold) / (1 - threshold);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			if (request.method === "OPTIONS") {
				return new Response(null, {
					status: 204,
					headers: corsHeaders,
				});
			}

			if (request.method === "GET") {
				return new Response(
					JSON.stringify({
						ok: true,
						message: "Worker is running. Send a POST request with baselineText and currentText.",
					}),
					{
						status: 200,
						headers: corsHeaders,
					}
				);
			}

			if (request.method !== "POST") {
				return new Response(
					JSON.stringify({ error: "Use POST" }),
					{
						status: 405,
						headers: corsHeaders,
					}
				);
			}

			const body = (await request.json()) as RequestBody;
			const baselineText = String(body?.baselineText ?? "").trim();
			const currentText = String(body?.currentText ?? "").trim();

			if (!baselineText || !currentText) {
				return new Response(
					JSON.stringify({ error: "baselineText and currentText are required" }),
					{
						status: 400,
						headers: corsHeaders,
					}
				);
			}

			const result = await env.AI.run("@cf/google/embeddinggemma-300m", {
				text: [baselineText, currentText],
			});

			const data = (result as { data?: unknown }).data;

			if (
				!Array.isArray(data) ||
				data.length < 2 ||
				!Array.isArray(data[0]) ||
				!Array.isArray(data[1])
			) {
				return new Response(
					JSON.stringify({
						error: "Unexpected embedding response shape",
						result,
					}),
					{
						status: 500,
						headers: corsHeaders,
					}
				);
			}

			const vectorA = data[0] as number[];
			const vectorB = data[1] as number[];

			const rawCosine = cosineSimilarity(vectorA, vectorB);
			const semanticScore = rescaleWithThreshold(rawCosine, 0.35);

			return new Response(
				JSON.stringify({
					ok: true,
					rawCosine,
					semanticScore,
					model: "@cf/google/embeddinggemma-300m",
				}),
				{
					status: 200,
					headers: corsHeaders,
				}
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unknown error";

			return new Response(
				JSON.stringify({
					ok: false,
					error: message,
				}),
				{
					status: 500,
					headers: corsHeaders,
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
