/* eslint-disable */
/* tslint:disable */

export var ContentType;
(function (ContentType) {
  ContentType["Json"] = "application/json";
  ContentType["FormData"] = "multipart/form-data";
  ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
  ContentType["Text"] = "text/plain";
})(ContentType || (ContentType = {}));
export class HttpClient {
  baseUrl = "";
  securityData = null;
  securityWorker;
  abortControllers = new Map();
  customFetch = (...fetchParams) => fetch(...fetchParams);
  baseApiParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };
  constructor(apiConfig = {}) {
    Object.assign(this, apiConfig);
  }
  setSecurityData = (data) => {
    this.securityData = data;
  };
  encodeQueryParam(key, value) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }
  addQueryParam(query, key) {
    return this.encodeQueryParam(key, query[key]);
  }
  addArrayQueryParam(query, key) {
    const value = query[key];
    return value.map((v) => this.encodeQueryParam(key, v)).join("&");
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }
  contentFormatters = {
    [ContentType.Json]: (input) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
  };
  mergeRequestParams(params1, params2) {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }
  createAbortSignal = (cancelToken) => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }
    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };
  abortRequest = (cancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);
    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };
  request = async ({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params }) => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;
    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response;
      r.data = null;
      r.error = null;
      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });
      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }
      if (!response.ok) throw data;
      return data;
    });
  };
}
/**
 * @title Schedule API
 * @version 0.1
 * @contact Team One (https://github.com/Team-One-Tech-Proga)
 *
 * Get your academic timetable. Data is available in JSON format.
 */
export class ScheduleApi extends HttpClient {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data, params = {}) =>
      this.request({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    authControllerRegister: (data, params = {}) =>
      this.request({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetProfile
     * @request GET:/auth/me
     * @secure
     */
    authControllerGetProfile: (params = {}) =>
      this.request({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  universities = {
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerCreate
     * @request POST:/universities
     * @secure
     */
    universitiesControllerCreate: (data, params = {}) =>
      this.request({
        path: `/universities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerFindAll
     * @request GET:/universities
     */
    universitiesControllerFindAll: (params = {}) =>
      this.request({
        path: `/universities`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerFindOne
     * @request GET:/universities/{id}
     */
    universitiesControllerFindOne: (id, params = {}) =>
      this.request({
        path: `/universities/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerUpdate
     * @request PATCH:/universities/{id}
     * @secure
     */
    universitiesControllerUpdate: (id, data, params = {}) =>
      this.request({
        path: `/universities/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerRemove
     * @request DELETE:/universities/{id}
     * @secure
     */
    universitiesControllerRemove: (id, params = {}) =>
      this.request({
        path: `/universities/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  groups = {
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerCreate
     * @request POST:/groups
     * @secure
     */
    groupsControllerCreate: (data, params = {}) =>
      this.request({
        path: `/groups`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerFindAll
     * @request GET:/groups
     */
    groupsControllerFindAll: (params = {}) =>
      this.request({
        path: `/groups`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerFindOne
     * @request GET:/groups/{id}
     */
    groupsControllerFindOne: (id, params = {}) =>
      this.request({
        path: `/groups/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerUpdate
     * @request PATCH:/groups/{id}
     * @secure
     */
    groupsControllerUpdate: (id, data, params = {}) =>
      this.request({
        path: `/groups/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerRemove
     * @request DELETE:/groups/{id}
     * @secure
     */
    groupsControllerRemove: (id, params = {}) =>
      this.request({
        path: `/groups/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  teachers = {
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerCreate
     * @request POST:/teachers
     * @secure
     */
    teachersControllerCreate: (data, params = {}) =>
      this.request({
        path: `/teachers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerFindAll
     * @request GET:/teachers
     */
    teachersControllerFindAll: (params = {}) =>
      this.request({
        path: `/teachers`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerFindOne
     * @request GET:/teachers/{id}
     */
    teachersControllerFindOne: (id, params = {}) =>
      this.request({
        path: `/teachers/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerUpdate
     * @request PATCH:/teachers/{id}
     * @secure
     */
    teachersControllerUpdate: (id, data, params = {}) =>
      this.request({
        path: `/teachers/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerRemove
     * @request DELETE:/teachers/{id}
     * @secure
     */
    teachersControllerRemove: (id, params = {}) =>
      this.request({
        path: `/teachers/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  subjects = {
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerCreate
     * @request POST:/subjects
     * @secure
     */
    subjectsControllerCreate: (data, params = {}) =>
      this.request({
        path: `/subjects`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerFindAll
     * @request GET:/subjects
     */
    subjectsControllerFindAll: (params = {}) =>
      this.request({
        path: `/subjects`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerFindOne
     * @request GET:/subjects/{id}
     */
    subjectsControllerFindOne: (id, params = {}) =>
      this.request({
        path: `/subjects/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerUpdate
     * @request PATCH:/subjects/{id}
     * @secure
     */
    subjectsControllerUpdate: (id, data, params = {}) =>
      this.request({
        path: `/subjects/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerRemove
     * @request DELETE:/subjects/{id}
     * @secure
     */
    subjectsControllerRemove: (id, params = {}) =>
      this.request({
        path: `/subjects/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerCreate
     * @request POST:/events
     * @secure
     */
    eventsControllerCreate: (data, params = {}) =>
      this.request({
        path: `/events`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindAll
     * @request GET:/events
     */
    eventsControllerFindAll: (query, params = {}) =>
      this.request({
        path: `/events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindAllMarked
     * @request GET:/events/marked
     * @secure
     */
    eventsControllerFindAllMarked: (query, params = {}) =>
      this.request({
        path: `/events/marked`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindOne
     * @request GET:/events/{id}
     */
    eventsControllerFindOne: (id, params = {}) =>
      this.request({
        path: `/events/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerUpdate
     * @request PATCH:/events/{id}
     * @secure
     */
    eventsControllerUpdate: (id, data, params = {}) =>
      this.request({
        path: `/events/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerRemove
     * @request DELETE:/events/{id}
     * @secure
     */
    eventsControllerRemove: (id, params = {}) =>
      this.request({
        path: `/events/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerMark
     * @request POST:/events/{id}/mark
     * @secure
     */
    eventsControllerMark: (id, params = {}) =>
      this.request({
        path: `/events/${id}/mark`,
        method: "POST",
        secure: true,
        ...params,
      }),
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerUnMark
     * @request DELETE:/events/{id}/mark
     * @secure
     */
    eventsControllerUnMark: (id, params = {}) =>
      this.request({
        path: `/events/${id}/mark`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
