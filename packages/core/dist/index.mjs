import process from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { ofetch, createFetch } from 'ofetch';
import { webcrypto } from 'node:crypto';
import { format } from 'date-fns';
import { stringifyQuery } from 'ufo';
import * as mima from 'mima-kit';

var SklandBoard = /* @__PURE__ */ ((SklandBoard2) => {
  SklandBoard2[SklandBoard2["Arknight"] = 1] = "Arknight";
  SklandBoard2[SklandBoard2["Gryphfrontier"] = 2] = "Gryphfrontier";
  SklandBoard2[SklandBoard2["Endfield"] = 3] = "Endfield";
  SklandBoard2[SklandBoard2["Popucom"] = 4] = "Popucom";
  SklandBoard2[SklandBoard2["Neste"] = 100] = "Neste";
  SklandBoard2[SklandBoard2["Coreblazer"] = 101] = "Coreblazer";
  return SklandBoard2;
})(SklandBoard || {});

const SKLAND_AUTH_URL = "https://as.hypergryph.com/user/oauth2/v2/grant";
[SklandBoard.Arknight, SklandBoard.Gryphfrontier, SklandBoard.Endfield, SklandBoard.Popucom, SklandBoard.Neste, SklandBoard.Coreblazer];
({
  [SklandBoard.Arknight]: "\u660E\u65E5\u65B9\u821F",
  [SklandBoard.Gryphfrontier]: "\u6765\u81EA\u661F\u8FB0",
  [SklandBoard.Endfield]: "\u660E\u65E5\u65B9\u821F: \u7EC8\u672B\u5730",
  [SklandBoard.Popucom]: "\u6CE1\u59C6\u6CE1\u59C6",
  [SklandBoard.Neste]: "\u7EB3\u65AF\u7279\u6E2F",
  [SklandBoard.Coreblazer]: "\u5F00\u62D3\u82AF"
});
const SKLAND_SM_CONFIG = {
  organization: "UWXspnCCJN4sfYlNfqps",
  appId: "default",
  publicKey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmxMNr7n8ZeT0tE1R9j/mPixoinPkeM+k4VGIn/s0k7N5rJAfnZ0eMER+QhwFvshzo0LNmeUkpR8uIlU/GEVr8mN28sKmwd2gpygqj0ePnBmOW4v0ZVwbSYK+izkhVFk2V/doLoMbWy6b+UnA8mkjvg0iYWRByfRsK2gdl7llqCwIDAQAB",
  protocol: "https",
  apiHost: "fp-it.portal101.cn",
  apiPath: "/deviceprofile/v4"
};
const DES_RULE = {
  appId: {
    cipher: "DES",
    is_encrypt: 1,
    key: "uy7mzc4h",
    obfuscated_name: "xx"
  },
  box: {
    is_encrypt: 0,
    obfuscated_name: "jf"
  },
  canvas: {
    cipher: "DES",
    is_encrypt: 1,
    key: "snrn887t",
    obfuscated_name: "yk"
  },
  clientSize: {
    cipher: "DES",
    is_encrypt: 1,
    key: "cpmjjgsu",
    obfuscated_name: "zx"
  },
  organization: {
    cipher: "DES",
    is_encrypt: 1,
    key: "78moqjfc",
    obfuscated_name: "dp"
  },
  os: {
    cipher: "DES",
    is_encrypt: 1,
    key: "je6vk6t4",
    obfuscated_name: "pj"
  },
  platform: {
    cipher: "DES",
    is_encrypt: 1,
    key: "pakxhcd2",
    obfuscated_name: "gm"
  },
  plugins: {
    cipher: "DES",
    is_encrypt: 1,
    key: "v51m3pzl",
    obfuscated_name: "kq"
  },
  pmf: {
    cipher: "DES",
    is_encrypt: 1,
    key: "2mdeslu3",
    obfuscated_name: "vw"
  },
  protocol: {
    is_encrypt: 0,
    obfuscated_name: "protocol"
  },
  referer: {
    cipher: "DES",
    is_encrypt: 1,
    key: "y7bmrjlc",
    obfuscated_name: "ab"
  },
  res: {
    cipher: "DES",
    is_encrypt: 1,
    key: "whxqm2a7",
    obfuscated_name: "hf"
  },
  rtype: {
    cipher: "DES",
    is_encrypt: 1,
    key: "x8o2h2bl",
    obfuscated_name: "lo"
  },
  sdkver: {
    cipher: "DES",
    is_encrypt: 1,
    key: "9q3dcxp2",
    obfuscated_name: "sc"
  },
  status: {
    cipher: "DES",
    is_encrypt: 1,
    key: "2jbrxxw4",
    obfuscated_name: "an"
  },
  subVersion: {
    cipher: "DES",
    is_encrypt: 1,
    key: "eo3i2puh",
    obfuscated_name: "ns"
  },
  svm: {
    cipher: "DES",
    is_encrypt: 1,
    key: "fzj3kaeh",
    obfuscated_name: "qr"
  },
  time: {
    cipher: "DES",
    is_encrypt: 1,
    key: "q2t3odsk",
    obfuscated_name: "nb"
  },
  timezone: {
    cipher: "DES",
    is_encrypt: 1,
    key: "1uv05lj5",
    obfuscated_name: "as"
  },
  tn: {
    cipher: "DES",
    is_encrypt: 1,
    key: "x9nzj1bp",
    obfuscated_name: "py"
  },
  trees: {
    cipher: "DES",
    is_encrypt: 1,
    key: "acfs0xo4",
    obfuscated_name: "pi"
  },
  ua: {
    cipher: "DES",
    is_encrypt: 1,
    key: "k92crp1t",
    obfuscated_name: "bj"
  },
  url: {
    cipher: "DES",
    is_encrypt: 1,
    key: "y95hjkoo",
    obfuscated_name: "cf"
  },
  version: {
    is_encrypt: 0,
    obfuscated_name: "version"
  },
  vpw: {
    cipher: "DES",
    is_encrypt: 1,
    key: "r9924ab5",
    obfuscated_name: "ca"
  }
};
const BROWSER_ENV = {
  plugins: "MicrosoftEdgePDFPluginPortableDocumentFormatinternal-pdf-viewer1,MicrosoftEdgePDFViewermhjfbmdgcfjbbpaeojofohoefgiehjai1",
  ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
  canvas: "259ffe69",
  // 基于浏览器的canvas获得的值，不知道复用行不行
  timezone: -480,
  // 时区，应该是固定值吧
  platform: "Win32",
  url: "https://www.skland.com/",
  // 固定值
  referer: "",
  res: "1920_1080_24_1.25",
  // 屏幕宽度_高度_色深_window.devicePixelRatio
  clientSize: "0_0_1080_1920_1920_1080_1920_1080",
  status: "0011"
  // 不知道在干啥
};

