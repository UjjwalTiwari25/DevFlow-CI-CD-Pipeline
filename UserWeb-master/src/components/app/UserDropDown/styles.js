import css from 'styled-jsx/css';

export default css`
  .button-holder {
    display: flex;
    justify-content: flex-end;
  }
  .dropdown-button {
    border-radius: 28px;
    border: 1px solid rgb(151, 151, 151);
    min-height: 38px;
    min-width: 90px;
    margin: 0 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    outline: none;
  }
  .drop-down-icon {
    margin-top: 4px;
    margin-left: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
  .dropdown {
    position: absolute;
    top: 93%;
    right: 16px;
    min-width: 80px;
    animation: growDown 300ms ease-in-out forwards;
    transform-origin: top center;
    background-color: white;
    border-radius: 5px;
  }
  .new-drop-down {
    position: absolute;
    top: 85%;
    right: 9px;
    min-width: 80px;
    animation: growDown 300ms ease-in-out forwards;
    transform-origin: top center;
    background-color: white;
    border-radius: 5px;
  }
  .coaching-profile-drop-down {
    position: absolute;
    top: 85%;
    right: 0px;
    min-width: 80px;
    animation: growDown 300ms ease-in-out forwards;
    transform-origin: top center;
    background-color: white;
    border-radius: 5px;
  }
  .dropdown ul {
    background-color: rgb(0, 0, 0, 0.16);
    border-radius: 5px;
  }

  .new-drop-down ul {
    background-color: rgb(0, 0, 0, 0.16);
    border-radius: 5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 8px 12px;
  }

  li:hover {
    background-color: rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }
  @media (min-width: 577px) {
    .dropdown-button {
      margin: 0 5px;
    }
    .dropdown {
      min-width: 90px;
    }
    .new-drop-down {
      top: 100%;
    }
  }
  @keyframes growDown {
    0% {
      transform: scaleY(0);
    }
    80% {
      transform: scaleY(1.1);
    }
    100% {
      transform: scaleY(1);
    }
  }
`;
