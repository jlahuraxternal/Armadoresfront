import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import  './Configuracion.css';
import {GetUsuario, GetArmador, GetTemporada, SetAyuda} from '../../../services/storage';
import {IoDocumentText} from "react-icons/io5";
import {FaQuestionCircle} from 'react-icons/fa';
import {FaChevronRight,FaChevronLeft} from 'react-icons/fa';
import {postObtenerCobrosFact, postObtenerListaGrupo} from '../../../services/apiservices';
import {postDetalleFacturaUsu} from '../../../services/apiservices';
import {postObtenerTemporadas} from '../../../services/apiservices';
import {postObtenerRazonSocial} from '../../../services/apiservices';
import {SetTemporada} from '../../../services/storage';
import Moment from 'react-moment';
import {alertController} from '../../../services/AlertMessage';
import Usuarios from '../Configuracion/Usuarios/Usuarios';
import Grupos from '../Configuracion/Grupos/Grupos';
import Cuotas from '../Configuracion/Cuotas/Cuotas';
import {postObtenerListaUsuario} from '../../../services/apiservices';
class Configuracion  extends React.Component{

    constructor(props){
        super(props);
        
        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0,10);
        
        console.log(dateActual)
        this.state = {
            estadoCard: 1,
            listaUsuarios:[],
            listaGrupos:[]
        };
    }

    async componentDidMount() {
        await this.ObtenerListaUsuarios(); 
        await this.ObtenerListaGrupos();   
    }


    CambiarOpcion=(codigo)=>{
        this.setState({estadoCard: codigo});
    }

    ObtenerListaGrupos(){
        return new Promise((resolve)=>{
            postObtenerListaGrupo().then((res)=>{
                    console.log("Lista Grupos", res);
                   if(res.ListaGrupo) {
                        this.setState({listaGrupos: res.ListaGrupo});
                   }
                   resolve(true);
            });
        })    
    }

    ObtenerListaUsuarios=()=>{
        return new Promise((resolve)=>{ 
            postObtenerListaUsuario().then((res)=>{
                    console.log(res);
                    this.setState({listaUsuarios:res.ListaUsuario});
                    resolve(true);
            });
        });     
    }
    render(){
    
        return(
                <>
                    
                    <Container  style={{maxWidth: "100%", background: 'linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)',
                    bottom: "0",
                    top: "0",
                    minHeight:'100vh'}}>
                        <Row>
                            <Col xs={0} md={4}>
                                <div className="css_div_pri">
                                    <div>
                                        <label style={{fontSize:'32px', fontWeight:'bold'}}>Configuración </label>
                                    </div>
                                    <div style={{display:'flex' }}>
                                    <Row style={{marginLeft:'0px', marginRight:'0', width:'100%'}}>
                                                <Col xs={6} md={6} style={{padding:'15px 10px 10px 0px'}}>
                                                    <Card style={{ width: '100%',
                                                                   borderRadius:'8px', 
                                                                   height:'140px', 
                                                                   background: this.state.estadoCard === 1? '#06426B':'#FFFFFF',
                                                                   color: this.state.estadoCard === 1? '#FFFFFF':'#184A7D'}}
                                                          onClick={()=>this.CambiarOpcion(1)}>
                                                        <Card.Body>
                                                            
                                                            <div style={{fontWeight:'bold', fontSize:'20px'}}>
                                                                <label style={{fontSize:'24px'}}>Usuarios</label>
                                                            </div>
                                                            <Card.Title style={{fontSize:'13px', fontWeight:'bold'}}>{this.state.listaUsuarios?this.state.listaUsuarios.length:0} usuarios</Card.Title>
                                                            
                                                            <div style={{fontSize:'12px'}}>
                                                                
                                                            </div>
                                                            
                                                        </Card.Body>
                                                    </Card>
                                                </Col>

                                                <Col xs={6} md={6} style={{padding:'15px 0px 10px 10px'}}>
                                                    <Card style={{ width: '100%', 
                                                                   borderRadius:'8px', 
                                                                   height:'140px',
                                                                   background: this.state.estadoCard === 2? '#06426B':'#FFFFFF',
                                                                   color: this.state.estadoCard === 2? '#FFFFFF':'#184A7D'}}
                                                          onClick={()=>this.CambiarOpcion(2)}>
                                                        <Card.Body>
                                                            <div style={{fontWeight:'bold', fontSize:'20px'}}>
                                                                <label style={{fontSize:'24px'}}>Grupos</label>
                                                            </div>
                                                            <Card.Title style={{fontSize:'13px', fontWeight:'bold'}}>{this.state.listaGrupos?this.state.listaGrupos.length:0} grupos</Card.Title>
                                                            
                                                            <div style={{fontSize:'12px', color:'#9CA5CA'}}>
                                                                
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>

                                                {/* <Col xs={6} md={6} style={{padding:'15px 10px 10px 0px'}}>
                                                    <Card style={{ width: '100%', 
                                                                   borderRadius:'8px', 
                                                                   height:'140px',
                                                                   background: this.state.estadoCard === 3? '#06426B':'#FFFFFF',
                                                                   color: this.state.estadoCard === 3? '#FFFFFF':'#184A7D'}}
                                                          onClick={()=>this.CambiarOpcion(3)}>
                                                        <Card.Body>
                                                            <div style={{fontWeight:'bold', fontSize:'20px'}}>
                                                                <label style={{fontSize:'24px'}}>Cuotas</label>
                                                            </div>
                                                            <Card.Title style={{fontSize:'12px', fontWeight:'bold'}}>0 cuotas</Card.Title>
                                                            
                                                            <div style={{fontSize:'12px', color:'#9CA5CA'}}>
                                                                
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col> */}
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            {/* Fin de Sub Configuraciones */}

                            <Col xs={12} md={8} style={{background:'#E0E5F0',minHeight:'100vh',top:'0',bottom:'0',right:'0',padding:'0'}}>
                                {this.state.estadoCard === 1 && <Usuarios/>}
                                {this.state.estadoCard === 2 && <Grupos/>}
                                {this.state.estadoCard === 3 && <Cuotas/>}
                            </Col>
                        </Row>
                    </Container>
                    
                </>
            );
    }

}
export default Configuracion