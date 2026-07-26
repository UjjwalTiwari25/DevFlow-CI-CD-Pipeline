import css from 'styled-jsx/css';

export default css.global`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }
  .clickable {
    cursor: pointer;
    text-decoration: none;
  }
  .clickable:hover {
    opacity: 0.8;
  }
  .grabbable:hover {
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  .grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }
  .no-select {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .content-padding {
    padding: 26px;
  }
  .content-padding-clean {
    padding: 18px; /* 32px in v1*/
    padding-bottom: 0; /* not added in v1 */
  }
  .background {
    background-image: url(/static/images/background-gradient-1.png);
    min-height: 272px;
    border-radius: 52px;
    position: absolute;
    z-index: -1;
    min-width: 280px;
    -webkit-backdrop-filter: blur(60px);
    backdrop-filter: blur(60px);
    filter: blur(60px);
    opacity: 0.3;
    left: 50%;
    transform: translate(-50%, 0%) rotate(-180deg);
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const componentStyles = css`
  #bar {
    background: #03a9f4;
    height: 4px;
    left: 0;
    position: fixed;
    top: 0;
    z-index: 4;
    width: 100%;
    animation-name: progressBar;
    animation-duration: 6s;
  }
  .dark-background {
    background-color: #18242b;
    min-height: 100vh;
    width: 100%;
  }
  .new-background {
    min-height: 100vh;
    width: 100%;
  }
  .darkmodebackground {
    position: fixed;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .newdarkbackground {
    position: fixed;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .light-effect-background {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .background-series {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .darkmodebackground-star {
    position: fixed;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @keyframes progressBar {
    from {
      width: 0%;
    }
    to {
      width: 96%;
    }
  }
  @media screen and (max-width: 576px) {
    .newdarkbackground {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
  }
`;
