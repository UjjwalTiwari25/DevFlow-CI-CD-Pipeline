import css from 'styled-jsx/css';

const fontFamily = 'Proxima';

export default css.global`
  @font-face {
    font-family: ${fontFamily};
    src: url('/static/fonts/ProximaNova-light.otf');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: ${fontFamily};
    src: url('/static/fonts/ProximaNova-Regular.otf');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: ${fontFamily};
    src: url('/static/fonts/ProximaNova-Medium.otf');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: ${fontFamily};
    src: url('/static/fonts/ProximaNova-Semibold.otf');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: ${fontFamily};
    src: url('/static/fonts/ProximaNova-Bold.otf');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  .font {
    background-color: transparent;
  }
  .custom-font {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: ${fontFamily} !important;
  }
  .h1 {
    font-family: ${fontFamily};
    line-height: 52px;
    font-size: 40px;
    font-weight: 500;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h1-large {
    font-family: ${fontFamily};
    line-height: 52px;
    font-size: 44px;
    font-weight: 500;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h2 {
    font-family: ${fontFamily};
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
  }
  .h2-small {
    line-height: 34px;
    font-size: 28px;
    font-weight: 400;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h2-smaller {
    line-height: 34px;
    font-size: 26px;
    font-weight: 600;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h3 {
    line-height: 29px;
    font-size: 24px;
    font-weight: 400;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h3-large {
    font-family: ${fontFamily};
    line-height: 34px;
    font-size: 24px;
    font-weight: 500;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h3-small {
    font-family: ${fontFamily};
    line-height: 27px;
    font-size: 22px;
    font-weight: 400;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h4 {
    font-family: ${fontFamily};
    line-height: 24px;
    font-size: 18px;
    font-weight: 500;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .h4-large {
    font-family: ${fontFamily};
    line-height: 34px;
    font-size: 20px;
    font-weight: 500;
    text-shadow: 0px 0px 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .cta {
    line-height: 22px;
    font-size: 18px;
    font-weight: 400;
  }
  .body {
    line-height: 24px;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
  }
  .body2 {
    line-height: 14px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
  }
  .body3 {
    line-height: 17px;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
  }
  .subtitle {
    line-height: 19px;
    font-size: 16px;
    font-weight: 400;
  }
  .footnote {
    line-height: 14px;
    font-size: 12px;
    font-weight: 400;
  }
  .footnote-small {
    line-height: 13px;
    font-size: 10px;
    font-weight: 400;
  }
  .font.w100 {
    color: rgba(255, 255, 255, 1);
  }
  .font.w80 {
    color: rgba(255, 255, 255, 0.8);
  }
  .font.w76 {
    color: rgba(255, 255, 255, 0.76);
  }
  .font.w70 {
    color: rgba(255, 255, 255, 0.7);
  }
  .font.w64 {
    color: rgba(255, 255, 255, 0.64);
  }
  .font.w40 {
    color: rgba(255, 255, 255, 0.4);
  }
  .font.w24 {
    color: rgba(255, 255, 255, 0.24);
  }
  .font.cta-blue {
    color: rgba(2, 207, 242, 1);
  }
  .font.sb {
    color: rgb(204, 204, 204);
  }
  .font.sm {
    color: rgb(122, 122, 122);
  }
  .font.sd {
    color: rgb(64, 64, 64);
  }
  .font.b100 {
    color: rgba(47, 50, 55, 1);
  }
  .font.b80 {
    color: rgba(47, 50, 55, 0.8);
  }
  .font.b70 {
    color: rgba(47, 50, 55, 0.7);
  }
  .font.b64 {
    color: rgba(47, 50, 55, 0.64);
  }
  .font.b40 {
    color: rgba(47, 50, 55, 0.4);
  }
  .font.b24 {
    color: rgba(47, 50, 55, 0.24);
  }
  .font.g100 {
    color: rgba(78, 84, 95, 1);
  }
  .font.g50 {
    color: rgba(78, 84, 95, 0.5);
  }
  .font.g64 {
    color: #9092a3;
  }
  .font.thin {
    font-weight: 100;
  }
  .font.ultraLight {
    font-weight: 200;
  }
  .font.light {
    font-weight: 300;
  }
  .font.regular {
    font-weight: 400;
  }
  .font.medium {
    font-weight: 500;
  }
  .font.semibold {
    font-weight: 600;
  }
  .font.bold {
    font-weight: 700;
  }
  .font.heavy {
    font-weight: 800;
  }
  .font.black {
    font-weight: 900;
  }
  .font.center {
    text-align: center;
  }
  .font.left {
    text-align: left;
  }
  .font.right {
    text-align: right;
  }
`;
