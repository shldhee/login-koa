require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
}).then(
  (response) => {
    console.log('Successfully connected to mongodb');
  }
).catch(e => {
  console.error(e);
});

const port = process.env.PORT || 4000;

app.use(bodyParser()); // 라우터보다 앞쪽에

router.use('/api', api.routes());

// router.get('/', (ctx, next) => {
//   ctx.body = '홈';
// });
//
// router.get('/about', (ctx, next) => {
//   ctx.body = 'About';
// });
//
// router.get('/about/:name', (ctx, next) => {
//   const { name } = ctx.params;
//   ctx.body = `${name} 입니다.`;
// });
//
// router.get('/post', (ctx, next) => {
//   const { id } = ctx.request.query;
//   if(id) {
//     ctx.body = `포스트 # ${id}`;
//   } else {
//     ctx.body = '포스트 아이디가 없습니다';
//   }
// });

app.use(router.routes()).use(router.allowedMethods());

// app.use(router.routes());
// app.use(router.allowedMethods());

// app.use((ctx, next) => {
//     console.log(1);
//     const started = new Date();
//     next().then(() => { // next() 성공적으로 실행하면 then() 함수 실행
//         console.log(new Date() - started + 'ms');
//     });
// });

// app.use(async (ctx, next) => {
//     console.log(1);
//     const started = new Date();
//     await next(); // next() 함수가 실행되어 반환되고 나서
//     console.log(new Date() - started + 'ms'); // 요기가 실행
// });

app.listen(port, () => {
    console.log(`heurm server is listening to port ${port}`);
});
