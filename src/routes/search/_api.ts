import type { RequestHandlerOutput } from '@sveltejs/kit';
import 'dotenv/config';

export const getData = async (text = '', id = '', length = 250): Promise<RequestHandlerOutput> => {
  const res = await fetch(
    `https://ws1.postescanada-canadapost.ca/Capture/Interactive/Find/v1.00/json3ex.ws?Key=${process.env['KEY']}&Text=${text}&Container=${id}&Limit=${length}&Language=en`
  );
  const items = await res.json();
  if (!Array.isArray(items?.Items)) {
    return { status: 500, headers: {} };
  }
  const response = {
    status: res.status,
    body: items.Items,
    headers: {}
  };

  return response;
};
