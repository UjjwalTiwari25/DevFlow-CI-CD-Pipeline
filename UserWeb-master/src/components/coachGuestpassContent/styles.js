import css from 'styled-jsx/css';

export default css`
  .content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .values {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
    padding: 24px 24px 24px 24px;
    background-color: #000;
    background-image:
      linear-gradient (#0003, #0003),
      url('/static/images/natureImage.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover, cover;
  }
  .mt100 {
    margin-top: 100px;
  }
  .icons {
    display: flex;
    justify-content: space-around;
    width: 100vw;
    margin-top: 82px;
  }
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .aura-card {
    min-width: 274px;
    background-image: url('/static/images/webBackground.jpg');
    background-color: rgb(255, 255, 255);
    border-radius: 9.54px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 200px;
    box-shadow: 0px 21px 34px 0px rgba(0, 0, 0, 0.25);
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .btn-secondary {
    background: rgb(221, 221, 221);
    border-radius: 32px;
    min-height: 32px;
    margin: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  .avatar {
    vertical-align: middle;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 4px 14px 22px -4px rgba(0, 0, 0, 0.25);
    margin-top: 42;
    object-fit: cover;
  }
  .pb70 {
    padding-bottom: 70px;
  }
  .pt-last-div {
    padding-top: 68px;
  }
  .pt-firts-div {
    padding-top: 92px;
  }
  .horizontal-scroll {
    margin-left: 14px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
  }
  .disable-scrollbars::-webkit-scrollbar {
    display: none;
    background: transparent; /* Chrome/Safari/Webkit */
  }

  .disable-scrollbars {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .images {
    width: 100vw;
  }
  .follow-on-aura {
    padding-top: 68px;
    padding-bottom: 70px;
  }
  .aura-values {
    padding-top: 84px;
    background: rgb(255, 255, 255);
  }
  .aura-values-background {
    background-image: url('/static/images/rainbowDesktop.png');
    background-color: rgb(255, 255, 255);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    justify-content: center;
    flex-direction: column;
    display: flex;
    align-items: center;
    padding-bottom: 70px;
  }
  .last-section-background {
    background: rgb(255, 255, 255);
  }
  @media only screen and (max-width: 1024px) {
    .horizontal-scroll {
      justify-content: center;
    }
  }
  @media only screen and (max-width: 768px) {
    .horizontal-scroll {
      justify-content: center;
    }
  }
  @media only screen and (max-width: 600px) {
    .aura-values-background {
      background-image: url('/static/images/rainbowMobile.png');
    }
    .aura-values {
      padding-top: 44px;
    }
    .last-section-background {
      padding-bottom: 70px;
    }
    .follow-on-aura {
      padding-top: 34px;
      padding-bottom: 0px;
    }
    .horizontal-scroll {
      width: 84vw;
      margin-left: 0px;
      margin-bottom: 0px;
      justify-content: flex-start;
      overflow-x: scroll;
    }
    .pt-firts-div {
      padding-top: 42px;
    }
    .pt-last-div {
      padding-top: 58px;
    }
    .pb70 {
      padding-bottom: 0px;
    }
    .pd46 {
      padding: 0px 46px;
    }
    .border {
      border: 1px solid rgb(0, 0, 0, 0);
    }
    .side-padding {
      padding-left: 46px;
      padding-right: 46px;
    }
    .values {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .section-no-padding {
      padding-top: 0px;
    }
    .icons {
      display: flex;
      flex-direction: column;
      margin-top: 64px;
    }
    .single-icon-text {
      display: flex;
      justify-content: center;
      padding-bottom: 56px;
    }
    .mt100 {
      margin-top: 0px;
    }
    .avatar {
      margin-top: 0;
    }
  }
`;
export const globalStyles = css.global`
  @media (min-width: 767px) {
    .items-inner-wrapper {
      display: flex;
      justify-content: center;
    }
  }
`;
