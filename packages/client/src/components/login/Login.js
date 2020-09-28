import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  FormControl,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip
} from '@material-ui/core';
import { Help } from '@material-ui/icons';
import 'fontsource-roboto';
import './Login.scss';

const initialSatate = {
  username: '',
  password: ''
};
const emailRegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
const regExp = {
  username: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
};

const Login = () => {
  const [state, setState] = useState(initialSatate);
  const [errors, setErrors] = useState({
    username: false,
    password: false
  });
  const [isValidForm, setIsValidForm] = useState(false);

  useEffect(() => {
    setIsValidForm(!errors.username && !errors.password);
  }, [errors]);

  const handleChange = ({ target: { name, value } }) =>
    setState({ ...state, [name]: value });

  const handleValidateField = ({ target: { name } }) => {
    const isNotEmptyField = Boolean(state[name].length);
    const isValidRegExp = regExp[name].test(state[name]);
    const isValidField = isNotEmptyField && isValidRegExp;
    setErrors((prevState) => ({
      ...prevState,
      [name]: !isValidField
    }));
  };

  const validate = () => {
    const { username, password } = state;
    const isValidUsername =
      Boolean(username.length) && emailRegExp.test(username);
    const isValidPassword =
      Boolean(password.length) && passwordRegExp.test(password);

    setErrors((prevState) => ({
      ...prevState,
      username: !isValidUsername,
      password: !isValidPassword
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    if (!isValidForm) {
      return;
    }
    console.log(state);
  };

  return (
    <div className="Login">
      <CssBaseline />
      <Container maxWidth="sm">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Card raised>
            <CardHeader title="Login" />
            <CardContent>
              <FormControl fullWidth margin="dense">
                <TextField
                  autoFocus
                  error={errors.username}
                  helperText={
                    errors.username && 'Please provide a valid username'
                  }
                  label="Username"
                  name="username"
                  onBlur={handleValidateField}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  value={state.username}
                  variant="outlined"
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  error={errors.password}
                  helperText={
                    errors.password && 'Please provide a valid password'
                  }
                  label="Password"
                  name="password"
                  onBlur={handleValidateField}
                  onChange={handleChange}
                  placeholder="password"
                  required
                  type="password"
                  value={state.password}
                  variant="outlined"
                />
              </FormControl>

              <Tooltip
                title={
                  <List>
                    <ListItem dense disableGutters>
                      <ListItemText primary="Password must contain at least:" />
                    </ListItem>
                    <ListItem dense disableGutters>
                      <ListItemText primary="1 lowercase alphabetical character" />
                    </ListItem>
                    <ListItem dense disableGutters>
                      <ListItemText primary="1 uppercase alphabetical character" />
                    </ListItem>
                    <ListItem dense disableGutters>
                      <ListItemText primary="1 numeric character" />
                    </ListItem>
                    <ListItem dense disableGutters>
                      <ListItemText primary="1 special character" />
                    </ListItem>
                    <ListItem dense disableGutters>
                      <ListItemText primary="Must be eight characters or longer" />
                    </ListItem>
                  </List>
                }
                placement="right-end"
                arrow
              >
                <Help color="primary" style={{ fontSize: 15 }} />
              </Tooltip>
            </CardContent>
            <CardActions className="Login__actions">
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </CardActions>
          </Card>
        </form>
      </Container>
    </div>
  );
};

export default Login;
