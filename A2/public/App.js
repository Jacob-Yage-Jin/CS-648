class ProductRow extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, this.props.product.name), /*#__PURE__*/React.createElement("td", null, this.props.product.price), /*#__PURE__*/React.createElement("td", null, this.props.product.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: this.props.product.image,
      target: "_blank"
    }, "View")));
  }

}

class ProductTable extends React.Component {
  render() {
    const productRows = this.props.products.map(product => /*#__PURE__*/React.createElement(ProductRow, {
      key: product.id,
      product: product
    }));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      class: "header"
    }, "Showing all available products"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Product Name"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Image"))), /*#__PURE__*/React.createElement("tbody", null, productRows)));
  }

}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onAddClick = this.onAddClick.bind(this);
  }

  onAddClick(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    this.props.createProduct(form.name.value, form.price.value, form.category.value, form.image.value);
    form.name.value = "";
    form.price.value = "";
    form.category.value = "";
    form.image.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      class: "header"
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
      class: "input-prefix"
    }, "$"), /*#__PURE__*/React.createElement("input", {
      name: "price",
      class: "input-value"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Product Name"), /*#__PURE__*/React.createElement("input", {
      name: "name"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Image URL"), /*#__PURE__*/React.createElement("input", {
      name: "image"
    })), /*#__PURE__*/React.createElement("button", null, "Add Product")));
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

  createProduct(name, price, category, img_url) {
    const newProductList = this.state.products.slice();
    newProductList.push({
      id: newProductList.length,
      name: name,
      price: price,
      category: category,
      image: img_url
    });
    this.setState({
      products: newProductList
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProductTable, {
      products: this.state.products
    }), /*#__PURE__*/React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

const element = /*#__PURE__*/React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));