import * as fileType from 'file-type';
import * as superagent from 'superagent';

export const validateResponse = (res: superagent.Response, typeInfo: fileType.FileTypeResult | null) => {
  const resIsBuffer = Buffer.isBuffer(res.body);

  if (!resIsBuffer) {
    return false;
  }
  if (!typeInfo || typeInfo.mime !== 'image/jpeg' || !typeInfo.ext) {
    return false;
  }

  return true;
};
