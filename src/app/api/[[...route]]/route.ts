import { Hono } from "hono";
import { handle } from "hono/vercel";
import { env } from "hono/adapter";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type envConfig = {
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
};

app.get("/search", async (c) => {
  const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
    env<envConfig>(c);

  //----------------------
  try {
    const start = performance.now();

    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL,
    });

    const query = c.req.query("q");

    if (!query) {
      return c.json({ error: "invalid search params" }, { status: 400 });
    }

    const res = [];
    const rank = await redis.zrank("terms", query);

    if (rank !== null && rank !== undefined) {
      const temporary = await redis.zrange<string[]>("terms", rank, rank + 100);
      for (const el of temporary) {
        if (!el.startsWith(query)) {
          break;
        }

        if (el.endsWith("*")) {
          res.push(el.substring, el.length - 1);
        }
      }
    }

    //--------------------
    const end = performance.now();

    return c.json({
      results: res,
      duration: end - start,
    });
  } catch (error) {
    console.error(error);
    return c.json({ results: [], message: error }, { status: 500 });
  }
});

export const GET = handle(app);
export default app as never;
