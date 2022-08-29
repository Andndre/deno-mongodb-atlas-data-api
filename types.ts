export type Inserted = {
	insertedId: string;
};

export type InsertedMany = {
	insertedIds: string[];
};

export type FindOne = {
	// deno-lint-ignore no-explicit-any
	document: any;
};

export type Find = {
	// deno-lint-ignore no-explicit-any
	documents: any[];
};

export type UpdateOne = {
	matchedCount: number;
	modifiedCount: number;
};

export type DeleteOne = {
	deletedCount: number;
};
