import type { RequestHandler } from '@sveltejs/kit';
import { getData } from '../_api';

export const get: RequestHandler = async (request) => {
  return getData(request, request.params.slug);
};
