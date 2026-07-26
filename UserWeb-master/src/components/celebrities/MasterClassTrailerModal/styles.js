import css from 'styled-jsx/css';

export default css`
  #masterclass-trailer-modal {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 50px 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .content-container {
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* justify-content: center; */
  }
  .close-icon {
    color: #fff;
    text-align: right;
    right: 10px;
    top: 20px;
    font-size: 20px;
    z-index: 21;
    margin-bottom: 50px;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }
  .video-player {
    width: 100%;
    border-radius: 16px;
  }
  .greg-video-player {
    height: 70vh;
  }
  .video-player-wrapper {
    width: 100%;
    margin-top: 24px;
  }
  .user-info-wrapper {
    display: flex;
    align-items: center;
    gap: 22px;
  }
  .thumbnail-image {
    height: 100%;
    width: 100%;
    border-radius: 16px;
    max-height: 600px;
    object-fit: cover;
    object-position: top;
  }
  .start-trial-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media screen and (max-width: 576px) {
    #masterclass-trailer-modal {
      padding: 50px 20px;
    }
    .close-icon {
      margin-bottom: 30px;
    }
    .user-info-wrapper {
      gap: 11px;
    }
  }
`;
