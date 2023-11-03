'use client';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { last, size } from 'lodash';

interface QueryParams {
  [key: string]: any;
}

interface RequestBody {
  [key: string]: any;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, defaultHeaders?: Record<string, string>) {
    this.instance = axios.create({
      baseURL,
      headers: defaultHeaders,
    });
  }

  public async get<T>(
    endpoint: string,
    params?: QueryParams,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<T>(endpoint, {
      ...config,
      params,
    });
    return this.handleResponse(response);
  }

  public async post<T>(
    endpoint: string,
    body?: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<T>(endpoint, body, config);
    return this.handleResponse(response);
  }

  public async put<T>(
    endpoint: string,
    body?: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<T>(endpoint, body, config);
    return this.handleResponse(response);
  }

  public async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<T>(endpoint, config);
    return this.handleResponse(response);
  }

  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
}

const getAPIBaseUrl = () => {
  try {
    let origin = typeof window !== 'undefined' ? window.location.origin : '/';

    if (last(origin) === '/') {
      origin = origin.substring(0, size(origin) - 1);
    }

    return origin;
  } catch {
    return '';
  }
};

export const APIClient = new ApiClient(getAPIBaseUrl());
