import { Gen3Response } from "../../dataAccess";

export interface FetchRequest {
    readonly hostname: string;
    readonly endpoint: string;
    readonly method: "GET" | "POST";
    readonly body?: object;
    readonly headers: Record<string,string>;
}

export interface Gen3FenceRequest {
    readonly hostname: string;
    readonly endpoint: string;
    readonly method: "GET" | "POST";
    readonly body?: object;
}



export type Gen3FenceResponse<H> = Gen3Response<H>;

export interface FetchError <T> {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly text: string;
    readonly request?: T;
}

export const buildFetchError = async <T>(
  res: Response,
  request?: T,
): Promise<FetchError<T>> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    request: request,
  };
};

export interface NameUrl {
    readonly name: string;
    readonly url: string;
}

export interface Gen3LoginProvider {
    readonly desc?: string;
    readonly id: string;
    readonly idp: string;
    readonly name: string;
    readonly secondary: boolean;
    readonly url: string;
    readonly urls: Array<NameUrl>
}

export interface Gen3FenceUserProviders {
    readonly default_provider: Gen3LoginProvider;
    readonly providers: Array<Gen3LoginProvider>;
}

/**
 * The base call to Gen3 fence which support both GET and POST methods.
 * This can be used to build other fence related commands.
 * @param hostname
 * @param csrftoken
 */
export const fetchLogin = async (
  hostname: string,
  csrftoken: string | undefined
) : Promise<Gen3FenceResponse<Gen3FenceUserProviders>> => {

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-csrf-token": csrftoken ? csrftoken : "",
  };

  return fetchFence<Gen3FenceUserProviders>({
    hostname: hostname,
    endpoint: "login/",
    method:"GET",
    headers : headers
  });
};

export const fetchFence = async<T> (
  request: FetchRequest,
): Promise<Gen3FenceResponse<T>> => {
  const res = await fetch(`${request.hostname}`, {
    method: request.method,
    headers: request.headers,
    body: request.method === "POST" ? JSON.stringify(request.body) : null,
  });
  if (res.ok)
    return { data: await res.json() };

  throw await buildFetchError(res, request);
};
