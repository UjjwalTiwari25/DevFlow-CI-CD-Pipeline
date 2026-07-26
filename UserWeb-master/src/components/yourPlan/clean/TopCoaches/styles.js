import css from 'styled-jsx/css';

export default css`
  .card {
    background: none;
    background-size: cover;
    border: none;
    border-radius: 6px;
    padding: 20px;
  }
  .coach-list {
    max-width: 100%;
    overflow-y: auto;
  }
  ::-webkit-scrollbar {
    height: 2px;
    width: 2px;
  }
  /* Handle */
  .coach-list::-webkit-scrollbar-thumb {
    background: #949494;
    border-radius: 5px;
  }
  /* Track */
  .coach-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }
  .animation {
    animation: fadeIn ease 6s;
    -moz-animation: fadeIn ease 6s;
    -o-animation: fadeIn ease 6s;
    -ms-animation: fadeIn ease 6s;
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
`;

export const itemStyle = css`
  .coach-item-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 24px;
    margin-bottom: 24px;
    margin-right: 28px;
  }
  .coach-item-details {
    margin-left: 16px;
    width: 118px;
  }
  .row {
    display: flex;
    align-items: center;
  }
  .image-container-row {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 115px;
    height: 120px;
    min-width: 115px;
    margin-right: 12px;
  }
  .image-container-col {
    display: flex;
    justify-content: center;
    width: 180px;
    height: 140px;
    margin-bottom: 16px;
  }
  .coach-image {
    width: 64px;
    height: 64px;
    border-radius: 32px;
    object-fit: cover;
  }
  .flag-image {
    width: 12px;
    margin-right: 4px;
    object-fit: contain;
  }
  .subs-image {
    width: 17px;
    height: 11px;
    margin-right: 4px;
    margin-left: 10px;
    object-fit: contain;
  }
`;
