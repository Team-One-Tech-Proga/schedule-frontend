/* eslint-disable */
/* tslint:disable */

export interface LoginDto {
  username: string;
  password: string;
}
export interface TokenDto {
  access_token: string;
}
export interface ApiException {
  statusCode: number;
  message: string;
  error?: string;
}
export interface UserCreateDto {
  firstName: string;
  username: string;
  password: string;
  groupId: string;
}
export interface UserEntity {
  id: string;
  firstName: string;
  username: string;
  groupId: string;
  markedEventsIDs: string[];
}
export interface UniversityCreateDto {
  name: string;
  slug: string;
}
export interface UniversityEntity {
  id: string;
  name: string;
  slug: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}
export interface UniversityUpdateDto {
  name?: string;
  slug?: string;
}
export interface GroupCreateDto {
  name: string;
  slug: string;
  universityId: string;
}
export interface GroupEntity {
  id: string;
  name: string;
  slug: string;
  universityId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}
export interface GroupUpdateDto {
  name?: string;
  slug?: string;
}
export interface TeacherCreateDto {
  name: string;
  slug: string;
  universityId: string;
}
export interface TeacherEntity {
  id: string;
  name: string;
  slug: string;
  universityId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}
export interface TeacherUpdateDto {
  name?: string;
  slug?: string;
}
export interface CreateSubjectDto {
  name: string;
  nameRaw: string;
  groupId: string;
}
export interface SubjectEntity {
  id: string;
  name: string;
  nameRaw: string;
  groupId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}
export interface UpdateSubjectDto {
  name?: string;
}
export interface EventCreateDto {
  /** @format date-time */
  startAt: string;
  /** @format date-time */
  endAt: string;
  description?: string;
  sourceId: number;
  subjectId: string;
  groupId: string;
  teacherId?: string;
}
export interface EventEntity {
  id: string;
  /** @format date-time */
  startAt: string;
  /** @format date-time */
  endAt: string;
  description: string;
  sourceId: number;
  subjectId: string;
  subject?: SubjectEntity;
  groupId: string;
  group?: GroupEntity;
  teacherId: string;
  teacher?: TeacherEntity;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}
export interface EventUpdateDto {
  /** @format date-time */
  startAt?: string;
  /** @format date-time */
  endAt?: string;
  description?: string;
  subjectId?: string;
  groupId?: string;
  teacherId?: string;
}
export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;
export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}
export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}
export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}
type CancelToken = Symbol | string | number;
export declare enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}
export declare class HttpClient<SecurityDataType = unknown> {
  baseUrl: string;
  private securityData;
  private securityWorker?;
  private abortControllers;
  private customFetch;
  private baseApiParams;
  constructor(apiConfig?: ApiConfig<SecurityDataType>);
  setSecurityData: (data: SecurityDataType | null) => void;
  protected encodeQueryParam(key: string, value: any): string;
  protected addQueryParam(query: QueryParamsType, key: string): string;
  protected addArrayQueryParam(query: QueryParamsType, key: string): any;
  protected toQueryString(rawQuery?: QueryParamsType): string;
  protected addQueryParams(rawQuery?: QueryParamsType): string;
  private contentFormatters;
  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams;
  protected createAbortSignal: (cancelToken: CancelToken) => AbortSignal | undefined;
  abortRequest: (cancelToken: CancelToken) => void;
  request: <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams) => Promise<HttpResponse<T, E>>;
}
/**
 * @title Schedule API
 * @version 0.1
 * @contact Team One (https://github.com/Team-One-Tech-Proga)
 *
 * Get your academic timetable. Data is available in JSON format.
 */
