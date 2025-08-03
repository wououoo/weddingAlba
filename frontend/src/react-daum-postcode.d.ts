declare module 'react-daum-postcode' {
  import * as React from 'react';
  
  export interface DaumPostcodeProps {
    onComplete: (data: any) => void;
    width?: number | string;
    height?: number | string;
    autoClose?: boolean;
    autoResize?: boolean;
    animation?: boolean;
    style?: React.CSSProperties;
    scriptUrl?: string;
    errorMessage?: React.ReactNode;
    defaultQuery?: string;
    theme?: any;
    useSuggest?: boolean;
    maxSuggestItems?: number;
    className?: string;
  }
  
  export default class DaumPostcode extends React.Component<DaumPostcodeProps> {}
}