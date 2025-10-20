"use client";

const fallbackApiUrl = "http://localhost:9000/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? fallbackApiUrl;
