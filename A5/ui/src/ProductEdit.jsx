/* eslint-disable react/sort-comp */
/* eslint-disable import/extensions */
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      redirect: false
    };
    this.onSaveClick = this.onSaveClick.bind(this);
  }

  async onSaveClick(e) {
    e.preventDefault();
    const { product } = this.state;

    const query = `mutation productUpdate(
      $id: Int!
      $modify: ProductUpdateInputs!
    ) {
      productUpdate(
        id: $id
        modify: $modify
      ) {
        id category name price image
      }
    }`;
    const { id, ...modify } = product;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { modify, id } }),
    });
    const result = await response.json();

    if (result) {
      this.setState({ redirect: true });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange = (event, naturalValue) => {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState((prevState) => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id name price category image
      }
    }`;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const result = await response.json();
    this.setState({ product: result.data.product });
  }

  render() {
    const { product, redirect } = this.state;

    if (redirect) {
      return (
        <Redirect to="/products" />
      );
    } else if (product && product.id) {
      return (
        <div>
          <div className="header">Edit product in inventory</div>
          <form onSubmit={this.onSaveClick}>
            <div>
              <div>Category</div>
              <select name="category" value={product.category} onChange={this.onChange}>
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweaters">Sweaters</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <div>Price Per Unit</div>
              <NumInput name="price" value={product.price} onChange={this.onChange} key={product.id} />
            </div>

            <div>
              <div>Product Name</div>
              <TextInput name="name" value={product.name} onChange={this.onChange} key={product.id} />
            </div>

            <div>
              <div>Image URL</div>
              <TextInput name="image" value={product.image} onChange={this.onChange} key={product.id} />
            </div>

            <button type="submit">Save Product</button>
            <Link to="/products">Cancel</Link>
          </form>
        </div>
      );
    } else {
      return (
        <h1>Loading Data...</h1>
      );
    }
  }
}