const crypto$1 = webcrypto;
async function md5(string) {
  return mima.md5(mima.UTF8(string)).to(mima.HEX);
}
async function hmacSha256(key, data) {
  const hmac256 = mima.hmac(mima.sha256);
  return hmac256(mima.UTF8(key), mima.UTF8(data)).to(mima.HEX);
}
async function encryptAES(message, key) {
  const iv = new TextEncoder().encode("0102030405060708");
  const data = new TextEncoder().encode(message);
  const cryptoKey = await crypto$1.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  const encrypted = await crypto$1.subtle.encrypt(
    {
      name: "AES-CBC",
      iv
    },
    cryptoKey,
    data
  );
  return mima.HEX(new Uint8Array(encrypted));
}
function padData(data) {
  const blockSize = 8;
  const padLength = blockSize - data.length % blockSize;
  return data + "\0".repeat(padLength);
}
async function encryptDES(message, key) {
  const inputStr = padData(String(message));
  const TripleDES = mima.t_des(64);
  const ECBTripleDES = mima.ecb(TripleDES, mima.NO_PAD);
  const cipher = ECBTripleDES(mima.UTF8(key));
  return cipher.encrypt(mima.UTF8(inputStr)).to(mima.B64);
}
async function encryptObjectByDESRules(object, rules) {
  const result = {};
  for (const i in object) {
    if (i in rules) {
      const rule = rules[i];
      if (rule.is_encrypt === 1)
        result[rule.obfuscated_name] = await encryptDES(object[i], rule.key);
      else
        result[rule.obfuscated_name] = object[i];
    } else {
      result[i] = object[i];
    }
  }
  return result;
}
async function extractJWKFromPEM(publicKeyPEM) {
  const pemContents = publicKeyPEM.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/\s/g, "");
  const binaryDer = atob(pemContents);
  const derBuffer = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    derBuffer[i] = binaryDer.charCodeAt(i);
  }
  const cryptoKey = await crypto$1.subtle.importKey(
    "spki",
    derBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
  const jwk = await crypto$1.subtle.exportKey("jwk", cryptoKey);
  return {
    n: base64URLToBigInt(jwk.n),
    e: base64URLToBigInt(jwk.e)
  };
}
function base64URLToBigInt(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64url.length / 4) * 4, "=");
  const binaryStr = atob(base64);
  let result = 0n;
  for (let i = 0; i < binaryStr.length; i++) {
    result = result << 8n | BigInt(binaryStr.charCodeAt(i));
  }
  return result;
}
async function encryptRSA(message, publicKey) {
  const { n, e } = await extractJWKFromPEM(publicKey);
  const key = mima.rsa({ n, e });
  const cliper = mima.pkcs1_es_1_5(key);
  const encrypted = cliper.encrypt(mima.UTF8(message)).to(mima.B64);
  return encrypted;
}

