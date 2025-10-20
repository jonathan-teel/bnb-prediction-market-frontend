"use client";

const fallbackApiUrl = 'https://deeezn.solfight.fun/api'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? fallbackApiUrl;
