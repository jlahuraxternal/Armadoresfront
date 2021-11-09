import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from 'react-bootstrap/Button';
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import {IoHome, IoPerson} from "react-icons/io5";
import {IoBoat} from "react-icons/io5";
import {IoDocumentText} from "react-icons/io5";
import {IoBagCheck} from "react-icons/io5";
import  logoImg from '../../images/tasa/logo.png';
import {FaCog} from 'react-icons/fa';
import {FiLogOut} from 'react-icons/fi';
import {Link, useHistory} from 'react-router-dom';
import './menu.css';
import { GetUsuario } from "../../services/storage";
class Menu extends Component{
    constructor(props){
        super(props);
    }

    cerrarSesion=()=>{
        localStorage.clear();
    }
    render(){
     return(   <>
            <Navbar collapseOnSelect expand="lg"  variant="dark" className="css_nav_men">
                <Container style={{marginLeft:'4%', marginRight:'4%', maxWidth:'Inherit'}}>
                    <Navbar.Brand href="#home">
                        <img src={logoImg} style={{width:'150px'}}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" style={{justifyContent:'flex-end'}}>
                        <Nav>
                            <Nav.Link href="/Inicio"  to="/Inicio" 
                                       style={{fontSize:'22px',marginRight:'20px'}}>
                                <IoHome style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Inicio
                            </Nav.Link>
                            <Nav.Link href="/Descargas" to="/Descargas" style={{fontSize:'22px',marginRight:'20px'}}>
                                <IoBoat style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Descargas
                            </Nav.Link>
                            <Nav.Link href="/CuentasCobrar" to="/CuentasCobrar" style={{fontSize:'22px',marginRight:'20px'}}>
                                <IoDocumentText style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Por cobrar
                            </Nav.Link>
                            <Nav.Link href="/Liquidacion" to="/Liquidacion" style={{fontSize:'22px',marginRight:'20px'}}>
                                <IoBagCheck style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Liquidaciones
                            </Nav.Link>
                            <Nav.Link href="/Perfil" to="/Perfil" style={{fontSize:'22px',marginRight:'20px'}}>
                                <IoPerson style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Perfil
                            </Nav.Link>
                            <Nav.Link  href="/Usuarios" to="/Usuarios" style={{fontSize:'22px',marginRight:'15px',display:(GetUsuario()==null?"":GetUsuario().includes("lruthnick")?"block":"none")}}>
                                <FaCog style={{fontSize:'18px', marginRight:'5px',marginBottom:'5px'}}/>
                                Configuración
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Button variant="" 
                            href="/Login" to="/Login"
                            style={{background:'rgb(20 67 114)', borderRadius:'25px'}}
                            onClick={this.cerrarSesion}>
                        <FiLogOut style={{color:'white'}}></FiLogOut></Button>
                    
                </Container>
            </Navbar>
            

</>)
    }
}
export default Menu