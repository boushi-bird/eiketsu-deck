declare const BASE_DATA_URL: string;
declare const BASE_DATA_KABUKI_URL: string;

// CSSファイルのサイドエフェクトインポート用型宣言（TS6.0のTS2882エラー対応）
declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}
