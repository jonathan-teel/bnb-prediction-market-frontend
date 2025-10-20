"use client";

const fallbackApiUrl = "http://161.35.62.220:9000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? fallbackApiUrl;
