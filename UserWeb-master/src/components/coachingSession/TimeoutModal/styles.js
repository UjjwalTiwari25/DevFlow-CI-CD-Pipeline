import css from 'styled-jsx/css';

export default css`
  #login-modal {
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
  .container {
    width: 287px;
    height: 235px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 20px 20px 20px 27px;
  }
  .icon {
    width: 40px;
    height: 40px;
  }
`;
