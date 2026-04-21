import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const buildErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return (
      data?.message ||
      data?.error ||
      `Request failed with status ${status}`
    );
  }
  if (error.request) {
    return "No response from server. Please check your internet connection.";
  }
  return error.message || "An unknown error occurred";
};

const unwrap = (response) => {
  const body = response?.data;
  if (!body || body.success !== true) {
    throw new Error(body?.message || "Unexpected response from server");
  }
  return body;
};

/**
 * Fetch a paginated list of pokemon.
 *
 * @param {Object} options
 * @param {number} [options.page=1]   Page number (1-based)
 * @param {number} [options.limit=12] Items per page
 * @param {string} [options.search]   Optional name search
 * @param {string} [options.type]     Optional type filter
 * @returns {Promise<{ data: Array, pagination: { page, limit, total, totalPages } }>}
 */
export const getPokemonList = async ({
  page = 1,
  limit = 12,
  search = "",
  type = "",
} = {}) => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (type) params.type = type;

    const response = await apiClient.get("", { params });
    const body = unwrap(response);

    return {
      data: Array.isArray(body.data) ? body.data : [],
      pagination: body.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    const message = buildErrorMessage(error);
    console.error("[pokedex.service] getPokemonList failed:", message);
    throw new Error(message);
  }
};

/**
 * Fetch a single pokemon by its national dex number.
 *
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const getPokemonById = async (id) => {
  try {
    const response = await apiClient.get(`/${id}`);
    const body = unwrap(response);
    return body.data;
  } catch (error) {
    const message = buildErrorMessage(error);
    console.error(`[pokedex.service] getPokemonById(${id}) failed:`, message);
    throw new Error(message);
  }
};

export default {
  getPokemonList,
  getPokemonById,
};
