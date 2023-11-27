import { useState, useEffect } from "react";
import { google, kakao, naver } from '../../images';
import './login.css';
import * as AxiosUtil from '../../lib/AxiosUtil';
import { Cookies } from "react-cookie";

const Login = () => {
  const cookies = new Cookies();
  const restKey = process.env.REACT_APP_KAKAO_REST_KEY;
  const redirectUrl = 'http://localhost:3000/login';

  const handleLoginClick = (handler: string) => {
    if (handler === 'kakao') {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${restKey}&redirect_uri=${redirectUrl}`;
    } else {
      alert('준비중입니다.');
    }
  };

  useEffect(() => {
    const urlString = window.location.href;
    const codeRegex = /code=([^&]+)/;
    const match = urlString.match(codeRegex);

    if (match) {
      const code = match[1];
      const data = {
        'grant_type': 'authorization_code',
        'client_id': restKey,
        'redirect_uri': redirectUrl,
        'code': code
      };

      AxiosUtil.send('POST', 'kakao/oauth/token', data, '', (e:any) => {
        console.log('oauth/token ==> ');
        console.log(e);
        if (e) {
          cookies.set("kakaoAccessToken", e.access_token, {
            path: "/",
            maxAge: e.expires_in
          });
  
          AxiosUtil.send('GET', 'kapi/v2/user/me', {}, '', (e:any) => {
            console.log('kakao v2/user/me ==> ');
            console.log(e);
            if (e) {
              const account = e.kakao_account;
              const profile = account.profile;
              const user = {
                'uid': e.id,
                'name': profile.nickname,
                'email': account.email,
                'snsType': 'kakao'
              }
              console.log('user => ');
              console.log(user);

              AxiosUtil.send('POST', '/users-api/users/signIn', user, 'json', (e:any) => {
                console.log('users/signIn ==> ');
                console.log(e);

                /*
                {
                    "status": "OK",
                    "errors": null,
                    "data": {
                        "msg": "Success",
                        "code": "LGN",
                        "accessTokenExpires": "300",
                        "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjb25mMzEyQGtha2FvLmNvbSIsImlkIjo0LCJhdXRoIjoiSVNTVUVNT0FfVVNFUiIsImV4cCI6MTcwMTA1MTY2N30.qlILY6X4dvQnxMCcdm2JhJBhRR1i03Zi947CahSI4dqmXYG8pnxmxsswSPuiISj_vr8657XI0TL-7R6ztJ_qAQ"
                    }
                }
                */
                if (e.status === "OK") {
                  const data = e.data;
                  cookies.set("accessToken", data.accessToken, {
                    path: "/",
                    maxAge: data.accessTokenExpires
                  });
                }
                
              })
            }
          })
        }
      })
    } else {
      console.log('Code not found in the URL.');
    }
  }, []);

 
  return (
    <div className="login-container">
      <div className="social-icon-container" onClick={() => handleLoginClick('kakao')}>
        <img src={kakao} alt="Kakao" className="social-icon" />
        <p className="icon-text">Kakao 로그인</p>
      </div>
      <div className="social-icon-container" onClick={() => handleLoginClick('naver')}>
        <img src={naver} alt="Naver" className="social-icon" />
        <p className="icon-text">Naver 로그인</p>
      </div>
      <div className="social-icon-container" onClick={() => handleLoginClick('google')}>
        <img src={google} alt="Google" className="social-icon" />
        <p className="icon-text">Google 로그인</p>
      </div>
    </div>
  );
}

export default Login;