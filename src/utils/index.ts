import axios from "axios";

const PINATA_API_KEY = "6ab09644822193eed05d";
const PINATA_SECRET_KEY = "e920681dec7cb1d967ab69aaff433c1a94d4e4b3da53dc0d169f6736c7292708";

export const uploadToPinata = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log("uploading...");
    
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    console.log("finished uploading", response.data.IpfsHash);

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return null
  }
};

export function findJsonPathsForKey(jsonStr: string, key: string): string[] {
    const paths: string[] = [];
  
    function search(obj: any, path: string = "$") {
      if (typeof obj !== "object" || obj === null) return;
  
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, `${path}[${index}]`);
        });
      } else {
        for (const k in obj) {
          if (k === key) {
            paths.push(`${path}.${k}`);
          }
          search(obj[k], `${path}.${k}`);
        }
      }
    }
  
    try {
      const data = JSON.parse(jsonStr);
      search(data);
      return paths;
    } catch (e) {
      console.error("Invalid JSON:", e);
      return [];
    }
}

export const getCountDown = (targetDateStr: string) => {

  const targetDate = new Date(targetDateStr);
  const now = new Date();

  let diff = Math.max(0, targetDate.getTime() - now.getTime()); // in milliseconds

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
}

export const elipsKey = (content: string) => {
  return content.length > 10 ? content.slice(0, 4) + "..." + content.slice(content.length - 4, content.length) : content
}

export const shortenAddress = (address: string, chars = 4) => {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export const formatTokenAmount = (
  raw: number | string | undefined,
  decimals = 0,
  symbol = "BNB",
  precision = 2
) => {
  if (raw === undefined || raw === null) return `0 ${symbol}`;
  const numeric = Number(raw);
  if (Number.isNaN(numeric)) return `0 ${symbol}`;
  const divisor = decimals > 0 ? 10 ** decimals : 1;
  const value = numeric / divisor;
  return `${value.toFixed(precision)} ${symbol}`;
};

export const isEvmAddress = (addr: string) => {
  if (typeof addr !== "string") return false;
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
};

export function timeAgo(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "Just now";
  }
  const timestamp = Number(ms);
  if (!Number.isFinite(timestamp)) {
    return "Just now";
  }

  const now = Date.now();
  const diff = Math.max(0, now - timestamp);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;

  if (diff < minute) {
    return "Just now";
  }
  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} min ago`;
  }
  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diff / year);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export function stylizeFloat(num: number) {
  return parseFloat(Number(num).toFixed(9)).toString();
}

export const calculateYesPercentage = (yesCount = 0, noCount = 0) => {
  const total = yesCount + noCount;
  if (total === 0) return 50;
  return Math.round((yesCount / total) * 100);
};


