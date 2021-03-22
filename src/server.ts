import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";
import koaStatic from 'koa-static';
import config from "./config";

import homeRoute from "./routes/home.route";
import eventsRoute from "./routes/events.route";

const app = new Koa();

app.use(bodyParser());
app.use(
  cors({
    origin: "*"
  })
);
app.use(logger());

app.use(koaStatic('static'));

app.use(homeRoute.routes());
app.use(eventsRoute.routes());

const server = app
  .listen(config.port, async () => {
    console.log(`Server listening on port: ${config.port}`);
  })
  .on("error", err => {
    console.error(err);
  });

export default server;