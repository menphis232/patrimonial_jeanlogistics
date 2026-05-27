import { HttpParameterCodec } from '@angular/common/http';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key).replace(/%5B/gi, '[').replace(/%5D/gi, ']');
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value).replace(/%2C/gi, ',');
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
