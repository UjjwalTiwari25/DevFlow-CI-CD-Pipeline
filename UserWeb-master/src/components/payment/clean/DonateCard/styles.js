import css from 'styled-jsx/css';

export default css`
  .card {
    background: rgba(255, 255, 255, 0.5);
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    display: flex;
    align-items: center;
    padding: 15px;
    backdrop-filter: blur(5px);
    margin-top: 20px;
  }
  .support-others {
    width: 67px;
    height: 67px;
  }
  .padding {
    padding: 20px;
  }
  .low-opacity {
    background: rgba(255, 255, 255, 0.1);
  }
`;
