declare module 'next-offline/runtime' {
  export function register(swPath?: string, options?: RegistrationOptions): void;
  export function unregister(): void;
}
