import React from 'react';
import {Switch, Route, Redirect, BrowserRouter} from 'react-router-dom';

import routes from 'routes';

const App = () => (
    <BrowserRouter>
        <Switch>
            {
                routes.map((route, i) => route.redirect
                ? <Redirect key={i} {...route} /> : <Route {...route} key={i}/>
                )
            }
        </Switch>
    </BrowserRouter>
);

export default App
