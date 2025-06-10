declare module 'jsvectormap' {
  interface VectorMapInstance {
    setFocus?: (params: any) => void;
    updateSize?: () => void;
    destroy?: () => void;
    container?: HTMLElement;
  }

  const jsVectorMap: {
    new (options: any): VectorMapInstance;
  };

  export default jsVectorMap;
}
