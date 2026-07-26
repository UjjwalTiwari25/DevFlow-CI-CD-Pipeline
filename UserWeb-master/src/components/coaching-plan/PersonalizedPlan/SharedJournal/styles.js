import css from 'styled-jsx/css';

export default css`
  .container {
    margin-top: 70px;
  }
  .shared-journal {
    background:
      linear-gradient (0deg, #ffffff, #ffffff),
      linear-gradient(
        90deg,
        #fff4fd 0.81%,
        #f4f5ff 28.06%,
        #ecf8ff 69%,
        #eefffc 100%
      );
    box-shadow: 0px 12px 40px rgba(43, 42, 107, 0.15);
    border-radius: 16px;
    margin-top: 14px;
  }
  .text-container {
    padding: 20px 14px 20px 20px;
  }
  .coach {
    border-radius: 50%;
    margin-right: 8px;
    overflow: hidden;
  }
  .coach-container {
    display: flex;
    align-items: center;
    margin-top: 19px;
  }
`;
