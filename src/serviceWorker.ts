/* eslint-disable no-underscore-dangle */
/* global workbox */
import * as idbKeyval from 'idb-keyval';

if (typeof idbKeyval === 'undefined') {
  self.importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js');
}

type PostResponsesStore = {
  query: unknown;
  response: {
    headers: { [key: string]: string };
    status: number;
    statusText: string;
    body: unknown;
  };
  timestamp: number;
};

const store = new idbKeyval.Store('GraphQL-Cache', 'PostResponses');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  /https:\/\/artwithaliens\.com/,
  new workbox.strategies.StaleWhileRevalidate(),
);

// TODO: Temporary, needs to work on routes.
workbox.routing.registerRoute(/\/product.+/, new workbox.strategies.StaleWhileRevalidate());

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
workbox.precaching.precacheAndRoute([...((self as any).__WB_MANIFEST || []), { url: '/' }]);

async function serializeResponse(response: Response) {
  const serializedHeaders: { [key: string]: string } = {};
  Object.entries(response.headers).forEach(([key, value]) => {
    serializedHeaders[key] = value;
  });
  return {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText,
    body: await response.json(),
  };
}

async function getCache(request: Request) {
  try {
    const body: { query: string[]; variables: unknown } = await request.json();
    const id = body.query.toString() + JSON.stringify(body.variables);

    const data = await idbKeyval.get<PostResponsesStore>(id, store);
    if (!data) {
      return null;
    }

    // Check cache max age.
    const cacheControl = request.headers.get('Cache-Control');
    const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1], 10) : 3600;
    if (Date.now() - data.timestamp > maxAge * 1000) {
      // Cache expired. Load from API endpoint
      return null;
    }

    // Load response from cache.
    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (error) {
    return null;
  }
}

async function setCache(request: Request, response: Response) {
  const body: { query: string[]; variables: unknown } = await request.json();
  const id = body.query.toString() + JSON.stringify(body.variables);

  const entry = {
    query: body.query,
    response: await serializeResponse(response),
    timestamp: Date.now(),
  };
  idbKeyval.set(id, entry, store);
}

async function staleWhileRevalidate(event: FetchEvent) {
  const cachedResponse = await getCache(event.request.clone());
  const fetchPromise = fetch(event.request.clone()).then((response) => {
    setCache(event.request.clone(), response.clone());
    return response;
  });
  return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener<any>('fetch', (event: FetchEvent) => {
  if (event.request.method === 'POST') {
    event.waitUntil(event.respondWith(staleWhileRevalidate(event)));
  }
});
