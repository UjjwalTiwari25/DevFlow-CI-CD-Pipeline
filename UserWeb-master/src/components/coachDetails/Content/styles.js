import css from 'styled-jsx/css';

export default css`
  .main {
    margin-top: 58px;
    margin-bottom: 40px;
  }
  .main-low-margin {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .dropdown {
    margin-top: 24px;
  }
  .selection-container {
    background: #ffffff;
    box-shadow: 0px 4px 20px rgba(43, 42, 107, 0.15);
    border-radius: 8px;
    padding: 10px;
    margin-right: 13px;
  }
  .custom-tracks {
    max-width: 908px;
    display: flex;
    align-items: center;
  }
  .track-row-height {
    height: 290px;
    margin-top: 42px;
  }
  @media screen and (max-width: 1024px) {
    .custom-tracks {
      max-width: 91vw;
    }
  }
  @media screen and (max-width: 576px) {
    .main {
      margin-top: 0px;
      margin-bottom: 40px;
      padding-left: 28px;
    }
    .track-row-height {
      align-items: flex-start;
      margin-top: 22px;
      width: 100%;
    }
    .heading {
      display: none;
    }
    .main-low-margin {
      padding-left: 0px;
    }
  }
`;
