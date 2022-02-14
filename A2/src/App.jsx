class ProductRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.product.name}</td>
        <td>{this.props.product.price}</td>
        <td>{this.props.product.category}</td>
        <td><a href={this.props.product.image} target='_blank'>View</a></td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const productRows = this.props.products.map(product => <ProductRow key={product.id} product={product} />);
    return (
      <div>
        <div class="header">Showing all available products</div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {productRows}
          </tbody>
        </table>
      </div>
    );
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
    return (
      <div>
        <div class="header">Add a new product to inventory</div>
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
            <div><span class="input-prefix">$</span><input name="price" class="input-value" /></div>
          </div>

          <div>
            <div>Product Name</div>
            <input name="name" />
          </div>

          <div>
            <div>Image URL</div>
            <input name="image" />
          </div>
          <button>Add Product</button>
        </form>
      </div>
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {products: []};
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
    this.setState({products: newProductList});
  }
  render() {
    return (
      <React.Fragment>
        <ProductTable products={this.state.products}/>
        <ProductAdd createProduct={this.createProduct}/>
      </React.Fragment>
    );
  }
}

const element = <ProductList />;

ReactDOM.render(element, document.getElementById('contents'));
