import type { Response } from '@sveltejs/kit';

export const getData = async (text = '', id = '', length = 250): Promise<Response> => {
  const res = await fetch(
    `https://ws1.postescanada-canadapost.ca/Capture/Interactive/Find/v1.00/json3ex.ws?Key=TF36-KU97-AB94-ZC85&Text=${text}&Container=${id}&Limit=${length}&Language=en`
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
