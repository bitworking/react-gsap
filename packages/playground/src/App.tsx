import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Tween from './examples/Tween';
import Timeline from './examples/Timeline';
import Svg from './examples/Svg';
import Transition from './examples/Transition';

function App() {
  return (
    <div>
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
            </ul>
          </nav>

          <hr />

          <Route exact path="/" component={Tween} />
          <Route exact path="/timeline" component={Timeline} />
          <Route exact path="/svg" component={Svg} />
          <Route exact path="/transition" component={Transition} />
        </div>
      </Router>
    </div>
  );
}

export default App;
