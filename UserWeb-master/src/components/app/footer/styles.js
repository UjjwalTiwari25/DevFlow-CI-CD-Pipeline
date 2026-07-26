import css from 'styled-jsx/css';

export default css`
  .box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .container {
    border-top: 1px solid rgba(144, 146, 163, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    padding-top: 60px;
  }

  .social-logos {
    display: flex;
  }
  .social-icons {
    color: #5b657a;
    background-color: #fff;
    border: 1px solid #5b657a;
    cursor: pointer;
    border-radius: 30px;
    margin-right: 20px;
    padding: 7px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
  }

  .social-icons:hover {
    color: black;
  }
  .app-logo {
    display: flex;
  }
  .app-logo:hover {
    color: #03a9f4;
  }

  .column {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .row {
    border-bottom: 1px solid rgba(144, 146, 163, 0.3);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
    grid-gap: 20px;
    padding: 0px 20px;
    padding-bottom: 60px;
  }

  .footer-link {
    color: #5b657a;
    text-decoration: none;
    margin-bottom: 5px;
  }

  .footer-link:hover {
    color: #03a9f4;
  }
  .footer-bottom {
    border-bottom: none;
    color: #5b657a;
    display: flex;
    padding: 40px 50px 20px;
    width: 100%;
    justify-content: space-between;
  }

  .heading {
    color: #030b18;
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 30px;
    line-height: 1;
  }
  .car-link {
    color: #5b657a;
    text-decoration: none;
  }

  @media (max-width: 375px) {
    .box {
      padding: 0px;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-item: center;
      max-width: 100%;
      padding-top: 40px;
    }
    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 0px;
    }
    .footer-bottom {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      padding: 0px;
      width: 100%;
      align-items: center;
      margin-bottom: 100px;
      margin-top: 10px;
    }
    .row {
      padding-bottom: 20px;
    }
    .footer-text {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
  }
`;
