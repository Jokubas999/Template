import { serve } from "bun";
import index from "./index.html";
import { Database } from "bun:sqlite";

const db = new Database("data.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    admin BOOLEAN DEFAULT FALSE
  )
`);

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/createUser": {
      async POST(req) {
        try {
          const body = await req.json();
          const { username, password, admin } = body;
          const user = db
            .query("SELECT * FROM users WHERE username = ?")
            .get(username);

          if (user) {
            return Response.json(
              {
                error:"Username already exists",
              },
              { status: 400 }
            );
          }
          // create user
          db.run(
            `INSERT INTO users (username, password, admin) VALUES (?, ?, ?)`,
            [username, password, admin ? 1 : 0]
          );

          return Response.json({
            success: true,
            message:
              "User created successfully",
          });

        } catch (error) {
          console.error(error);

          return Response.json(
            { error: "Server error" },
          );
        }
      },
    },
    "/api/login": {
      async POST(req) {
        try {
          const body = await req.json();

          const { username, password} = body;

          // find user
          const user = db
            .query(`SELECT * FROM users WHERE username = ?`)
            .get(username);

          if (!user) {
            return Response.json(
              {
                error: "User not found",
              },
              { status: 401 }
            );
          }
          // compare password
          const passwordMatch = user.password === password;

          if (!passwordMatch) {
            return Response.json(
              {
                error: "Incorrect password",
              },
              { status: 401 }
            );
          }

          return Response.json({
            success: true,
            message: "Login successful",
          });

        } catch (error) {
          console.error(error);

          return Response.json(
            { error: "Server error" },
          );
        }
      },
    },
    "/api/getAllUsers": {
      async GET() {
        try {
          const users = db
            .query(`SELECT * FROM users`)
            .all();

          return Response.json(users);

        } catch (error) {
          console.error(error);

          return Response.json(
            { error: "Server error" },
          );
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
