import React, { Component } from 'react'
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import  logoImg from '../../../images/tasa/logo.png';
import url from '../../../config/Config';
import {LoginIngreso} from '../../../services/apiservices';
import {SetUsuario, SetNickname} from '../../../services/storage';
import Swal from 'sweetalert2';
import { FaBeer } from 'react-icons/fa';
var imageName = require('../../../images/Frame.png');

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={
            us:'',
            pass:'',
            login:[]
        }
    }

    verificarLogin(us, pass){
        SetUsuario('nanequiroz@msn.com');
       console.log(pass) 
       LoginIngreso(us, pass).then((res)=>{
           if(res.id_mensaje=='1'){
            this.alertController('Error!', 'Usuario o contraseña incorrectos.')
           }else{
               localStorage.clear();
               SetUsuario(res.username);
               //SetUsuario(res.username);
               SetNickname(res.NickName);
               window.location.assign("/Inicio");
           }
            console.log(res);
        });
       
    }
    Ingresar=()=>{
        this.verificarLogin(this.state.us , this.state.pass)
    }

    alertController(titulo, mensaje){
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
    refreshPage() {
        window.location.reload(false);
      }

    getUsuario(e) {
        this.setState({us: e.target.value}); 
      }

    getPassword(e) {
        this.setState({pass: e.target.value}); 
     }


    handleSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.value);
        event.preventDefault();
    }
    render(){
        
    
        return(
            <>
            <Container  style={{maxWidth: "100%", background: 'linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)',
                bottom: "0",
                top: "0",
                position:'absolute'}}>
                <Row style={{height:"100%"}}>
                    <Col xs={0} md={5} style={{textAlign:'center', alignSelf:'flex-end',padding:0}}>
                        <img src={logoImg} style={{top:'300px', marginBottom:'100px', marginTop:'100px'}} />
                        <img src={imageName.default} style={{width:"100%",bottom: 0, position:'sticky'}}></img>
                    </Col>

                    <Col xs={12} md={7} style={{background:'#ffffff',top:'0',bottom:'0',right:'0', position:'absolute'}}>
                        <div style={{margin:'15%',padding:'10px'}} >
                            <br></br>
                            <h3 style={{color:'#9CA5CA', fontSize:'32px', lineHeight:'48px'}}>BIENVENIDO</h3>
                            <br></br>
                            <div className="form-group">
                                <label style={{color:'#020B2B'}}><b>Usuario</b></label>
                                <input style={{height:'50px'}}  className="form-control" placeholder="Enter email" value={this.state.us ? this.state.us:''} onChange={e => this.getUsuario(e)}/>
                            </div>

                            <div className="form-group">
                                <label style={{color:'#020B2B'}}><b>Contraseña</b></label>
                                <input style={{height:'50px'}} type="password" className="form-control" placeholder="Enter password" value={this.state.pass ? this.state.pass:''} onChange={e => this.getPassword(e)}/>
                            </div>

                            <div className="form-group" style={{display:'flex', justifyContent:'space-between', marginTop:'10px', marginBottom:'40px'}}>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label style={{fontSize:'16px'}} className="custom-control-label" htmlFor="customCheck1">Recordarme</label>
                                    
                                </div>
                                <p className="forgot-password text-right">
                                <b><a href="/Recuperar1" style={{ color: '#020B2B', textDecorationLine:'underline', fontSize:'14px' }}>¿Olvidaste tu contraseña?</a></b>
                                </p>
                            </div>

                            <button 
                                    className="btn btn-success btn-block"
                                    style={{background:"#8DBF4F", borderRadius:'4px', height:'50px', border:'0px'}} onClick={this.Ingresar}>
                                    INGRESAR
                            </button>
                            <br></br>
                            <p className="forgot-password text-center">
                                <b>¿Ingresas por primera vez? <a href="/Registrar" style={{ color: '#020B2B', textDecorationLine:'underline' }}>Regístrate</a></b>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }

}
export default Login