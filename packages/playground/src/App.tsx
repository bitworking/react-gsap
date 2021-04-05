import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Tween from './examples/Tween';
import Timeline from './examples/Timeline';
import Svg from './examples/Svg';
import Transition from './examples/Transition';
import Reveal from './examples/Reveal';
import ScrollTrigger from './examples/ScrollTrigger';
import ManualControl from './examples/ManualControl';
// import Scroller from './examples/Scroller';

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
              <li>
                <Link to="/reveal">Reveal</Link>
              </li>
              <li>
                <Link to="/scroll-trigger">ScrollTrigger</Link>
              </li>
              <li>
                <Link to="/manual-control">ManualControl</Link>
              </li>
              {/*<li>
                <Link to="/scroller">Scroller</Link>
              </li>*/}
            </ul>
          </nav>

          <hr />

          <Route exact path="/" component={Tween} />
          <Route exact path="/timeline" component={Timeline} />
          <Route exact path="/svg" component={Svg} />
          <Route exact path="/transition" component={Transition} />
          <Route exact path="/reveal" component={Reveal} />
          <Route exact path="/scroll-trigger" component={ScrollTrigger} />
          <Route exact path="/manual-control" component={ManualControl} />
          {/*<Route exact path="/scroller" component={Scroller} />*/}
        </div>
      </Router>
    </div>
  );
}

export default App;
