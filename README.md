# Deno MongoDB Atlas Data API

This is a simple library that provides an interface to the MongoDB Atlas Data API. The library can be used to perform basic CRUD (Create, Read, Update, and Delete) operations on a MongoDB database without the need for a dedicated driver.

The library is written in TypeScript, and it provides TypeScript definitions for all of its methods.

## Usage
To use the DataAPI library, you first need to initialize it with your MongoDB Atlas API key and the URL of your Data API endpoint. You can then use the insertOne, insertMany, findOne, find, updateOne, and deleteOne methods to perform CRUD operations on your database.

Here's an example of how you can use the library to insert a document into a collection:

```ts
import { DataAPI } from "https://deno.land/x/mongodbdataapi/mod.ts";

const api = DataAPI.init(
  "https://data.mongodb-api.com/app/data-abcde/endpoint/data/v1/action", // remember to add "/action"!
  "my-cluster",
  "my-database",
  "my-api-key",
);

const result = await api.insertOne("my-collection", {
  name: "John Doe",
  age: 42,
});

console.log(result);
```

The `init` method initializes the library with the URL of the Data API endpoint, the name of the cluster, the name of the database, and the API key. The insertOne method is then used to insert a document into the my-collection collection. The result of the operation is logged to the console.

## When to Use the Data API

*taken straight from this [documentation page](https://www.mongodb.com/docs/atlas/api/data-api/)*

You can use the Data API to integrate Atlas into any apps and services that support HTTPS requests. For example, you might:

- call the API from a serverless edge function
- access test data and log events in a CI/CD workflow
- integrate Atlas into a federated API gateway
- connect from an environment not currently supported via a MongoDB Driver or Realm SDK
