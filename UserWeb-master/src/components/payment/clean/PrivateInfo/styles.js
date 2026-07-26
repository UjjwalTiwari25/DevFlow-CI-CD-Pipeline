import css from 'styled-jsx/css';

export default css`
  .card {
    background: #fff;
    background-size: cover;
    border: none;
    border-radius: 6px;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    backdrop-filter: blur(5px);
    margin-top: 20px;
  }
  .support-others {
    width: 24px;
    height: 24px;
  }
  .padding {
    padding: 20px;
  }
  .lock {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 10px 50px rgba(43, 42, 107, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
  }
`;
