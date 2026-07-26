import css from 'styled-jsx/css';

export default css`
  #modal {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4;
  }
  .card {
    width: 335px;
    box-shadow: none;
    padding: 60px 12px 30px 12px;
    position: relative;
    justify-content: flex-start;
  }
  .modal-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 322px;
    position: relative;
    border-radius: 16px;
  }
  .close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 14px;
  }
  .list-container {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
    max-width: 245px;
    position: relative;
  }
  .background-image {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  @media only screen and (max-width: 576px) {
    .modal-card {
      min-width: 0px;
      max-width: 321px;
    }
    .card {
      width: 321px;
    }
  }
  @media only screen and (max-width: 320px) {
    .card {
      width: 321px;
      overflow: scroll;
      padding: 60px 12px 20px 12px;
    }
    .main-wrapper {
      position: relative;
      bottom: 0px;
    }
  }
`;