const crypto = webcrypto;
const command_header = {
  "User-Agent": "Skland/1.21.0 (com.hypergryph.skland; build:102100065; iOS 17.6.0; ) Alamofire/5.7.1",
  "Accept-Encoding": "gzip",
  "Connection": "close",
  "Content-Type": "application/json"
};
const MILLISECOND_PER_SECOND = 1e3;
function getRequestURL(request, baseURL) {
  const url = typeof request === "string" ? request : request.url;
  if (URL.canParse(url))
    return new URL(url);
  return new URL(url, baseURL);
}
const WHITE_LIST = ["/web/v1/user/auth/generate_cred_by_code"];
async function onSignatureRequest(ctx) {
  const { pathname } = getRequestURL(ctx.request, ctx.options.baseURL);
  if (WHITE_LIST.includes(pathname))
    return;
  const headers = new Headers(ctx.options.headers);
  const token = headers.get("token");
  if (!token)
    throw new Error("token \u4E0D\u5B58\u5728");
  const query = ctx.options.query ? stringifyQuery(ctx.options.query) : "";
  const timestamp = (Date.now() - 2 * MILLISECOND_PER_SECOND).toString().slice(0, -3);
  const signatureHeaders = {
    platform: "1",
    timestamp,
    dId: "",
    vName: "1.21.0"
  };
  const str = `${pathname}${query}${ctx.options.body ? JSON.stringify(ctx.options.body) : ""}${timestamp}${JSON.stringify(signatureHeaders)}`;
  const hmacSha256ed = await hmacSha256(token, str);
  const sign = await md5(hmacSha256ed);
  Object.entries(signatureHeaders).forEach(([key, value]) => {
    headers.append(key, value);
  });
  headers.append("sign", sign);
  headers.delete("token");
  ctx.options.headers = headers;
}
const stringify = (obj) => JSON.stringify(obj).replace(/":"/g, '": "').replace(/","/g, '", "');
async function gzipObject(o) {
  const encoded = new TextEncoder().encode(stringify(o));
  const compressed = await new Response(
    new Blob([encoded]).stream().pipeThrough(new CompressionStream("gzip"))
  ).arrayBuffer();
  const compressedArray = new Uint8Array(compressed);
  compressedArray[9] = 19;
  return btoa(String.fromCharCode(...compressedArray));
}
async function getSmId() {
  const now = /* @__PURE__ */ new Date();
  const _time = format(now, "yyyyMMddHHmmss");
  const uid = crypto.randomUUID();
  const uidMd5 = md5(uid);
  const v = `${_time + uidMd5}00`;
  const smsk_web = (await md5(`smsk_web_${v}`)).substring(0, 14);
  return `${v + smsk_web}0`;
}
function getTn(o) {
  const sortedKeys = Object.keys(o).sort();
  const resultList = [];
  for (const key of sortedKeys) {
    let v = o[key];
    if (typeof v === "number")
      v = String(v * 1e4);
    else if (typeof v === "object" && v !== null)
      v = getTn(v);
    resultList.push(v);
  }
  return resultList.join("");
}
const SM_CONFIG = SKLAND_SM_CONFIG;
const devices_info_url = `${SKLAND_SM_CONFIG.protocol}://${SKLAND_SM_CONFIG.apiHost}${SKLAND_SM_CONFIG.apiPath}`;
async function getDid() {
  const uid = crypto.randomUUID();
  const priId = (await md5(uid)).substring(0, 16);
  const ep = await encryptRSA(uid, SM_CONFIG.publicKey);
  const browser = {
    ...BROWSER_ENV,
    vpw: crypto.randomUUID(),
    svm: Date.now(),
    trees: crypto.randomUUID(),
    pmf: Date.now()
  };
  const desTarget = {
    ...browser,
    protocol: 102,
    organization: SM_CONFIG.organization,
    appId: SM_CONFIG.appId,
    os: "web",
    version: "3.0.0",
    sdkver: "3.0.0",
    box: "",
    // 首次请求为空
    rtype: "all",
    smid: await getSmId(),
    subVersion: "1.0.0",
    time: 0
  };
  desTarget.tn = await md5(getTn(desTarget));
  const desResult = await encryptObjectByDESRules(desTarget, DES_RULE);
  const gzipResult = await gzipObject(desResult);
  const aesResult = await encryptAES(gzipResult, priId);
  const body = {
    appId: "default",
    compress: 2,
    data: aesResult,
    encode: 5,
    ep,
    organization: SM_CONFIG.organization,
    os: "web"
  };
  const response = await fetch(devices_info_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const resp = await response.json();
  if (resp.code !== 1100) {
    console.log(resp);
    throw new Error("did\u8BA1\u7B97\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u4F5C\u8005");
  }
  return `B${resp.detail.deviceId}`;
}

async function auth(token) {
  const data = await ofetch(SKLAND_AUTH_URL, {
    method: "POST",
    headers: command_header,
    body: JSON.stringify({
      appCode: "4ca99fa6b56cc2ba",
      token,
      type: 0
    })
  });
  if (data.status !== 0 || !data.data)
    throw new Error(`\u767B\u5F55\u83B7\u53D6 cred \u9519\u8BEF:${data.msg}`);
  return data.data;
}

const fetch$1 = createFetch({
  defaults: {
    baseURL: "https://zonai.skland.com",
    onRequest: onSignatureRequest
  }
});
async function signIn(grant_code) {
  const data = await fetch$1(
    "/web/v1/user/auth/generate_cred_by_code",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        "referer": "https://www.skland.com/",
        "origin": "https://www.skland.com",
        "dId": await getDid(),
        "platform": "3",
        "timestamp": `${Math.floor(Date.now() / 1e3)}`,
        "vName": "1.0.0"
      },
      body: {
        code: grant_code,
        kind: 1
      },
      onRequestError(ctx) {
        throw new Error(`\u767B\u5F55\u83B7\u53D6 cred \u9519\u8BEF:${ctx.error.message}`);
      }
    }
  );
  return data.data;
}
async function getBinding(cred, token) {
  const data = await fetch$1(
    "/api/v1/game/player/binding",
    {
      headers: { token, cred },
      onRequestError(ctx) {
        throw new Error(`\u83B7\u53D6\u7ED1\u5B9A\u89D2\u8272\u9519\u8BEF:${ctx.error.message}`);
      }
    }
  );
  return data.data;
}
async function attendance(cred, token, body) {
  const record = await fetch$1(
    "/api/v1/game/attendance",
    {
      headers: Object.assign({ token, cred }, command_header),
      query: body
    }
  );
  const todayAttended = record.data.records.find((i) => {
    const today = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
    return new Date(Number(i.ts) * 1e3).setHours(0, 0, 0, 0) === today;
  });
  if (todayAttended) {
    return false;
  } else {
    const data = await fetch$1(
      "/api/v1/game/attendance",
      {
        method: "POST",
        headers: Object.assign({ token, cred }, command_header),
        body
      }
    );
    return data;
  }
}

