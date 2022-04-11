/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef":  "off" */
/* eslint "no-alert": "off" */

import React from 'react';
import { Link } from 'react-router-dom';

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
        <button type="button" onClick={() => deleteProduct(product.id)}>Delete</button>
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
    <div>
      <div className="header">Showing all available products</div>
      <table>
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
      </table>
    </div>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onAddClick = this.onAddClick.bind(this);
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
    props.createProduct(product);
    form.name.value = '';
    form.price.value = '';
    form.category.value = '';
    form.image.value = '';
  }

  render() {
    return (
      <div>
        <div className="header">Add a new product to inventory</div>
        <form name="productAdd" onSubmit={this.onAddClick}>
          <div>
            <div>Category</div>
            <select name="category">
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <div>Price Per Unit</div>
            <div>
              <span className="input-prefix">$</span>
              <input name="price" className="input-value" />
            </div>
          </div>

          <div>
            <div>Product Name</div>
            <input name="name" />
          </div>

          <div>
            <div>Image URL</div>
            <input name="image" />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>
    );
  }
}

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.loadData = this.loadData.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
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
    this.setState({ products: result.data.productList });
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
    this.loadData();
  }

  async deleteProduct(id)  {
    const loadData = this.loadData;
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
      loadData();
    }
  };

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}
