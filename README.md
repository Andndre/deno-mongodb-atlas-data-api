# Deno MongoDB Atlas Data API Wrapper

This is a simple library that turns the long and repeating code to access the MongoDB Data API into more simple, readable, and maintainable code.

This library can simplify your code from this:
```ts
const URL = BASE_URL + '/insertOne';
const response = await fetch(URL, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'api-key': API_KEY,
	},
	body: JSON.stringify({
		collection: 'collectionName',
		database: 'databaseName',
		dataSource: 'the-data-source',
		document: {
			name: 'test',
			age: 17
		},
	}),
});
```
to this:
```ts
const instance = DataAPI.get();
instance.insertOne('collectionName', {name: 'test', age: 17})
```
But make sure to initialize the DataAPI instance with this code first:
```ts
const instance = DataAPI.init(BASE_URL + '/action', DATA_SOURCE, DATABASE, API_KEY) // returns the DataAPI instance
```

## When to Use the Data API

*taken straight from this [documentation page](https://www.mongodb.com/docs/atlas/api/data-api/)*

You can use the Data API to integrate Atlas into any apps and services that support HTTPS requests. For example, you might:

- call the API from a serverless edge function
- access test data and log events in a CI/CD workflow
- integrate Atlas into a federated API gateway
- connect from an environment not currently supported via a MongoDB Driver or Realm SDK