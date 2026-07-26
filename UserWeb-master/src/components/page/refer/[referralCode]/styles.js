import css from 'styled-jsx/css';

export default css`
  .guest-pass-card {
    max-width: 296px;
    background: rgb(255, 255, 255);
    border-radius: 10.01px;
    height: 180px;
    box-shadow: 0px 22px 36px 0px rgba(0, 0, 0, 0.1);
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 24px 24px 150px 24px;
    background-image:
      linear-gradient (#0003, #0003),
      url('/static/images/heroImage.jpeg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: opacity 200ms ease;
  }
  #best-of-apple {
    width: 240px;
    object-fit: contain;
    margin: 12px 0px;
  }
  @media (max-width: 1024px) {
    .page-content {
      height: 600px;
    }
    .page-content-new-guestpass {
      height: 600px;
    }
  }
  @media (max-width: 576px) {
    #best-of-apple {
      width: 156px;
    }
    .page-content {
      height: 100vh;
    }
    .page-content-new-guestpass {
      height: 100vh;
    }
  }
  @media (max-width: 414px) {
    .page-content {
      padding: 24px 24px 80px 24px;
      height: 93vh;
    }
    .page-content-new-guestpass {
      padding: 70px 24px 80px 24px;
      height: 93vh;
    }
  }
  @media (max-width: 375px) {
    .page-content {
      padding: 24px 24px 80px 24px;
      height: 92vh;
    }
    .page-content-new-guestpass {
      padding: 70px 24px 60px 24px;
      height: 92vh;
    }
  }
  @media (max-width: 320px) {
    .guest-pass-card {
      height: 154px;
      width: 250px;
    }
    .page-content {
      padding: 24px 14px;
      height: 100vh;
    }
    .page-content-new-guestpass {
      padding: 38px 14px 50px 14px;
      height: 92vh;
    }
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
      .page-content {
        padding: 24px 24px 80px 24px;
        height: 100vh;
      }
      .page-content-new-guestpass {
        padding: 70px 24px 40px 24px;
        height: 85vh;
      }
    }
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      .page-content {
        padding: 24px 24px 80px 24px;
        height: 100vh;
      }
      .page-content-new-guestpass {
        padding: 10px 24px 30px 24px;
        height: 79vh;
      }
    }
  }
`;
