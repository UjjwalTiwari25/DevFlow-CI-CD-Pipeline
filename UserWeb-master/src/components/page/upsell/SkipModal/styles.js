import css from 'styled-jsx/css';

export default css`
  #coach-modal {
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
  }
  .modal-container {
    background: #f7fbfc;
    border-radius: 16px;
    min-width: 335px;
  }
  .button-container {
    margin-top: 33px;
  }
  .button {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.2);
    border-radius: 99px;
    width: 125px;
    height: 56px;
    margin-bottom: 27px;
  }
  .button-margin {
    margin-right: 20px;
  }
  @media screen and (max-width: 576px) {
    .modal-container {
      min-width: 100%;
    }
  }
`;
