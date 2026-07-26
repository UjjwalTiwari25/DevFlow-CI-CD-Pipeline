import css from 'styled-jsx/css';

export default css`
  #waitlist-modal {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .modal-container-light {
    max-width: 335px;
    background: #f7fbfc;
    border-radius: 16px;
    padding: 20px 20px 40px 32px;
    position: relative;
  }
  .modal-background {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
  }
  .modal-content {
    z-index: 2;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .close-icon {
    right: 0px;
    top: 0px;
    font-size: 24px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute;
  }
  .close {
    width: 16px;
    height: 16px;
    filter: invert(1);
  }
  .modalbackground {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0px;
  }
  .coach-photo {
    width: 102px;
    height: 102px;
    border-radius: 50%;
    margin-top: 50px;
  }
  .check {
    position: absolute;
    width: 68px;
    height: 68px;
    right: -21px;
    bottom: -21px;
  }
`;
