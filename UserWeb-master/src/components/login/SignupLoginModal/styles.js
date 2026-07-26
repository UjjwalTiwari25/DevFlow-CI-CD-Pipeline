import css from 'styled-jsx/css';

export default css`
  #modal {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 16px;
    justify-content: center;
    display: flex;
    align-items: center;
    padding: 4;
  }
  .close-icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .modal-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 321px;
    position: relative;
    border-radius: 16px;
  }
  .close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 14px;
  }
  @media only screen and (max-width: 576px) {
    .modal-card {
      min-width: 0px;
      max-width: 321px;
    }
  }
`;
