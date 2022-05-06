import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavBar() {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>My Company Inventory</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem>Product List</NavItem>
        </LinkContainer>
        <LinkContainer exact to="/add">
          <NavItem>Add Product</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
}
