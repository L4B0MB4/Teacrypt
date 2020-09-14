import queryString from 'query-string';

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
    credentials: "same-origin",
  };

  if (config.method !== "GET") {
    config.body = JSON.stringify(body);
  } else if (body) {
    customPath = `${path}?${queryString.stringify(body)}`;
  }

  try {
    const res = await fetch(`http://localhost:3000/api${customPath}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