export declare class ScheduleApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth: {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params?: RequestParams) => Promise<HttpResponse<TokenDto, ApiException>>;
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    authControllerRegister: (
      data: UserCreateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<UserEntity, ApiException>>;
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetProfile
     * @request GET:/auth/me
     * @secure
     */
    authControllerGetProfile: (params?: RequestParams) => Promise<HttpResponse<UserEntity, ApiException>>;
  };
  universities: {
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerCreate
     * @request POST:/universities
     * @secure
     */
    universitiesControllerCreate: (
      data: UniversityCreateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<UniversityEntity, ApiException>>;
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerFindAll
     * @request GET:/universities
     */
    universitiesControllerFindAll: (params?: RequestParams) => Promise<HttpResponse<UniversityEntity[], any>>;
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerFindOne
     * @request GET:/universities/{id}
     */
    universitiesControllerFindOne: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<UniversityEntity, void>>;
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerUpdate
     * @request PATCH:/universities/{id}
     * @secure
     */
    universitiesControllerUpdate: (
      id: string,
      data: UniversityUpdateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<UniversityEntity, ApiException | void>>;
    /**
     * No description
     *
     * @tags universities
     * @name UniversitiesControllerRemove
     * @request DELETE:/universities/{id}
     * @secure
     */
    universitiesControllerRemove: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<UniversityEntity, ApiException | void>>;
  };
  groups: {
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerCreate
     * @request POST:/groups
     * @secure
     */
    groupsControllerCreate: (
      data: GroupCreateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<GroupEntity, ApiException>>;
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerFindAll
     * @request GET:/groups
     */
    groupsControllerFindAll: (params?: RequestParams) => Promise<HttpResponse<GroupEntity[], any>>;
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerFindOne
     * @request GET:/groups/{id}
     */
    groupsControllerFindOne: (id: string, params?: RequestParams) => Promise<HttpResponse<GroupEntity, void>>;
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerUpdate
     * @request PATCH:/groups/{id}
     * @secure
     */
    groupsControllerUpdate: (
      id: string,
      data: GroupUpdateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<GroupEntity, ApiException | void>>;
    /**
     * No description
     *
     * @tags groups
     * @name GroupsControllerRemove
     * @request DELETE:/groups/{id}
     * @secure
     */
    groupsControllerRemove: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<GroupEntity, ApiException | void>>;
  };
  teachers: {
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerCreate
     * @request POST:/teachers
     * @secure
     */
    teachersControllerCreate: (
      data: TeacherCreateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<TeacherEntity, ApiException>>;
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerFindAll
     * @request GET:/teachers
     */
    teachersControllerFindAll: (params?: RequestParams) => Promise<HttpResponse<TeacherEntity[], any>>;
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerFindOne
     * @request GET:/teachers/{id}
     */
    teachersControllerFindOne: (id: string, params?: RequestParams) => Promise<HttpResponse<TeacherEntity, void>>;
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerUpdate
     * @request PATCH:/teachers/{id}
     * @secure
     */
    teachersControllerUpdate: (
      id: string,
      data: TeacherUpdateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<TeacherEntity, ApiException>>;
    /**
     * No description
     *
     * @tags teachers
     * @name TeachersControllerRemove
     * @request DELETE:/teachers/{id}
     * @secure
     */
    teachersControllerRemove: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<TeacherEntity, ApiException>>;
  };
  subjects: {
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerCreate
     * @request POST:/subjects
     * @secure
     */
    subjectsControllerCreate: (
      data: CreateSubjectDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<SubjectEntity, ApiException>>;
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerFindAll
     * @request GET:/subjects
     */
    subjectsControllerFindAll: (params?: RequestParams) => Promise<HttpResponse<SubjectEntity[], any>>;
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerFindOne
     * @request GET:/subjects/{id}
     */
    subjectsControllerFindOne: (id: string, params?: RequestParams) => Promise<HttpResponse<SubjectEntity, void>>;
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerUpdate
     * @request PATCH:/subjects/{id}
     * @secure
     */
    subjectsControllerUpdate: (
      id: string,
      data: UpdateSubjectDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<SubjectEntity, ApiException | void>>;
    /**
     * No description
     *
     * @tags subjects
     * @name SubjectsControllerRemove
     * @request DELETE:/subjects/{id}
     * @secure
     */
    subjectsControllerRemove: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<SubjectEntity, ApiException | void>>;
  };
  events: {
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerCreate
     * @request POST:/events
     * @secure
     */
    eventsControllerCreate: (
      data: EventCreateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<EventEntity, ApiException>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindAll
     * @request GET:/events
     */
    eventsControllerFindAll: (
      query?: {
        groupId?: string;
        teacherId?: string;
        subjectId?: string;
        /** @format date-time */
        startAt?: string;
        /** @format date-time */
        endAt?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<EventEntity[], ApiException>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindAllMarked
     * @request GET:/events/marked
     * @secure
     */
    eventsControllerFindAllMarked: (
      query?: {
        groupId?: string;
        teacherId?: string;
        subjectId?: string;
        /** @format date-time */
        startAt?: string;
        /** @format date-time */
        endAt?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<EventEntity[], ApiException>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerFindOne
     * @request GET:/events/{id}
     */
    eventsControllerFindOne: (id: string, params?: RequestParams) => Promise<HttpResponse<EventEntity, void>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerUpdate
     * @request PATCH:/events/{id}
     * @secure
     */
    eventsControllerUpdate: (
      id: string,
      data: EventUpdateDto,
      params?: RequestParams,
    ) => Promise<HttpResponse<EventEntity, ApiException | void>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerRemove
     * @request DELETE:/events/{id}
     * @secure
     */
    eventsControllerRemove: (
      id: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<EventEntity, ApiException | void>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerMark
     * @request POST:/events/{id}/mark
     * @secure
     */
    eventsControllerMark: (id: string, params?: RequestParams) => Promise<HttpResponse<void, ApiException | void>>;
    /**
     * No description
     *
     * @tags events
     * @name EventsControllerUnMark
     * @request DELETE:/events/{id}/mark
     * @secure
     */
    eventsControllerUnMark: (id: string, params?: RequestParams) => Promise<HttpResponse<void, ApiException | void>>;
  };
}
export {};
