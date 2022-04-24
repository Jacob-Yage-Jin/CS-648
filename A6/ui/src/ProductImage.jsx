import React from 'react';
import { Link } from 'react-router-dom';

export default class ProductImage extends React.Component {
  constructor() {
    super();
    this.state = { product: {} };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query productGet($id: Int!) {
      productGet(id: $id) {
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
    this.setState({ product: result.data.productGet ? result.data.productGet : null });
  }

  render() {
    const { product } = this.state;
    if (product.image) {
      return (
        <div>
          <img src={product.image} alt={product.name} />
        </div>
      );
    }
    return (
      <div>
        <h2>There is no image for this product</h2>
      </div>
    );
  }
}
