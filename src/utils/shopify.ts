import { z } from "zod";
import { CartResult, ProductResult } from "./schemas";
import { config } from "./config";
import {
  ProductsQuery,
  ProductByHandleQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  GetCartQuery,
  RemoveCartLinesMutation,
  ProductRecommendationsQuery,
} from "./graphql";

/**
 * Core requester for the Shopify Storefront API.
 */
const makeShopifyRequest = async (
  query: string,
  variables: Record<string, unknown> = {},
  buyerIP: string = ""
) => {
  const isSSR = import.meta.env.SSR;
  const apiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;

  // Server-side check for Buyer IP (required by Shopify for SSR rate limiting)
  if (isSSR && !buyerIP) {
    console.warn(
      `⚠️ No buyer IP provided. Shopify requests from the server should include the client's IP to avoid rate-limiting issues.`
    );
  }

  const { privateShopifyAccessToken, publicShopifyAccessToken } = config;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Auth strategy based on environment
  if (isSSR) {
    headers["Shopify-Storefront-Private-Token"] = privateShopifyAccessToken;
    if (buyerIP) headers["Shopify-Storefront-Buyer-IP"] = buyerIP;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = publicShopifyAccessToken;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify API Error: ${response.status} ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(
      `Shopify GraphQL Errors: ${json.errors.map((e: any) => e.message).join("\n")}`
    );
  }

  return json.data;
};

/**
 * Fetches a list of products.
 */
export const getProducts = async (options: {
  limit?: number;
  buyerIP: string;
}) => {
  const { limit = 10, buyerIP } = options;
  const data = await makeShopifyRequest(ProductsQuery, { first: limit }, buyerIP);

  if (!data?.products) throw new Error("No products found");

  const productsList = data.products.edges.map((edge: any) => edge.node);
  return z.array(ProductResult).parse(productsList);
};

/**
 * Fetches a single product by handle.
 */
export const getProductByHandle = async (options: {
  handle: string;
  buyerIP: string;
}) => {
  const { handle, buyerIP } = options;
  const data = await makeShopifyRequest(ProductByHandleQuery, { handle }, buyerIP);

  if (!data?.product) return null;

  // This will throw an error if the data doesn't match the Zod schema in schemas.ts
  return ProductResult.parse(data.product);
};

/**
 * Fetches recommended products for a given product ID.
 */
export const getProductRecommendations = async (options: {
  productId: string;
  buyerIP: string;
}) => {
  const { productId, buyerIP } = options;
  const data = await makeShopifyRequest(
    ProductRecommendationsQuery,
    { productId },
    buyerIP
  );

  if (!data?.productRecommendations) return [];

  return z.array(ProductResult).parse(data.productRecommendations);
};

/**
 * Cart Operations
 */

export const createCart = async (id: string, quantity: number) => {
  const data = await makeShopifyRequest(CreateCartMutation, { id, quantity });
  return CartResult.parse(data.cartCreate?.cart);
};

export const addCartLines = async (
  cartId: string,
  merchandiseId: string,
  quantity: number
) => {
  const data = await makeShopifyRequest(AddCartLinesMutation, {
    cartId,
    merchandiseId,
    quantity,
  });
  return CartResult.parse(data.cartLinesAdd?.cart);
};

export const removeCartLines = async (cartId: string, lineIds: string[]) => {
  const data = await makeShopifyRequest(RemoveCartLinesMutation, {
    cartId,
    lineIds,
  });
  return CartResult.parse(data.cartLinesRemove?.cart);
};

export const getCart = async (id: string) => {
  const data = await makeShopifyRequest(GetCartQuery, { id });
  return data?.cart ? CartResult.parse(data.cart) : null;
};