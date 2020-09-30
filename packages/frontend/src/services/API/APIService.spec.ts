import 'jest-webextension-mock';

import fetchMock from 'jest-fetch-mock';

import { requestAPI } from './APIService';

beforeAll(() => {
  console.log = jest.fn();
  fetchMock.enableMocks();
});

describe("API Service", () => {
  it("requestAPI get results", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ x: 1 }));
    const result = await requestAPI<{ x: 1 }>("GET", "/test", { y: 2 });
    expect(typeof result).toBe("object");
    expect(result?.x).toBe(1);
  });

  it("requestAPI post results", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: "post" }));
    const resultPost = await requestAPI<{ data: "post" }>("POST", "/test", { y: 2 });
    expect(typeof resultPost).toBe("object");
    expect(resultPost?.data).toBe("post");
  });
  it("requestAPI exception", async () => {
    fetchMock.mockRejectOnce(() => Promise.reject(new Error("API Error")));
    let err: any = undefined;
    let resultReject: any = {};
    try {
      resultReject = await requestAPI<{ data: "post" }>("POST", "/test", { y: 2 });
    } catch (e) {
      err = e;
    }
    expect(err).toBe(undefined);
    expect(resultReject).toBe(undefined);
    expect(console.log).toBeCalled();
  });
});
