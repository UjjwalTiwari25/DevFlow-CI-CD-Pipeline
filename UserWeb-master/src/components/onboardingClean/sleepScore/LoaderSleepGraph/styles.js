import css from 'styled-jsx/css';

export default css`
  .header-container {
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
  }
  .graph-container {
    position: relative;
    margin-top: 35px;
    width: 100%;
  }
  .graph-image {
    width: 100%;
  }
  .container-styles {
    height: 35px;
    width: 100%;
    background-color: #878da9;
    border-radius: 50px;
    position: relative;
    overflow: hidden;
  }
  .bar-light-background {
    background: rgba(135, 141, 169, 0.1);
  }
  .bar-dark-background {
    background-color: #878da9;
  }
  .filler-styles {
    height: 100%;
    background: linear-gradient(
      90deg,
      #67f6cb 0%,
      #809cff 48.31%,
      #f664de 100%
    );
    border-radius: 99px;
    text-align: right;
    border-radius: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .filler-styles-absolute {
    background: linear-gradient(
      90deg,
      #67f6cb 0%,
      #809cff 48.31%,
      #f664de 100%
    );
    border-radius: 99px;
    text-align: right;
    border-radius: none;
    height: 10px;
    filter: blur(12px);
    top: 28px;
    position: absolute;
  }
  .shadow-wrapper {
    position: relative;
  }
  .progress-container {
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
    padding: 0 32px 100px 32px;
  }
  .button {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
