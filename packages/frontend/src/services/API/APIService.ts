import queryString from "query-string";

const url = process.env.NODE_ENV !== "development" ? "http://localhost:3000" : "https://teacrypt.herokuapp.com";

export const requestAPI = async <T extends unknown>(
  method: string,
  path: string,
  body?: any
): Promise<T | undefined> => {
  let customPath = path;
  const config: any = {
    method,
    headers: {
      "content-type": "application/json",
      accept: "json",
    },
    credentials: "include",
  };

  if (config.method !== "GET") {
    config.body = JSON.stringify(body);
  } else if (body) {
    customPath = `${path}?${queryString.stringify(body)}`;
  }

  try {
    const res = await fetch(`${url}/api${customPath}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
