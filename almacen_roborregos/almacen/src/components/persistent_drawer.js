/*
  1-Implementar el regreso de Articulos
  3-SearchBox
  4-Restar la cantidad de articulos disponibles despues de que alguien aparte
  5-Mostrar quien tiene que
*/
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SimpleMediaCard from './simple_media_card.js'
import FullWidthGrid from './full_width_grid.js'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import LogDialog from './log_dialog';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'

import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import Hidden from '@material-ui/core/Hidden';

var firebase = require('firebase');

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  login: {
    marginRight: '2%',
  },
  input: {
    margin: theme.spacing.unit,
  },
  appFrame: {
    height: 'auto',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

class PersistentDrawer extends React.Component {
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          message: "Bienvenido " + user.email,
          userLogedin: true
         })
      } else {
        this.setState({
          message: "Inicia sesión para utilizar el sistema de almacen.",
          userLogedin: false
         })
      }
    });
  }

  handleTabClick(tab) {
    this.setState({
       tabSelection: tab,
       showSelectedArticles: false
     });
    const simpleCardsArray = [];
    if (tab === "todos") {
      var ref = firebase.database().ref("/");
      ref.once('value').then((snapshot) => {
        Object.keys(snapshot.val()).forEach((element) => {
          if (element !== "prestados") {
          ref = firebase.database().ref(element + "/");
          ref.once('value').then((snapshot2) => {
            Object.keys(snapshot2.val()).forEach((data) => {
              simpleCardsArray.push(
                <SimpleMediaCard
                  img={data}
                  availables={snapshot2.val()[data]}
                  change={this.state.change}
                  showSelArt={this.state.showSelectedArticles}
                  tab={this.state.tabSelection}
                />);
            });
            const GridOfSimpleCards = simpleCardsArray.map((card) => {
              return (
                <Grid item xs={6} sm={3}>
                  {card}
                </Grid>
              )
            });
            this.setState({ GridOfSimpleCardsArray: GridOfSimpleCards });
          });
          }
        });
      });
    } else {
      var ref = firebase.database().ref(tab + "/");
      ref.once('value').then((snapshot) => {
        Object.keys(snapshot.val()).forEach((element) => {
          simpleCardsArray.push(
            <SimpleMediaCard
              img={element}
              availables={snapshot.val()[element]}
              cart={this.addToCart}
              showSelArt={this.state.showSelectedArticles}
              tab={this.state.tabSelection}
            />);
        });
        const GridOfSimpleCards = simpleCardsArray.map((card) => {
          return (
            <Grid item xs={6} sm={3}>
              {card}
            </Grid>
          )
        });
        this.setState({ GridOfSimpleCardsArray: GridOfSimpleCards });
      });
    }
  }

  addToCart(art, cant) {
    var newArticles = this.state.articulos;
    newArticles = {...newArticles,
      [art]:  cant
    }

    this.setState({
      articulos: newArticles
     });
  }

  handleSelectArticlesClick(){
    const simpleCardsArray = [];
    for(var key in this.state.articulos) {
      simpleCardsArray.push(
        <SimpleMediaCard
          img={key}
          availables={this.state.articulos[key]}
          cart={this.addToCart}
          showSelArt={true}
          tab={this.state.tabSelection}
        />);
    }
    const GridOfSimpleCards = simpleCardsArray.map((card) => {
      return (
        <Grid item xs={6} sm={3}>
          {card}
        </Grid>
      )
    });
    this.setState({
      GridOfSimpleCardsArray: GridOfSimpleCards,
      showSelectedArticles: true
     });
  }

  handleApartarClick() {
    var user = firebase.auth().currentUser
    var db = firebase.database();
    var ref = db.ref("prestados");
    var postsRef = ref.child(user.uid);

    var newPostRef = postsRef.push();
    for (let keyArt in this.state.articulos) {
      postsRef.once('value').then((snapshot) => {
        if (snapshot.val()[keyArt]) {
          let art = this.state.articulos;
          art[keyArt] = parseInt(art[keyArt]) + parseInt(snapshot.val()[keyArt])
          this.setState({ articulos: art })
        }
        postsRef.update({
          [keyArt]: this.state.articulos[keyArt],
        });
        delete this.state.articulos[keyArt]
      });
    }
    this.setState({
      GridOfSimpleCardsArray: <Grid></Grid>,
      showSelectedArticles: false
    });
  }

  constructor(props){
    super(props);

    this.state = {
      message: "Inicia sesión para utilizar el sistema de almacen.",
      userLogedin: false,
      open: false,
      anchor: 'left',
      tabSelection: "todos",
      GridOfSimpleCardsArray: [],
      change: true,
      articulos: {},
      showSelectedArticles: false
    };

    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleChangeAnchor = this.handleChangeAnchor.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.handleSelectArticlesClick = this.handleSelectArticlesClick.bind(this);
    this.handleApartarClick = this.handleApartarClick.bind(this);
  }

  render() {0
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;
    let addButton;
    if (this.state.showSelectedArticles) {
      addButton =
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleApartarClick}
        >
          Apartar
        </Button>;
    } else {
      addButton =
        <Hidden xsUp>
        </Hidden>;
    }
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title" color="inherit" className={classes.flex}
              >
                {this.state.message}
              </Typography>
              <LogDialog logedin={this.state.userLogedin}/>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="persistent"
            anchor={anchor}
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ?
                  <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={() => this.handleTabClick("todos")}>
                  <ListItemIcon>
                    <ViewComfyIcon />
                  </ListItemIcon>
                  <ListItemText
                     primary="Todos"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("distancia")}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText
                     primary="Distancia"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("motores")}>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText
                     primary="Motores"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("temperatura")}>
                  <ListItemIcon>
                    <SendIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Temperatura"
                   />
                </ListItem>
                <ListItem button onClick={() => this.handleTabClick("displays")}>
                  <ListItemIcon>
                    <DraftsIcon />
                  </ListItemIcon>
                  <ListItemText
                     primary="Displays"
                   />
                </ListItem>
              </div>
            </List>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={this.handleSelectArticlesClick}>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Articulos Seleccionados" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Regresar articulos" />
                </ListItem>
              </div>
            </List>
          </Drawer>
          <main
            className={classNames(
              classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <Typography>
              <FullWidthGrid
                gridCards={!this.state.userLogedin ?
                    <Grid></Grid> : this.state.GridOfSimpleCardsArray}
              />
          </Typography>
          {addButton}
          </main>
        </div>
      </div>
    );
  }
}


PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
