import { injectGlobal } from 'styled-components';

export default injectGlobal`
  body {
    margin: 50px;
    font-family: verdana, sans-serif;
    font-size: 16px;
  }

  hr {
    height: 1px;
    background-color: #555;
    border: 0;
  }

  .section {
    margin: 40px 0 20px;
    font-size: 1.2rem;
  }
`;