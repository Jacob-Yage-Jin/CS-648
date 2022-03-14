/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef":  "off" */

/* eslint "no-alert": "off" */
function ProductRow(props) {
  const {
    product
  } = props;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.name), /*#__PURE__*/React.createElement("td", null, "$", product.price), /*#__PURE__*/React.createElement("td", null, product.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: product.image,
    target: "_blank",
    rel: "noreferrer"
  }, "View")));
}

function ProductTable(props) {
  const {
    products
  } = props;
  const productRows = products.map(product => /*#__PURE__*/React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, "Showing all available products"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Product Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productRows)));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onAddClick = this.onAddClick.bind(this);
  }

  onAddClick(e) {
    e.preventDefault();
    const {
      props
    } = this;
    const form = document.forms.productAdd;
    const product = {
      name: form.name.value,
      price: form.price.value,
      category: form.category.value,
      image: form.image.value
    };
    props.createProduct(product);
    form.name.value = '';
    form.price.value = '';
    form.category.value = '';
    form.image.value = '';
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Add a new product to inventory"), /*#__PURE__*/React.createElement("form", {
      name: "productAdd",
      onSubmit: this.onAddClick
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Category"), /*#__PURE__*/React.createElement("select", {
      name: "category"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), /*#__PURE__*/React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), /*#__PURE__*/React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), /*#__PURE__*/React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), /*#__PURE__*/React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Price Per Unit"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "input-prefix"
    }, "$"), /*#__PURE__*/React.createElement("input", {
      name: "price",
      className: "input-value"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Product Name"), /*#__PURE__*/React.createElement("input", {
      name: "name"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Image URL"), /*#__PURE__*/React.createElement("input", {
      name: "image"
    })), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Add Product")));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });
    this.loadData();
  }

  render() {
    const {
      products
    } = this.state;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProductTable, {
      products: products
    }), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = /*#__PURE__*/React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));