/* eslint "react/react-in-jsx-scope": "off" */
/* eslint "react/jsx-no-undef":  "off" */
/* eslint "no-alert": "off" */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Glyphicon, Table, Modal,
} from 'react-bootstrap';

function ProductRow(props) {
  const { product, deleteProduct } = props;
  return (
    <tr>
      <td>{product.name}</td>
      <td>
        $
        {product.price}
      </td>
      <td>{product.category}</td>
      <td><Link to={`/image/${product.id}`}>View</Link></td>
      <td>
        <Link to={`/edit/${product.id}`}>Edit</Link>
        {' | '}
        <Button bsStyle="primary" bsSize="xsmall" type="button" onClick={() => deleteProduct(product.id)}><Glyphicon glyph="trash" /></Button>
      </td>
    </tr>
  );
}

function ProductTable(props) {
  const { products, deleteProduct } = props;
  const productRows = products.map(
    product => <ProductRow key={product.id} product={product} deleteProduct={deleteProduct} />,
  );
  return (
    <Table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </Table>
  );
}

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      show: false,
      id: 0,
      count: 0,
    };
    this.loadData = this.loadData.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(id) {
    this.setState({ show: true, id });
  }

  async loadData() {
    const query = `query {
      productList {
        id category name price image
      }
    }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();

    const query2 = `query {
      productCount
    }`;
    const response2 = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query2 }),
    });
    const count = await response2.json();

    this.setState({
      products: result.data.productList,
      show: false,
      count: count.data.productCount,
    });
  }

  async deleteProduct() {
    const { id } = this.state;
    const query = `mutation productDelete($id: Int!) {
      productDelete(id: $id)
    }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();

    if (result.data.productDelete) {
      this.loadData();
    }
  }

  render() {
    const { products, show, count } = this.state;
    return (
      <React.Fragment>
        <div className="product-count">
          Showing
          {' '}
          {count}
          {' '}
          available products
        </div>
        <ProductTable products={products} deleteProduct={this.handleShow} count={count} />

        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this product</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.deleteProduct}>Delete</Button>
            <Button onClick={this.handleClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
