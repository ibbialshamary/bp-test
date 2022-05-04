import React from "react";

import Card from "./Card";
import Button from "./Button";
import classes from "./Modal.module.scss";

const Modal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>{props.children}</div>
        <footer className={classes.actions}>
          <Button>Close</Button>
        </footer>
      </Card>
    </div>
  );
};

export default Modal;
