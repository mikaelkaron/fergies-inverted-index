export = main;
/**
 * Creates and intializes index
 * @param {FiiOptions} [ops] Options
 * @returns Promise<Object>
 */
declare function main(ops?: FiiOptions): Promise<any>;
declare namespace main {
    export { AbstractLevelConstructor, FiiOptions };
}
/**
 * Fii options
 */
type FiiOptions = {
    /**
     * Name of database
     */
    name?: string;
    /**
     * Constructor of `class` extending [`abstract-level`](https://github.com/Level/abstract-level)
     */
    db?: AbstractLevelConstructor;
    /**
     * Creates 'comment' spaces in tokens.
     * For example using `#` allows tokens like `boom#1.00` to be retrieved by using `boom`.
     * If `tokenAppend` wasnt used, then `{gte: 'boom', lte: 'boom'}` would also return stuff like `boomness#1.00` etc
     */
    tokenAppend?: string;
    /**
     * Sets case sensitivity of the index
     */
    caseSensitive?: boolean;
    /**
     * Array of stop words to be stripped using [`stopword`](https://github.com/fergiemcdowall/stopword)
     */
    stopwords?: string[];
    /**
     * Array of fields not to index
     */
    doNotIndexField?: string[];
    storeVectors?: boolean;
    /**
     * Field used to verify that doc exists
     */
    docExistsSpace?: string;
};
type AbstractLevelConstructor = new <K, V>(name: string, options?: import("abstract-level").AbstractDatabaseOptions<K, V>) => import("abstract-level/types/abstract-level.js").AbstractLevel<any, K, V>;