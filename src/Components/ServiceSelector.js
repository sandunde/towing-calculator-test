import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const ServiceSelector = () => {
  const [selectedService, setSelectedService] = useState('');
  const price = 145;

  const handleServiceChange = (event) => {
    const service = event.target.value;

    sessionStorage.setItem('selectedService', service);
    sessionStorage.setItem('totalPrice', price);

    setSelectedService(service);
  };

  return (
    <Form style={{marginTop:15}}>
      <Form.Group controlId="formCurrentLocation">
        <Form.Label>Type of Service:</Form.Label>
        <Form.Control as="select" onChange={handleServiceChange} value={selectedService}>
          <option value="">Select a service...</option>
          <option value="towing">Towing</option>
          <option value="jumpstart">Jumpstart</option>
          <option value="lockout">Lockout</option>
          <option value="tyreChange">Tire Change</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default ServiceSelector;
