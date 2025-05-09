import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tesla_stocks",
  password: "Gr00tdrax#3",
  port: 5432, // Default Postgres port
});

export default pool;
