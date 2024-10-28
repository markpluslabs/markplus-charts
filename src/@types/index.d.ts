import 'elkjs'; // required to extend the module typings

declare module 'elkjs' {
  interface ElkNode {
    properties?: {
      portConstraints: 'FIXED_POS';
    };
  }
}
