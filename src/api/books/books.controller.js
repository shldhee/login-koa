const Book = require('models/book');

exports.list = async (ctx) => {
    // 변수를 미리 만들어줍니다.
    // (let 이나 const 는 scope 가 블록단위이기 때문에, try 바깥에 선언을 해줍니다)

    let books;

    try {
        // 데이터를 조회합니다.
        // .exec() 를 뒤에 붙여줘야 실제로 데이터베이스에 요청이 됩니다.
        // 반환값은 Promise 이므로 await 을 사용 할 수 있습니다.
        books = await Book.find()
            .sort({_id: -1}) // _id 의 역순으로 정렬합니다
            .limit(3) // 3개반 보여지도록 정렬합니다
            .exec(); // 데이터를 서버에 요청합니다.
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = books;
};

exports.create = async (ctx) => {
    // request body 에서 값들을 추출합니다
    const {
        title,
        authors,
        publishedDate,
        price,
        tags
    } = ctx.request.body;

    // Book 인스턴스를 생성합니다
    const book = new Book({
        title,
        authors,
        publishedDate,
        price,
        tags
    });

    // 만들어진 Book 인스턴스를, 이렇게 수정 할 수도 있습니다.
    // book.title = title;

    //.save() 함수를 실행하면 이 때 데이터베이스에 실제로 데이터를 작성합니다.
    // Promise 를 반환합니다.
    try {
        await book.save();
    } catch(e) {
        // HTTP 상태 500 와 Internal Error 라는 메시지를 반환하고,
        // 에러를 기록합니다.
        return ctx.throw(500, e);
    }

    // 저장한 결과를 반환합니다.
    ctx.body = book;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch(e) {
    if(e.name === 'CastError') {
      ctx.status = 400;
      return ;
    }
  }

  ctx.status = 204;
};

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  let book;

  try {
    book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true,
      new: true
    });
  } catch (e) {
    return ctx.throw(500, e);
  }
  ctx.body = book;
};

exports.update = (ctx) => {
  ctx.body = 'updated';
};

exports.get = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    let book;

    try {
        book = await Book.findById(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    if(!book) {
        // 존재하지 않으면
        ctx.status = 404;
        ctx.body = { message: 'book not found' };
        return;
    }

    ctx.body = book;
};
