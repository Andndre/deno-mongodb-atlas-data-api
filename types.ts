export type Inserted = {
  insertedId: string;
};

export type InsertedMany = {
  insertedIds: string[];
};

export type FindOne<T> = {
  document: T;
};

export type Find<T> = {
  documents: T[];
};

export type UpdateOne = {
  matchedCount: number;
  modifiedCount: number;
};

export type DeleteOne = {
  deletedCount: number;
};
