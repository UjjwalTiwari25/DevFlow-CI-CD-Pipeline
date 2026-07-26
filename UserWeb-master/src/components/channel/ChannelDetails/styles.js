import css from 'styled-jsx/css';

export default css`
  .author-image {
    margin-top: 20px;
    margin-bottom: 26px;
  }
  .author-photo {
    display: flex;
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 24px;
    margin-right: 16px;
    position: relative;
    overflow: hidden;
  }
  .outer-wrap {
    display: inline-flex;
    margin-top: 50px;
    padding: 40px;
  }
  .channel-cover {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 26px;
  }
  .track-width {
    padding: 40px;
  }
  @media screen and (max-width: 768px) and (min-width: 767px) {
    .outer-wrap {
      padding: 38px;
    }
    .track-width {
      padding: 38px;
    }
  }
  @media (max-width: 767px) {
    .track-width {
      width: 100%;
      padding: 20px 16px 40px 16px;
    }
    .outer-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      margin-top: 34px;
      padding: 20px 16px;
    }
    .channel-cover {
      padding-left: 0px;
      margin-top: 20px;
      align-items: center;
    }
    .author-image {
      margin-bottom: 10px;
    }
  }
`;
