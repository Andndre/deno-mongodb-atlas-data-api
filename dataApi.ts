// simplified version of https://www.mongodb.com/developer/products/atlas/atlas-data-api-introduction/ https://www.mongodb.com/docs/atlas/api/data-api/

import {
	DeleteOne,
	Find,
	FindOne,
	Inserted,
	InsertedMany,
	UpdateOne,
} from './types.ts';

export class DataAPI {
	private static instance?: DataAPI = undefined;
	url: string;
	apiKey: string;
	private query: { readonly database: string; readonly dataSource: string };
	private constructor(
		baseUrl: string,
		dataSource: string,
		database: string,
		apiKey: string
	) {
		this.url = baseUrl;
		this.apiKey = apiKey;
		this.query = {
			database,
			dataSource,
		} as const;
	}
	/**
	 *
	 * @param url for example: " https://data.mongodb-api.com/app/data-abcde/endpoint/data/v1/action "
	 * @param apiKey
	 * @returns
	 */
	static init(
		url: string,
		dataSource: string,
		databaseName: string,
		apiKey: string
	) {
		if (DataAPI.instance !== undefined) {
			throw new Error('The Data API is already initialized.');
		}
		DataAPI.instance = new DataAPI(url, dataSource, databaseName, apiKey);
		return DataAPI.instance!;
	}
	static get() {
		if (DataAPI.instance === undefined) {
			throw new Error(
				'The Data API was not initialized. Please initialize the data API using the init() function.'
			);
		}
		return DataAPI.instance!;
	}
	// deno-lint-ignore no-explicit-any
	async insertOne(collection: string, document: any) {
		const URI = this.url + '/insertOne';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				document,
			}),
		});
		const json = (await readJSON(response.body!)) as Inserted;
		return json;
	}

	// deno-lint-ignore no-explicit-any
	async insertMany(collection: string, documents: any[]) {
		const URI = this.url + '/insertMany';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				documents,
			}),
		});
		const json = (await readJSON(response.body!)) as InsertedMany;
		return json;
	}
	// deno-lint-ignore no-explicit-any
	async findOne(collection: string, filter: any) {
		const URI = this.url + '/findOne';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				filter,
			}),
		});
		const json = (await readJSON(response.body!)) as FindOne;
		return json;
	}
	/**
	 *
	 * @param collection
	 * @param filter example: { "breed": "Labrador", "age": { "$gt" : 2} }
	 * @param sort example: { "age" : 1 }
	 * @returns
	 */
	// deno-lint-ignore no-explicit-any
	async find(collection: string, filter: any, sort?: any) {
		const URI = this.url + '/find';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				filter,
				sort,
			}),
		});
		const json = (await readJSON(response.body!)) as Find;
		return json;
	}
	/**
	 *
	 * @param collection
	 * @param filter example: { "breed": "Labrador", "age": { "$gt" : 2} }
	 * @param update example: { "$set" : { "colour": "yellow" }}
	 * @returns
	 */
	// deno-lint-ignore no-explicit-any
	async updateOne(collection: string, filter: any, update: any) {
		const URI = this.url + '/updateOne';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				filter,
				update,
			}),
		});
		const json = (await readJSON(response.body!)) as UpdateOne;
		return json;
	}
	// deno-lint-ignore no-explicit-any
	async deleteOne(collection: string, filter: any) {
		const URI = this.url + '/deleteOne';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				filter,
			}),
		});
		const json = (await readJSON(response.body!)) as DeleteOne;
		return json;
	}
	// deno-lint-ignore no-explicit-any
	async aggregate(collection: string, pipeline: any) {
		const URI = this.url + '/aggregate';
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				pipeline,
			}),
		});
		const json = await readJSON(response.body!);
		return json;
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
	 * for more information, please [read](https://www.mongodb.com/developer/products/atlas/atlas-data-api-introduction/)
	 */
	// deno-lint-ignore no-explicit-any
	async custom(collection: string, action: string, query: any) {
		const URI = this.url + '/' + action;
		const response = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': this.apiKey,
			},
			body: JSON.stringify({
				collection,
				...this.query,
				...query,
			}),
		});
		const json = await readJSON(response.body!);
		return json;
	}
}

async function readText(rs: ReadableStream<Uint8Array>) {
	const reader = rs.getReader();
	const value = (await reader.read()).value;
	reader.cancel();
	return new TextDecoder().decode(value);
}

async function readJSON(rs: ReadableStream<Uint8Array>) {
	return JSON.parse(await readText(rs));
}
