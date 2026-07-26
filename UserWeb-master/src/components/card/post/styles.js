import css from 'styled-jsx/css';

export default css`
  .root {
    display: flex;
    flex-direction: column;
    width: 310px;
    box-shadow: 12px 18px 16px -10px rgba(0, 0, 0, 0.2);
    height: 168px;
    background-color: white;
    border-radius: 12px;
    border: 1px solid rgb(185, 185, 185);
    margin-top: 10px;
    margin-right: 36px;
    margin-bottom: 30px;
  }
  .avatar-small {
    vertical-align: middle;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    text-align: center;
    background: rgb(194, 186, 186);
  }
  .post-content {
    margin-top: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media screen and (max-width: 1440px) {
    .root {
      width: 290px;
    }
  }
  @media screen and (max-width: 1024px) {
    .root {
      width: 264px;
      margin-right: 32px;
    }
  }
  @media screen and (max-width: 576px) {
    .root {
      width: 272px;
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 320px) {
    .root {
      width: 228px;
      margin-right: 20px;
    }
  }
`;
