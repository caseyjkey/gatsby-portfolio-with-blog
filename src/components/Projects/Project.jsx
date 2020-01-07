import React, { Fragment, useState } from 'react'
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap'
import { StyledCard, Body, Header, Title, Subtitle, Text } from './style.js'

// Using a functional component because we don't use state, constructor, or lifecycle hooks
export default function Project({children, title, subtitle, icons, modalTitle, modalSubtitle, link}) {
	const [modal, setModal] = useState(false);

	const toggleModal = () => setModal(!modal);

  return (
    <Fragment>
      <div className="shadow project img  d-flex justify-content-center align-items-center" style={{backgroundImage: 'url(images/demo-02.png)'}}>
        <div className="overlay" onClick={toggleModal}/>
        <div className="text text-center p-4">
          <h3>{title}</h3>
          <span>{subtitle}</span>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {modalTitle}
        </ModalHeader>
        <ModalBody>
          {children} 
        </ModalBody>
        <ModalFooter>
          <Button color="primary" href={link} target={"_blank"}>View project</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}