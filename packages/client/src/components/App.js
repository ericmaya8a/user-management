import React from 'react';
import { CssBaseline, Button } from '@material-ui/core';
import 'fontsource-roboto';

const App = () => {
  return (
    <CssBaseline>
      <div className="App">
        <p>App started with express</p>
        <Button variant="contained" color="primary">
          Hola Mundo!
        </Button>
      </div>
    </CssBaseline>
  );
};

export default App;
