import { Transform } from "stream";

/**
 * Represents a Koa server side event
 *
 * @export
 * @interface IKoaSSEvent
 */
export interface IKoaSSEvent {
  id?: number;
  data?: string | object;
  event?: string;
}

/**
 * Represents a Koa Server Side Event instance
 *
 * @export
 * @interface IKoaSSE
 */
export interface IKoaSSE extends Transform {
  send(data: IKoaSSEvent | string): void;
  keepAlive(): void;
  close(): void;
}

/**
 * Represents KoaSSE middleware options
 *
 * @export
 * @interface IKoaSSEOptions
 */
export interface IKoaSSEOptions {
  pingInterval?: number;
  closeEvent?: string;
}