async function bark(url, title, content) {
  if (typeof url !== "string" || !url.startsWith("https://")) {
    console.error("Wrong type for Bark URL.");
    return -1;
  }
  const payload = {
    title,
    body: content,
    group: "Skland"
  };
  try {
    const resp = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const data = await resp.json();
    console.debug(data);
  } catch (error) {
    console.error(`[Bark] Error: ${error}`);
    return -1;
  }
}

async function serverChan(sendkey, title, content) {
  if (typeof sendkey !== "string") {
    console.error("Wrong type for serverChan token.");
    return -1;
  }
  const payload = {
    title,
    desp: content
  };
  try {
    const resp = await fetch(
      `https://sctapi.ftqq.com/${sendkey}.send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const data = await resp.json();
    if (data.code === 0) {
      console.log("[ServerChan] Send message to ServerChan successfully.");
      return 0;
    } else {
      console.log(`[ServerChan][Send Message Response] ${data}`);
      return -1;
    }
  } catch (error) {
    console.error(`[ServerChan] Error: ${error}`);
    return -1;
  }
}

async function messagePusher(url, title, content) {
  if (typeof url !== "string" || !url.startsWith("https://")) {
    console.error("Wrong type for MessagePusher URL.");
    return -1;
  }
  const payload = {
    title,
    content,
    description: content
  };
  try {
    const resp = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const data = await resp.json();
    console.debug(data);
  } catch (error) {
    console.error(`[MessagePusher] Error: ${error}`);
    return -1;
  }
}

async function doAttendanceForAccount(token, options) {
  const { code } = await auth(token);
  const { cred, token: signToken } = await signIn(code);
  const { list } = await getBinding(cred, signToken);
  const createCombinePushMessage = () => {
    const messages = [];
    let hasError = false;
    const logger = (message, error) => {
      messages.push(message);
      console[error ? "error" : "log"](message);
      if (error && !hasError)
        hasError = true;
    };
    const push = async () => {
      if (options.withServerChan) {
        await serverChan(
          options.withServerChan,
          `\u3010\u68EE\u7A7A\u5C9B\u6BCF\u65E5\u7B7E\u5230\u3011`,
          messages.join("\n\n")
        );
      }
      if (options.withBark) {
        await bark(
          options.withBark,
          `\u3010\u68EE\u7A7A\u5C9B\u6BCF\u65E5\u7B7E\u5230\u3011`,
          messages.join("\n\n")
        );
      }
      if (options.withMessagePusher) {
        await messagePusher(
          options.withMessagePusher,
          `\u3010\u68EE\u7A7A\u5C9B\u6BCF\u65E5\u7B7E\u5230\u3011`,
          messages.join("\n\n")
        );
      }
      if (hasError)
        process.exit(1);
    };
    const add = (message) => {
      messages.push(message);
    };
    return [logger, push, add];
  };
  const [combineMessage, excutePushMessage, addMessage] = createCombinePushMessage();
  addMessage("## \u660E\u65E5\u65B9\u821F\u7B7E\u5230");
  let successAttendance = 0;
  const characterList = list.map((i) => i.bindingList).flat();
  const maxRetries = parseInt(process.env.MAX_RETRIES, 10) || 3;
  await Promise.all(characterList.map(async (character) => {
    console.log(`\u5C06\u7B7E\u5230\u7B2C${successAttendance + 1}\u4E2A\u89D2\u8272`);
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const data = await attendance(cred, signToken, {
          uid: character.uid,
          gameId: character.channelMasterId
        });
        if (data) {
          if (data.code === 0 && data.message === "OK") {
            const msg = `${Number(character.channelMasterId) - 1 ? "B \u670D" : "\u5B98\u670D"}\u89D2\u8272 ${successAttendance + 1} \u7B7E\u5230\u6210\u529F${`, \u83B7\u5F97\u4E86${data.data.awards.map((a) => `\u300C${a.resource.name}\u300D${a.count}\u4E2A`).join(",")}`}`;
            combineMessage(msg);
            successAttendance++;
            break;
          } else {
            const msg = `${Number(character.channelMasterId) - 1 ? "B \u670D" : "\u5B98\u670D"}\u89D2\u8272 ${successAttendance + 1} \u7B7E\u5230\u5931\u8D25${`, \u9519\u8BEF\u6D88\u606F: ${data.message}

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``}`;
            combineMessage(msg, true);
            retries++;
          }
        } else {
          combineMessage(`${Number(character.channelMasterId) - 1 ? "B \u670D" : "\u5B98\u670D"}\u89D2\u8272 ${successAttendance + 1} \u4ECA\u5929\u5DF2\u7ECF\u7B7E\u5230\u8FC7\u4E86`);
          break;
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          combineMessage(`${Number(character.channelMasterId) - 1 ? "B \u670D" : "\u5B98\u670D"}\u89D2\u8272 ${successAttendance + 1} \u4ECA\u5929\u5DF2\u7ECF\u7B7E\u5230\u8FC7\u4E86`);
          break;
        } else {
          combineMessage(`\u7B7E\u5230\u8FC7\u7A0B\u4E2D\u51FA\u73B0\u672A\u77E5\u9519\u8BEF: ${error.message}`, true);
          console.error("\u53D1\u751F\u672A\u77E5\u9519\u8BEF\uFF0C\u5DE5\u4F5C\u6D41\u7EC8\u6B62\u3002");
          retries++;
          if (retries >= maxRetries) {
            process.exit(1);
          }
        }
      }
      await setTimeout(3e3);
    }
  }));
  if (successAttendance !== 0)
    combineMessage(`\u6210\u529F\u7B7E\u5230${successAttendance}\u4E2A\u89D2\u8272`);
  await excutePushMessage();
}

export { doAttendanceForAccount };
