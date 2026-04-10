const http = require("node:http");

function request({ method, path, body, token }) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3001,
        path,
        method,
        headers: {
          ...(payload ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, data });
        });
      },
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  const login = await request({
    method: "POST",
    path: "/auth/login",
    body: { email: "admin@demo.com", password: "Admin123!" },
  });

  console.log("LOGIN", login.status, login.data);
  if (login.status !== 201 && login.status !== 200) {
    process.exit(1);
  }

  const parsed = JSON.parse(login.data);
  const dashboard = await request({
    method: "GET",
    path: "/dashboard",
    token: parsed.accessToken,
  });

  console.log("DASHBOARD", dashboard.status, dashboard.data);
  if (dashboard.status !== 200) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
