import css from 'styled-jsx/css';

export default css`
  .card {
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .mfy-playlist-container {
    width: 112%;
    display: flex;
    justify-content: flex-start;
  }
  #padding-content {
    margin-bottom: 24px;
  }
  .playlist-card {
    width: 172px;
    border-radius: 16px;
    object-fit: cover;
    margin-right: 16px;
    height: 216px;
  }
  .animation {
    animation: fadeIn ease 4.5s;
    -moz-animation: fadeIn ease 4.5s;
    -o-animation: fadeIn ease 4.5s;
    -ms-animation: fadeIn ease 4.5s;
  }
  .wrapper {
    position: relative;
  }
  .background {
    min-width: 346px;
    min-height: 229px;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70%: {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
  @media only screen and (max-width: 360px) {
    .playlist-card {
      width: 142px;
      height: 176px;
    }
  }
`;
