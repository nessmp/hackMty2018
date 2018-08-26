import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormDialog from './form_dialog';
// Images
// Distancia
import ultrasonico from './images/distancia/ultrasonico.jpg';
import vlx from './images/distancia/vlx.jpg';
import sharp from './images/distancia/sharp.jpg';
// Displays
import lcd from './images/displays/lcd.jpg';
import oled from './images/displays/oled.jpg';
// Temperatura
import mlx from './images/temperatura/mlx.jpg';
// Motores
import motor_mini from './images/motores/motor_mini.jpg';
import motor from './images/motores/motor.jpg';
import amarillo from './images/motores/amarillo.jpg';
import stepper from './images/motores/stepper.jpg';

import Hidden from '@material-ui/core/Hidden';

var firebase = require('firebase');

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  button: {
    flexGrow: 1,
  }
};

class SimpleMediaCard extends React.Component  {
  render() {
    const { classes } = this.props
    let Buttons;
    if (this.props.showSelArt) {
      Buttons =
      <Hidden xsUp>
        <Button size="small" color="primary" className={classes.button}>
          Codigo ejemplo
        </Button>
        <FormDialog
          disp={this.props.availables}
          sensor={this.props.img}
          cart={this.props.cart}
        />
    </Hidden>;
    } else {
      Buttons =
        <Hidden>
          <Button
            disabled={true} size="small" color="primary"
            className={classes.button}
          >
            Codigo ejemplo
          </Button>
          <FormDialog
            disp={this.props.availables}
            sensor={this.props.img}
            cart={this.props.cart}
            tab={this.props.tab}
          />
      </Hidden>;
    }
    var message = this.props.showSelArt ?
      "Articulos seleccionados: " : "Articulos disponibles: "
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={"./images/" + this.props.img + ".jpg"}
            title="Ultrasonico"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {this.props.img}
            </Typography>
            <Typography component="p">
              {message} {this.props.availables}
            </Typography>
          </CardContent>
          <CardActions>
            {Buttons}
          </CardActions>
        </Card>
      </div>
    );
  }
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleMediaCard);
