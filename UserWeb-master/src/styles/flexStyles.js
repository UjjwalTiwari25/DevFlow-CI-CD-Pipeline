import css from 'styled-jsx/css';

export default css.global`
  .w-100 {
    width: 100%;
  }
  .h-100 {
    height: 100%;
  }
  .w-100vh {
    width: 100vh;
  }
  .h-100vh {
    height: 100vh;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .align-center {
    align-items: center;
  }
  .align-start {
    align-items: flex-start;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-space-between {
    justify-content: space-between;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .card {
    background: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 12px;
    padding: 32px;
    overflow: hidden;
  }
  .relative {
    position: relative;
  }
  @media only screen and (max-width: 576px) {
    .card {
      padding: 24px;
    }
  }
  @media only screen and (max-width: 350px) {
    .card {
      padding: 16px;
    }
  }
`;
