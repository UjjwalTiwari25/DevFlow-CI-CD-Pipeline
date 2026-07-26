import css from 'styled-jsx/css';

export default css`
  .login-text {
    position: absolute;
    top: 60px;
    right: 20px;
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    margin-top: 32px;
    margin-bottom: 72px;
  }
  .item-container-shorter {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 72px;
  }
  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .login-text {
      right: 32px;
    }
  }
`;

export const itemStyle = css`
  .item {
    display: flex;
    flex: 0 48%;
    position: relative;
    justify-content: center;
    align-items: center;
    height: 92px;
    margin-bottom: 12px;
    border-radius: 6px;
    background-color: #a9a9a9;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover !important;
  }
  .check-mark {
    position: absolute;
    top: 5%;
    right: 5%;
    color: white;
  }
  .label-container {
    width: 122px;
    position: absolute;
    z-index: 1;
    top: -8px;
    padding: 2px 0px 3px 0px;
    border-radius: 99px;
  }
  .green-background {
    background: linear-gradient(90deg, #00ff75 0%, #9fea00 100%);
  }
  .gray-background {
    background: rgba(91, 101, 122, 1);
  }
  .blue-background {
    background: linear-gradient(270deg, #1df5ed -3.23%, #4ccaff 95.81%);
  }
  .increase-margin-bottom {
    margin-bottom: 16px;
  }
  .user-text-container {
    display: flex;
    position: absolute;
    bottom: 5px;
  }
  .user-icon {
    width: 14px;
    height: 12px;
  }
  .select-border-white {
    border: 1px solid #fff;
  }
  .item-container-last-item-center {
    margin-left: auto !important;
    margin-right: auto !important;
  }
`;
