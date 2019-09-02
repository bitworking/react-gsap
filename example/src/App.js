import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GlobalStyle from  './constants/style/global';

import Tween from './components/Tween';
import Timeline from './components/Timeline';
import Svg from './components/Svg';
import Transition from './components/Transition';
import MouseFollow from './components/MouseFollow';

const AppStyled = styled.div`
  nav {
    ul {
      padding: 0;
      li {
        display: inline-block;
        margin-right: 20px;

        a {
          color: #555;
        }
      }
    }
  }
`;

// eslint-disable-next-line
const Home = () => (
  <div />
);

const App = () => (
  <AppStyled>
    <GlobalStyle />
    <Router basename="/react-gsap">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Tween</Link>
            </li>
            <li>
              <Link to="/timeline">Timeline</Link>
            </li>
            <li>
              <Link to="/svg">Svg</Link>
            </li>
            <li>
              <Link to="/transition">Transition</Link>
            </li>
            <li>
              {/*<Link to="/mouse-follow">MouseFollow</Link>*/}
            </li>
          </ul>
        </nav>

        <hr />
        
        <Route exact path="/" component={Tween} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/svg" component={Svg} />
        <Route path="/transition" component={Transition} />
        <Route path="/mouse-follow" component={MouseFollow} />
      </div>
    </Router>
  </AppStyled>
);

export default App;
