import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import  './Usuarios.css';
import {GetUsuario, GetArmador, GetTemporada, SetAyuda, GetCorreo} from '../../../../services/storage';
import {FaAngleDown} from "react-icons/fa";
import { FaUserAltSlash } from "react-icons/fa";
import {FaUserAlt} from "react-icons/fa";
import {IoAddOutline} from 'react-icons/io5';
import {IoPersonAdd} from 'react-icons/io5'
import {postObtenerListaGrupo, postObtenerListaUsuario, postRegistroUsuario} from '../../../../services/apiservices';
import {postActualizarEstadoUsuario} from '../../../../services/apiservices'; 
import {SetTemporada} from '../../../../services/storage';
import Moment from 'react-moment';
import {alertController} from '../../../../services/AlertMessage';

import Swal from 'sweetalert2';

class UsuariosConfi  extends React.Component{

    constructor(props){
        super(props);
        
        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0,10);
        
        console.log(dateActual)
        this.state = {
            filtroUsuario:'',
            listaFiltros:[],
            textoBuscar:'',
            isOpenEstado: false,
            isOpenUsuario: false,
            listaUsuarios:[],
            listaOriginal:[],
            listaDetalle:[],
            estado: 0,
            usuarioDet:{},
            inputCorreo:'',
            usuarioGrupo:{},
            puntero: 0,
            abierto:false
        };
        this.handleChangeCorreo = this.handleChangeCorreo.bind(this);
    }

    async componentDidMount() {
        var listaFil = ['Todos','Con Grupo', 'Sin Grupo', 'Habilitados','Inhabilitados'];
        this.setState({listaFiltros: listaFil});
        await this.ObtenerListaUsuarios();

        
    }

    handleShow = (user) => {
        console.log('handle Show',user)
        this.setState({isOpenEstado: true});
        this.setState({estado:user.Activo});
        this.setState({usuarioDet:user});
    }
    handleClose = () =>{
        this.setState({isOpenEstado: false});
    }
    handleConfirm = () =>{
        this.setState({isOpenEstado: false});
        var usuarioDetalle = this.state.usuarioDet;
        this.actualizarEstado(usuarioDetalle);
        
    }

    handleShowUsuario = (user) => {
        console.log('grupo seleccionado',user)
        this.setState({isOpenUsuario: true});
        this.setState({usuarioGrupo:user});
        this.setState({inputCorreo:''})
    }
    handleCloseUsuario = () =>{
        this.setState({isOpenUsuario: false});
    }
    handleConfirmUsuario = () =>{
        
        if(this.validar){
            this.registrarUsuario(this.state.usuarioGrupo.CodArmador,this.state.inputCorreo, GetUsuario(), this.state.usuarioGrupo.CodArmador, this.state.puntero);
            this.setState({isOpenUsuario: false});
        }else{
            Swal.fire("El correo tiene formato invalido");
        }
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    getBuscar(e) {
        console.log(e.target.value);
        this.setState({textoBuscar: e.target.value}); 

        let nuevaLista = this.state.listaOriginal.filter( data => {
            return data.Grupo.toLowerCase().includes(e.target.value.toLowerCase()) ||
                   data.RAZON_SOCIAL.toLowerCase().includes(e.target.value.toLowerCase()) ||
                   data.RUC.toLowerCase().includes(e.target.value.toLowerCase()) ||
                   data.Correo.toLowerCase().includes(e.target.value.toLowerCase());
        });
        console.log(nuevaLista);
        if(e.target.value !== ''){
            this.setState({listaUsuarios: nuevaLista});
        }else{
            this.setState({listaUsuarios: this.state.listaOriginal});
        }

    }

    CambiarFiltro=(codFiltro)=>{
        console.log(codFiltro);
        this.setState({filtroUsuario:codFiltro});

        if (codFiltro === 'Todos') {
            this.setState({listaUsuarios: this.state.listaOriginal});
        }

        if (codFiltro === 'Sin Grupo') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Grupo === '');
            console.log(nuevaLista);
            this.setState({listaUsuarios: nuevaLista});
        }

        if (codFiltro === 'Con Grupo') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Grupo !== '');
            console.log(nuevaLista);
            this.setState({listaUsuarios: nuevaLista});
        }

        if (codFiltro === 'Habilitados') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Activo === 0);
            console.log(nuevaLista);
            this.setState({listaUsuarios: nuevaLista});
        }

        if (codFiltro === 'Inhabilitados') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Activo === 1);
            console.log(nuevaLista);
            this.setState({listaUsuarios: nuevaLista});
        }

    }

    cambiarIcono=(user,detalle, index)=>{
        console.log("aqui", detalle);
        if (!detalle){
            detalle = [];
        }
        this.setState({listaDetalle:detalle});
        this.setState({puntero: index});
        this.setState({usuarioGrupo:user});
        this.setState({abierto: !this.state.abierto});

        //
    }

    ObtenerListaUsuarios(){
        return new Promise((resolve)=>{
            postObtenerListaUsuario().then((res)=>{
                   console.log('despues de registrar correo',res);
                    if(res.ListaUsuario){
                        this.setState({listaUsuarios:res.ListaUsuario});
                        this.setState({listaOriginal:res.ListaUsuario});
                    }
                    
                    resolve(true);
            });
        })    
    }

    actualizarEstado(usuarioP){
        console.log("actu Us",usuarioP);
        return new Promise((resolve)=>{
            postActualizarEstadoUsuario(this.state.usuarioGrupo.CodArmador, usuarioP.Correo,GetUsuario(),usuarioP.Activo ===0?1:0).then(async(res)=>{
                    console.log(res);
                    if(res.Success === true){
                        await this.ObtenerListaUsuarios();
                        this.setState({listaDetalle:this.state.listaUsuarios[this.state.puntero].ListDetalle});
                        alertController('Información', res.Message,1);
                    }else{
                        alertController('Error', res.Message,3);
                    }
                    resolve(true);
            });
        })    
    }

    registrarUsuario(codArm, correo, usuario, codArm2, index){
        return new Promise((resolve)=>{
            postRegistroUsuario(codArm, correo, usuario, codArm2).then(async (res)=>{
                    console.log(res);
                    if(res.Success === true){
                        
                        await this.ObtenerListaUsuarios();
                        this.setState({listaDetalle:this.state.listaUsuarios[index].ListDetalle});
                        alertController('Información', res.Message,1);
                    }else{
                        alertController('Error', res.Message,3);
                    }
                    resolve(true);
            });
        })    
    }

    obtenerLength=(detalle)=>{
        var det = [];
        det = det.push(detalle);
        console.log(det)
        if (!det || det === null){
            det = [];
        }
        return det.length;

    }

    handleChangeCorreo(event) {
        console.log(event.target.value)
        this.setState({inputCorreo: event.target.value});

        if (this.validateEmail(event.target.value)) {
            console.log("DISPONIBLE")
            this.validar = true;
            this.setState({inputCorreo: event.target.value});
            //this.correo=event.target.value;
            
        } else {
            console.log("NO DISPONIBLE")
            this.validar = false;
        }
    }
    
    render(){
        const filtros=this.state.listaFiltros;
        const listaUsu = this.state.listaUsuarios;
        const listaDetalle2 = this.state.listaDetalle;
        const puntero = this.state.puntero;
        const abierto = this.state.abierto;
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
                    <>
                    <Modal show={this.state.isOpenEstado} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title style={{textAlign:'center', padding:'10px', color:'#184A7D'}}>
                            { this.state.estado === 1 &&
                                <>
                                <div>
                                    <FaUserAlt style={{ fontSize: '50px', border: '1px solid #35cd32', borderRadius: '20px', padding: '5px' }} />
                                </div>
                                <div>
                                    ¿Está seguro que desea habilitar a este usuario?
                                </div>
                                </>
                                    
                            }
                            { this.state.estado === 0 &&
                                <>
                                <div>
                                    <FaUserAltSlash style={{ fontSize: '50px', border: '1px solid red', borderRadius: '20px', padding: '5px' }} />
                                </div>
                                <div>
                                    ¿Está seguro que desea inhabilitar a este usuario?
                                </div>
                                </>
                                    
                            }
                            
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{textAlign:'center', padding:'10px', color:'#184A7D'}}>
                            { this.state.estado === 0 &&
                                <div>
                                    Al hacerlo este no podrá ingresar a el aplicativo o visualizar su información
                                </div>
                            }
                            { this.state.estado === 1 &&
                                <div>
                                    Al hacerlo este podrá ingresar a el aplicativo y visualizar su información
                                </div>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="" style={{background:'#0076BC', color:'#FFFFFF'}} onClick={this.handleConfirm}>
                            Confirmar
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.isOpenUsuario} onHide={this.handleCloseUsuario}>
                        <Modal.Header closeButton>
                        <Modal.Title style={{textAlign:'center', padding:'10px', color:'#184A7D', width:'100%'}}>
                                <div>
                                    <IoPersonAdd style={{ fontSize: '50px', border: '1px solid #35cd32', borderRadius: '20px', padding: '5px' }} />
                                </div>
                                <div>
                                    Agregar Nuevo Usuario
                                </div>
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{textAlign:'left', padding:'10px', color:'#184A7D'}}>
                            <div>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Ingresar Correo Usuario</Form.Label>
                                <Form.Control type="email" placeholder="" value={this.state.inputCorreo} onChange={this.handleChangeCorreo}/>
                            </Form.Group>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseUsuario}>
                            Cancelar
                        </Button>
                        <Button variant="" style={{background:'#0076BC', color:'#FFFFFF'}} onClick={this.handleConfirmUsuario}>
                            Agregar
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <Container style={{padding:'0', margin:'0', maxWidth:'100%'}}>
                                    <div style={{padding:'2%',background:'#ffffff',paddingLeft:'5%', display:'flex', justifyContent:'space-between'}}>
                                        <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>Usuarios</label>
                                        
                                        <div style={{display:'flex'}}>
                                            <input style={{height:'30px', borderRadius:'15px', width:'300px', marginRight:'10px', background:'#E0E5F0'}}  className="form-control" placeholder="Buscar" value={this.state.textoBuscar ? this.state.textoBuscar:''} onChange={e => this.getBuscar(e)}/>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'10px',fontSize:'14px', height:'30px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                                    Filtrar por
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                            { filtros.map(item => 
                
                                                <Dropdown.Item onClick={()=>this.CambiarFiltro(item)} key={item}>{item}</Dropdown.Item>
                
                                                )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div> 
                                    <div style={{margin:'20px 3% 20px 3%'}}>
                                        <Row style={{color:'#576774', 
                                                    fontSize:'14px',
                                                    fontWeight:'bold', 
                                                    height:'50px', 
                                                    background:'#FFFFFF',
                                                    width:'100%',
                                                    margin: '0px',
                                                    textAlign:'center',
                                                    alignItems:'center',
                                                    borderRadius:'5px 5px 0px 0px'}}>
                                            <Col xs={1} style={{textAlign:'center'}}>GRUPO</Col>
                                            <Col xs={3} style={{textAlign:'center'}}>RAZÓN SOCIAL</Col>
                                            <Col xs={2} style={{textAlign:'center'}}>RUC</Col>
                                            <Col xs={3} style={{textAlign:'center'}}>EMAIL</Col>
                                            <Col xs={2} style={{textAlign:'left' , paddingLeft:'3.5%'}}>ESTADO</Col>
                                            <Col xs={1}></Col>
                                        </Row>
                                        <Accordion style={{height:'600px', overflow:'auto', borderRadius:'0px 0px 8px 8px'}}>
                                        { listaUsu.map((usuario,index) => 
                                            <Card style={{paddingRight:'0px'}}>
                                                <Card.Header style={{background: '#FFFFFF'}}>
                                                
                                                <div style={{display:'flex'}}>
                                                    <div style={{width:'100%'}}>
                                                        <Row style={{alignItems:'center', fontSize:'11.7px', color:'#576774'}}>
                                                            <Col xs={1} style={{textAlign:'center'}}> {usuario.Grupo} </Col>
                                                            <Col xs={3} style={{textAlign:'center'}}> {usuario.RAZON_SOCIAL} </Col>
                                                            <Col xs={2} style={{textAlign:'center'}}> {usuario.RUC}</Col>
                                                            <Col xs={3} style={{textAlign:'center'}}>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                { usuario.Correo && 
                                                                    <div style={{background:'#D7DEEC',textAlign:'center',    width: '88%', borderRadius:'8px', padding:'4px'}}>
                                                                        {usuario.Correo}
                                                                    </div>
                                                                } 
                                                                { !usuario.Correo && 
                                                                    <div>
                                                                        -
                                                                    </div>
                                                                }

                                                                    {usuario.ListDetalle && usuario.ListDetalle.length > 0 &&  <div style={{alignSelf:'center', background:'#295F96', color:'#FFFFFF', padding:'5px',borderRadius:'5px'}}>
                                                                         {usuario.ListDetalle? usuario.ListDetalle.length+1: 0}
                                                                    </div> } 

                                                                    {usuario.ListDetalle === null  && <div style={{alignSelf:'center'}}>
                                                                        <Button onClick={()=> this.handleShowUsuario(usuario)}
                                                                                            style={{padding:'0px', height:'20px',width:'100%', alignSelf:'center', background:'#D7DEEC', border:'none'}}>
                                                                            <IoAddOutline style={{verticalAlign:'initial', color:'rgb(41, 95, 150)', fontWeight:'bold', fontSize:'15px', paddingLeft:'2px', paddingRight:'2px'}}/>    
                                                                        </Button> 
                                                                    </div>  }  
                                                                
                                                                </div>
                                                                 
                                                            </Col>
                                                            <Col xs={2} style={{textAlign:'center',padding:'0px 3px 0px 3px'}}> 
                                                                
                                                                <div style={{padding:'5px', background: ((abierto&&(puntero)==index)? (usuario.ActivoOrigen === 0? '#74AE2A': '#FF0000'): usuario.Activo === 0? '#74AE2A': usuario.Activo === 1?'#FF0000':'#F39200'), color: '#FFFFFF', fontWeight:'500', borderRadius:'8px'}}>
                                                                    {(abierto&&(puntero)==index)? (usuario.ActivoOrigen === 0? 'habilitado': 'deshabilitado'): usuario.Activo === 0? 'habilitado': usuario.Activo === 1?'deshabilitado':'mixto'}
                                                                </div> 
                                                            </Col>
                                                            <Col xs={1} style={{padding:'0px 3px 0px 3px'}}>
                                                                {usuario.ListDetalle !== null &&
                                                                    <Accordion.Toggle as={Button}
                                                                            variant="link" eventKey={index+1} 
                                                                            style={{textAlign:'end'}}
                                                                            onClick={(item)=>{
                                                                                this.cambiarIcono(usuario,usuario.ListDetalle,index);
                                                                                console.log(item);
                                                                            }}
                                                                            >
                                                                        <FaAngleDown style={{fontSize:'20px'}}/>
                                                                    </Accordion.Toggle>
                                                                }
                                                                
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    
                                                </div>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={index+1} style={{overflowY:'auto',maxHeight:'500px'}}>
                                                    <>
                                                    { listaDetalle2.map((detalleUsu, index) =>
                                                    <Card.Body style={{padding:'0px', background:'#F4F6FB'}}>
                                                        <Card.Header style={{paddingTop:'10px',paddingBottom:'10px', background:'#F4F6FB'}}>
                                                        
                                                        <div style={{display:'flex'}}>
                                                            <div style={{width:'100%'}}>
                                                                <Row style={{alignItems:'center', fontSize:'11.7px', color:'#576774'}}>
                                                                    <Col xs={1} style={{padding:'0px 3px 0px 10px',textAlign:'center'}}> - </Col>
                                                                    <Col xs={3} style={{padding:'0px 3px 0px 3px'}}> {detalleUsu.RAZON_SOCIAL} </Col>
                                                                    <Col xs={2} style={{padding:'0px 3px 0px 3px'}}> {detalleUsu.RUC}</Col>
                                                                    <Col xs={3} style={{}}>
                                                                        <div style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
                                                                            { detalleUsu.Correo && 
                                                                                <div style={{background:'#D7DEEC',width:'88%',textAlign:'center', borderRadius:'8px', padding:'4px'}}>
                                                                                    {detalleUsu.Correo}
                                                                                </div>
                                                                            } 
                                                                            { !detalleUsu.Correo && 
                                                                                <div>
                                                                                    -
                                                                                </div>
                                                                            } 
                                                                            { listaDetalle2.length === index +1 &&
                                                                                <div style={{alignSelf:'center'}}>
                                                                                <Button onClick={()=> this.handleShowUsuario(usuario)}
                                                                                        style={{padding:'0px', width:'100%',height:'20px', alignSelf:'center', background:'#D7DEEC', border:'none'}}>
                                                                                    <IoAddOutline style={{verticalAlign:'initial', color:'rgb(41, 95, 150)', fontWeight:'bold', fontSize:'15px', paddingLeft:'2px', paddingRight:'2px'}}/>    
                                                                                </Button>
                                                                            </div>
                                                                            }
                                                                                  
                                                                        </div>
                                                                        
                                                                    </Col>
                                                                    <Col xs={2} style={{textAlign:'center',padding:'0px 3px 0px 3px'}}> 
                                                                        <Button onClick={()=>this.handleShow(detalleUsu)}
                                                                                style={{padding:'5px', 
                                                                                        background: detalleUsu.Activo === 0? '#74AE2A':detalleUsu.Activo === 1?'#FF0000':'#F39200', 
                                                                                        color: '#FFFFFF', 
                                                                                        fontWeight:'500', 
                                                                                        borderRadius:'7px',
                                                                                        border:'none',
                                                                                        fontSize:'11.7px',
                                                                                        width:'100%'}}>
                                                                            {detalleUsu.Activo === 0? 'habilitado': detalleUsu.Activo === 1?'deshabilitado':'mixto'}
                                                                        </Button>
                                                                        {/* <div style={{padding:'5px', background: detalleUsu.Activo === 0? '#74AE2A':detalleUsu.Activo === 1?'#FF0000':'#F39200', color: '#FFFFFF', fontWeight:'500', borderRadius:'8px'}}>
                                                                            {detalleUsu.Activo === 0? 'habilitado': detalleUsu.Activo === 1?'deshabilitado':'mixto'}
                                                                        </div>  */}
                                                                    </Col>
                                                                    
                                                                </Row>
                                                            </div>
                                                            
                                                        </div>
                                                        </Card.Header>
                                                        
                                                    </Card.Body>
                                                        
                                                    
                                                    )}
                                                    </>
                                                    
                                        
                                                </Accordion.Collapse>
                                            </Card>
                                        )}
                                        </Accordion> 
                                    </div>
                    </Container>  
                    </>
                    </Col>
                </Row>
            </Container>
            </>
                
            );
    }

}
export default UsuariosConfi