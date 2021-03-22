import Router from "koa-router";
const router = new Router({
  prefix: '/api'
});

router.get(['/', '/home'], async (ctx) => {
  ctx.body = "home";
});

export default router;