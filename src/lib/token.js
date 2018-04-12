const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/*
  JWT 토큰생성
  @param {any} payload
  @returns {string} token
*/


// 첫번째 파라미터는 토큰에 넣을 데이터, 두번째는 비밀 키, 세번째는 옵션, 네번째는 콜백함수가 들어갑니다. 위 코드를 서버 메인파일 (index.js) 의 하단에 넣어보세요.

function generateToken(payload) {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        payload,
        jwtSecret,
        {
          expiresIn: '7d'
        }, (error, token) => {
          if(error) reject(error);
          resolve(token);
        }
      );
    }
  );
}

exports.generateToken = generateToken;
