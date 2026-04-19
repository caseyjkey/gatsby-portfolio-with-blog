declare module 'typewriter-effect/dist/core' {
  type TypewriterOptions = {
    loop?: boolean;
    delay?: number;
    deleteSpeed?: number;
    autoStart?: boolean;
    cursor?: string;
    cursorClassName?: string;
  };

  export default class Typewriter {
    constructor(target: Element | string | null, options?: TypewriterOptions);
    typeString(value: string): this;
    pauseFor(duration: number): this;
    deleteAll(speed?: number): this;
    deleteChars(count: number): this;
    callFunction(callback: () => void): this;
    start(): this;
  }
}
