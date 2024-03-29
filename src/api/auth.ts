import { Cookies } from "react-cookie";
import * as AxiosUtil from "../lib/AxiosUtil";

const cookies = new Cookies();
const backendUrl = "/backend";

let email = "";
let name = "";

function setUserInfo(user: any) {
  email = user.email;
  name = user.name;
}

async function getUserInfo() {
  const response = await AxiosUtil.send("GET", `${backendUrl}/users`, {}, "");
  if (response) {
    setUserInfo(response);
  } else {
    cookies.remove("access_token");
  }
}

async function reissue() {
  const response = await AxiosUtil.send(
    "POST",
    `${backendUrl}/users/reissue`,
    {},
    ""
  );

  if (response) {
    setUserInfo(response);
    cookies.set("refresh_token", response.refreshToken, {
      path: "/",
      httpOnly: true
    });
    cookies.set("access_token", response.accessToken, {
      path: "/"
    });
    cookies.set("authorization", true, {
      path: "/",
      maxAge: 3600
    });
  } else {
    cookies.remove("authorization");
  }
}

export async function authInit(): Promise<boolean> {
  if (cookies.get("access_token") && cookies.get("authorization")) {
    await getUserInfo();
  } else if (cookies.get("access_token") && !cookies.get("authorization")) {
    await reissue();
  } else {
    return false;
  }
  return true;
}

export async function checkUserAuthentication(): Promise<boolean> {
  return await authInit();
}

export async function getName(): Promise<string> {
  await authInit();
  return name;
}

export async function getEmail(): Promise<string> {
  await authInit();
  return email;
}
