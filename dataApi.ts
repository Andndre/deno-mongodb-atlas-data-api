// simplified version of https://www.mongodb.com/developer/products/atlas/atlas-data-api-introduction/ https://www.mongodb.com/docs/atlas/api/data-api/

import {
  DeleteOne,
  Find,
  FindOne,
  Inserted,
  InsertedMany,
  UpdateOne,
} from "./types.ts";

export class DataAPI {
  private static instance?: DataAPI = undefined;
  url: string;
  apiKey: string;
  private query: { readonly database: string; readonly dataSource: string };
  private constructor(
    baseUrl: string,
    dataSource: string,
    database: string,
    apiKey: string,
  ) {
    this.url = baseUrl;
    this.apiKey = apiKey;
    this.query = {
      database,
      dataSource,
    } as const;
  }
  /**
   * @param url for example: " https://data.mongodb-api.com/app/data-abcde/endpoint/data/v1/action "
   * @param dataSource your cluster
   * @param databaseName database name inside your cluster
   * @param apiKey
   *
   * @see https://www.mongodb.com/docs/atlas/api/data-api/
   */
  static init(
    url: string,
    dataSource: string,
    databaseName: string,
    apiKey: string,
  ) {
    if (DataAPI.instance !== undefined) {
      throw new Error("The Data API is already initialized.");
    }
    DataAPI.instance = new DataAPI(url, dataSource, databaseName, apiKey);
    return DataAPI.instance!;
  }
  static get() {
    if (DataAPI.instance === undefined) {
      throw new Error(
        "The Data API was not initialized. Please initialize the data API using the init() function.",
      );
    }
    return DataAPI.instance!;
  }
  /**
   * @param collection
   * @param document
   *
   * @see https://www.mongodb.com/docs/atlas/api/data-api/
   */
  // deno-lint-ignore no-explicit-any
  async insertOne(collection: string, document: any) {
    const URI = this.url + "/insertOne";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        document,
      }),
    });
    return await response.json() as Inserted;
  }

  /**
   * @param collection
   * @param documents
   *
   * @see https://www.mongodb.com/docs/atlas/api/data-api/
   */
  async insertMany<T>(collection: string, documents: T[]) {
    const URI = this.url + "/insertMany";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        documents,
      }),
    });
    return await response.json() as InsertedMany;
  }
  /**
   * @param collection
   * @param filter
   *
   * @see https://www.mongodb.com/docs/atlas/api/data-api/
   */
  // deno-lint-ignore no-explicit-any
  async findOne<T>(collection: string, filter: any) {
    const URI = this.url + "/findOne";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        filter,
      }),
    });
    return await response.json() as FindOne<T>;
  }
  /**
   * @param collection
   * @param filter example: { "breed": "Labrador", "age": { "$gt" : 2} }
   * @param sort example: { "age" : 1 }
   *
   * @see https://www.mongodb.com/docs/atlas/api/data-api/
   */
  // deno-lint-ignore no-explicit-any
  async find<T>(collection: string, filter: any, sort?: any) {
    const URI = this.url + "/find";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        filter,
        sort,
      }),
    });
    return await response.json() as Find<T>;
  }
  /**
   * @param collection
   * @param filter example: { "breed": "Labrador", "age": { "$gt" : 2} }
   * @param update example: { "$set" : { "colour": "yellow" }}
   * @returns
   */
  // deno-lint-ignore no-explicit-any
  async updateOne(collection: string, filter: any, update: any) {
    const URI = this.url + "/updateOne";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        filter,
        update,
      }),
    });
    return await response.json() as UpdateOne;
  }
  // deno-lint-ignore no-explicit-any
  async deleteOne(collection: string, filter: any) {
    const URI = this.url + "/deleteOne";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        filter,
      }),
    });
    return await response.json() as DeleteOne;
  }
  // deno-lint-ignore no-explicit-any
  async aggregate(collection: string, pipeline: any) {
    const URI = this.url + "/aggregate";
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        pipeline,
      }),
    });

    return await response.json();
  }
  /**
	 * ```ts
	 fetch(baseUrl + '/' + action, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
		},
		body: JSON.stringify({
			collection,
			database,
			dataSource,
			...query, // <- your input
		}),
	});
	 * ```
   *
	 * @see https://www.mongodb.com/docs/atlas/api/data-api/
	 */
  // deno-lint-ignore no-explicit-any
  async custom(collection: string, action: string, query: any) {
    const URI = this.url + "/" + action;
    const response = await fetch(URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        collection,
        ...this.query,
        ...query,
      }),
    });
    return await response.json();
  }
}
