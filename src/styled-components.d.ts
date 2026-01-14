import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    white: string;
    black: string;
    primaryColor: string;
  }

  // Enable transient props for styled-components v6+
  export interface StyledComponentInterface {
    attrs: <A>(attrs: A) => any;
  }
}
