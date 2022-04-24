import React from 'react';
import { Button, Alert, Form, FormGroup, Col, FormControl, ControlLabel, InputGroup } from 'react-bootstrap';

function AddAlert(props) {
  const {show, handleDismiss } = props;

  if (show) {
    return (
      <Alert bsStyle="success" onDismiss={handleDismiss}>
        Product added successfully!
        <Button onClick={handleDismiss}>Hide Alert</Button>
      </Alert>
    );
  }
  return null;
}

export default class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onAddClick = this.onAddClick.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      show: false
    };
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  onAddClick(e) {
    e.preventDefault();
    const { props } = this;
    const form = document.forms.productAdd;
    const product = {
      name: form.name.value,
      price: form.price.value,
      category: form.category.value,
      image: form.image.value,
    };
    this.createProduct(product);
    this.handleDismiss();
    this.handleShow();
    form.name.value = '';
    form.price.value = '';
    form.category.value = '';
    form.image.value = '';
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } }),
    });
  }

  render() {
    return (
      <div>
        <AddAlert show={this.state.show} handleDismiss={this.handleDismiss}></AddAlert>

        <Form horizontal name="productAdd" onSubmit={this.onAddClick}>
          <FormGroup controlId="category">
            <Col componentClass={ControlLabel} sm={3}>
              Category
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="select">
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="price">
            <Col componentClass={ControlLabel} sm={3}>
              Price Per Unit
            </Col>
            <Col sm={9}>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl type="text"></FormControl>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup controlId="name">
            <Col componentClass={ControlLabel} sm={3}>
              Product Name
            </Col>
            <Col sm={9}>
              <FormControl type="text"></FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="image">
            <Col componentClass={ControlLabel} sm={3}>
              Image Url
            </Col>
            <Col sm={9}>
              <FormControl type="text"></FormControl>
            </Col>
          </FormGroup>

          <Button bsStyle="primary" type="submit" style={{float: "right"}}>Add Product</Button>
        </Form>
      </div>
    );
  }
}
