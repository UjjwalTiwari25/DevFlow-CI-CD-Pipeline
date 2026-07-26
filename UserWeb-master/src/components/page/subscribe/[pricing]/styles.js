import css from 'styled-jsx/css';

export const closeButtonStyles = css`
  .close-button {
    font-size: 24px;
    position: absolute;
    right: 6px;
    top: 6px;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .light-button {
    color: black;
    background-color: white;
  }
  .gray-button {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export default css`
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
  }
`;
