import { fromHono, RouterOptions } from "chanfana";
import { Hono } from "hono";
import { AppOptions, AppRouter } from "index";

export function configureOpenApi(app: Hono<AppOptions>): AppRouter {
  const options: RouterOptions = {
    docs_url: "/swagger",
    redoc_url: "/redoc",
    schema: {
      info: {
        title: "第七屆 高雄高校特約聯盟 商店資訊暨數位會員整合系統 API 技術文件",
        description:
          "本技術文件主要目的是用於傳承特約系統的設計，倘若您非聯盟工作人員，但想要串接我們的 API，請您聯繫我們的官方 Instagram 帳號。\n\n本文件的「校園帳號」係指學校統一為學生配發 Google Workspace for Education 之方案的帳號。",
        version: "1.0.0",
        contact: {
          name: "高校特約技術部門",
          url: "https://instagram.com/ukhsc_2025",
          email: "contact@ukhsc.org",
        },
      },
      servers: [
        {
          url: "http://localhost:8787",
          description: "Local Development",
        },
        {
          url: "https://api.ukhsc.org",
          description: "Production",
        },
      ],
    },
  };
  const openapi = fromHono(app, options);

  registerSecurity(openapi);
  addDocumentUI(app);

  return openapi;
}

function registerSecurity(openapi: AppRouter): void {
  openapi.registry.registerComponent("securitySchemes", "userAuth", {
    type: "http",
    scheme: "bearer",
    description: "Bearer token for authenticated users",
  });
  openapi.registry.registerComponent("securitySchemes", "memberAuth", {
    type: "http",
    scheme: "bearer",
    description: "Bearer token for users with 'StudentMember' role",
  });
}

function addDocumentUI(app: Hono<AppOptions>): void {
  // See also: https://github.com/scalar/scalar
  const html = `<!doctype html>
<html>
  <head>
    <title>高校特約 | API 技術文件</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  </head>
  <body>
    <script id="api-reference" data-url="openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25"></script>
  </body>
</html>`;

  const favicon = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="256" height="256" rx="30" fill="white" style="fill:white;fill-opacity:1;"/>
<path d="M165.404 124.393C160.606 124.393 155.704 123.988 151.458 121.744C147.555 119.681 144.115 116.83 141.137 113.191C136.554 107.59 134.262 101.056 134.262 93.5877V46.7201C134.262 40.867 136.402 33.5781 142.233 33.5781C148.064 33.5781 150.204 40.867 150.204 46.7202V88.587C150.204 91.3488 152.434 93.5877 155.185 93.5877C157.937 93.5877 160.167 91.3488 160.167 88.5869V45.1463C160.167 40.1697 161.187 33.5781 166.145 33.5781C171.102 33.5781 172.123 40.1697 172.123 45.1463V88.587C172.123 91.3488 174.353 93.5877 177.104 93.5877C179.856 93.5877 182.086 91.3488 182.086 88.5869V46.7201C182.086 40.867 184.226 33.5781 190.057 33.5781C195.887 33.5781 198.027 40.867 198.027 46.7202V93.5877C198.027 101.056 195.736 107.59 191.153 113.191C188.175 116.83 184.734 119.681 180.831 121.744C176.586 123.988 171.684 124.393 166.886 124.393H165.404Z" fill="#34495D" style="fill:#34495D;fill:color(display-p3 0.2039 0.2863 0.3647);fill-opacity:1;"/>
<path d="M149.922 221.487C129.729 227.563 104.225 226.261 84.4989 216.872C75.7418 212.348 69.1103 205.862 64.6042 197.413C60.1832 188.878 57.9727 178.508 57.9727 166.304V34.3145H91.8956V162.335C91.8956 170.443 92.9584 176.801 95.0839 181.41C97.2944 186.019 101.626 195.449 121.516 195.449C141.406 195.449 149.922 187.807 149.922 162.335C149.922 136.863 149.922 114.327 149.922 114.327H183.462V162.591C183.462 195.449 170.114 215.411 149.922 221.487Z" fill="#34495D" style="fill:#34495D;fill:color(display-p3 0.2039 0.2863 0.3647);fill-opacity:1;"/>
</svg>`;

  app.get("/docs", () => {
    // eslint-disable-next-line no-undef
    return new Response(html, { headers: { "Content-Type": "text/html" }, status: 200 });
  });
  app.get("/", (ctx) => {
    return ctx.redirect("/docs");
  });
  app.get("/favicon.svg", () => {
    // eslint-disable-next-line no-undef
    return new Response(favicon, { headers: { "Content-Type": "image/svg+xml" }, status: 200 });
  });
}
