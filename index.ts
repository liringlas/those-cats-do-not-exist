import { get, Response } from 'superagent';
import { join } from 'path';
import * as fileType from 'file-type';
import { ensureDir, writeFile } from 'fs-extra';

const URL = 'https://thiscatdoesnotexist.com/';
const INTERVAL = 1024;

const isValid = (res: Response, typeInfo: fileType.FileTypeResult | null) => {
  if (!Buffer.isBuffer(res.body)) {
    return false;
  }
  if (!typeInfo || typeInfo.mime !== 'image/jpeg' || !typeInfo.ext) {
    return false;
  }
  return true;
};

const run = async (url: string, interval: number) => {
  let previousBuffer: Buffer;
  await ensureDir(join(__dirname, 'cats'));

  setInterval(() => {
    get(url).then((res: Response) => {
      const typeInfo = fileType(res.body);
      if (!typeInfo || !isValid(res, typeInfo)) {
        return;
      }
      if (Buffer.isBuffer(previousBuffer) && previousBuffer.equals(res.body)) {
        return;
      }
      previousBuffer = res.body;
      writeFile(join(__dirname, 'cats', `${Date.now()}.${typeInfo.ext}`), res.body);
    });
  }, interval);
};

run(URL, INTERVAL);
