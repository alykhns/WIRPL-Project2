const { createProxyMiddleware } = require("http-proxy-middleware");

const proxyRoutes = {
  "/api/auth": "http://localhost:8001",
  "/api/courier": "http://localhost:8002",
  "/api/shipment": "http://localhost:8003",
  "/api/tracking": "http://localhost:8004",
  "/api/webhook": "http://localhost:8005",
};

function registerProxies(app) {
  Object.entries(proxyRoutes).forEach(([path, target]) => {
    app.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        // Strip the "/api/<service>" prefix so each service receives its own
        // route paths (e.g. /api/auth/login -> /login,
        // /api/courier/couriers -> /couriers).
        pathRewrite: { [`^${path}`]: "" },
      })
    );
  });
}

module.exports = { proxyRoutes, registerProxies };
