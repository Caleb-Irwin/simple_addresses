import type { Search, Locals, SearchResults, Item } from '$lib/types';
import type { Request } from '@sveltejs/kit';

export const getData = async (request: Request, text = '', id = '', length = 250) => {
  const { slug } = request.params;

  const res = await fetch(
    `https://ws1.postescanada-canadapost.ca/Capture/Interactive/Find/v1.00/json3ex.ws?Key=TF36-KU97-AB94-ZC85&Text=${text}&Container=${id}&Limit=${length}&Language=en`
  );
  const items = await res.json();
  if (!Array.isArray(items?.Items)) {
    return { status: 500 };
  }
  const response = {
    status: res.status,
    body: items.Items
  };
  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return { body: [] };
  }

  return response;

  return { status: 400 };
};
