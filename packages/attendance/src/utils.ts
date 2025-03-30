export const command_header = {
  'User-Agent': 'Skland/1.21.0 (com.hypergryph.skland; build:102100065; iOS 17.6.0; ) Alamofire/5.7.1',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
  'Content-Type': 'application/json',
}

export const sign_header = {
  platform: '2',
  timestamp: '',
  dId: '',
  vName: '1.21.0',
}

export function getPrivacyName(name: string) {
  return name.split('')
    .map((s, i) => (i > 0 && i < name.length - 1) ? '*' : s)
    .join('')
}
