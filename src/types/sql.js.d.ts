declare module 'sql.js' {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface Database {
    run(sql: string, params?: (string | number | null | Uint8Array)[]): Database;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): Statement;
    close(): void;
  }

  interface Statement {
    bind(params?: (string | number | null | Uint8Array)[]): boolean;
    step(): boolean;
    getAsObject(params?: Record<string, unknown>): Record<string, unknown>;
    free(): boolean;
    reset(): void;
  }

  interface QueryExecResult {
    columns: string[];
    values: unknown[][];
  }

  export default function initSqlJs(config?: Record<string, unknown>): Promise<SqlJsStatic>;
  export { Database, Statement, SqlJsStatic, QueryExecResult };
}

declare module 'sql.js/dist/sql-asm.js' {
  import initSqlJs from 'sql.js';
  export default initSqlJs;
  export * from 'sql.js';
}
