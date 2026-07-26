import css from 'styled-jsx/css';

export default css`
  .main-wrapper {
    padding: 20px;
  }
  .container {
    margin: 0 auto;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  .music-tracks {
    width: 285px;
    height: 70px;
    background: #fff;
    overflow: hidden;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .music-tracks:hover {
    opacity: 0.5;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .container > a {
    text-decoration: none;
    color: #333;
  }
  @media screen and (min-width: 320px) {
    .container {
      grid-template-columns: repeat(1, 1fr);
    }
    .music-tracks {
      width: 100%;
    }
  }

  @media screen and (min-width: 480px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (min-width: 1024px) {
    .container {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1440px) {
    .container {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1800px) {
    .container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
`;
