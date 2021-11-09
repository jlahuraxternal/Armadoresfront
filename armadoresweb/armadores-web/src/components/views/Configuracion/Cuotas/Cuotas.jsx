import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import  './Cuotas.css';
import {GetUsuario, GetArmador, GetTemporada, SetAyuda} from '../../../../services/storage';
import {FaAngleDown} from "react-icons/fa";
import {FaSort} from "react-icons/fa";
import {BsUpload} from "react-icons/bs";
import {SiMicrosoftexcel} from 'react-icons/si';
import {FaQuestionCircle} from 'react-icons/fa';
import {FaChevronRight,FaChevronLeft} from 'react-icons/fa';
import {postObtenerCobrosFact} from '../../../../services/apiservices';
import {postDetalleFacturaUsu} from '../../../../services/apiservices';
import {postObtenerTemporadas} from '../../../../services/apiservices';
import {postObtenerRazonSocial} from '../../../../services/apiservices';
import {SetTemporada} from '../../../../services/storage';
import Moment from 'react-moment';
import {alertController} from '../../../../services/AlertMessage';
import Form from 'react-bootstrap/Form';
class CuotasConfi  extends React.Component{

    constructor(props){
        super(props);
        
        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0,10);
        
        console.log(dateActual)
        this.state = {
            filtroUsuario:'',
            listaFiltros:[],
            listaCuotas:[],
            textoBuscar:'',
            isOpenCargar: false,
            nombreGrupo:'',
            cod_temporada_actual:'',
            temporada_actual:'',
            temporadas:[],
            archivos:[]
        };
    }

    CambiarTemporada=(codtemp,destemp)=>{
        console.log(codtemp,"-",destemp);
        this.setState({cod_temporada_actual:codtemp});
        this.setState({temporada_actual:destemp});

        SetTemporada(codtemp);
    }
    ObtenerTemporada(){
        return new Promise((resolve)=>{
            postObtenerTemporadas().then((res)=>{
                console.log('Temporadas', res)
                this.setState({temporadas:res});
                 this.setState({cod_temporada_actual:res[0].CodTemporada}) ;
                 this.setState({temporada_actual:res[0].DesTemporada}) ;
                 resolve(true)
             });
        });
    }
    async componentDidMount() {
        await this.ObtenerTemporada();
        var listaFil = ['Menos de 3 usuarios', 'Hasta 5 usuarios', 'Mas de 10 usuarios'];
        var listaCuo = [
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            },
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            },
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            },
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            },
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            },
            {
                matricula: 'CE-003-EH',
                nombre: 'RAUL M'
            }
        ];
        this.setState({listaCuotas: listaCuo});
        this.setState({listaFiltros: listaFil});
    }

    handleShow = () => {
        this.setState({isOpenCargar: true});
    }
    handleClose = () =>{
        this.setState({isOpenCargar: false});
    }

    getBuscar(e) {
        this.setState({textoBuscar: e.target.value}); 
    }

    getNombreGrupo(e) {
        this.setState({nombreGrupo: e.target.value}); 
    }

    CambiarFiltro=(codFiltro)=>{
        console.log(codFiltro);
        this.setState({filtroUsuario:codFiltro});
    }

    cambiarIcono=()=>{
    }

    onCheck(val) {
        console.log("target", val);
        
        const listaNueva = this.state.listaGrupos;
        for (let index = 0; index < listaNueva.length; index++) {
            const element = listaNueva[index];
            element.selected = false;  
        }
        
        listaNueva[val].selected = true;
        this.setState({listaGrupos: listaNueva});
    }
    eliminarGrupo(){
        alertController('¿Está seguro que desea eliminar el grupo?','Estos usuarios ya no podrán visualizar la información de otros usuarios dentro del grupo',2).then();
    }

    reset(event){
        // Limpia el target de Imagenes cuando seleccionamos el mismo archivo
        event.target.value = '';
    }
    selectFiles(event) {
        //this.progressInfo = [];
        //Validación para obtener el nombre del archivo si es uno solo
        //En caso de que sea >1 asigna a fileName length
        
        event.target.files.length == 1 ? this.fileName = event.target.files[0].name : this.fileName = event.target.files.length + " archivos";
        
        this.setState({archivos: Array.from(event.target.files)});
        
    }
    render(){
        const filtros = this.state.listaFiltros;
        const cuotas = this.state.listaCuotas;
        const temps=this.state.temporadas;
        return(
                <>
                    <Modal show={this.state.isOpenCargar} 
                        onHide={this.handleClose} 
                        centered
                        size="lg">
                        <Modal.Header closeButton>
                            <FaChevronLeft style={{alignSelf:'center', color:'#0076BC', fontSize:'17px', marginRight:'10px'}}/>
                            <Modal.Title style={{fontSize:'16px', color:'#0076BC'}}>
                                Cargar Cuotas
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{margin:'10px 4% 10px 4%'}}>
                                <div style={{textAlign:'center',display:'block'}}>
                                   <SiMicrosoftexcel style={{fontSize:'50px', color:'#9CA5CA'}}/>
                                   <label style={{color:'#184A7D', fontSize:'15px', display:'block', fontWeight:'bold', marginTop:'10px'}}>
                                       Para cargar masivamente las cuotas  debe subir un archivo de .xls
                                    </label>
                                </div>
                                <div style={{marginTop:'20px', textAlign:'center'}}>
                                    <div style={{padding:'0px 5px 0px 5px',background:'#E0E5F0',paddingLeft:'5%', display:'inline-flex', padding:'10px 5px 10px 5px'}}>
                                            <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>{this.state.temporada_actual}</label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                                    Cambiar
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                            { temps.map(item => 
                
                                                <Dropdown.Item onClick={()=>this.CambiarTemporada(item.CodTemporada,item.DesTemporada)} key={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
                
                                                )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                    </div>
                                    
                                </div>
                                <div style={{margin:'20px 5% 20px 5%', textAlign:'center'}}>
                                {/* <input type="file"  multiple  onClick="reset($event)" onChange="selectFiles($event)"></input> */}
                                        <Button  variant="primary" style={{background:'#0076BC'}}>
                                                     ADJUNTAR .XLS
                                        </Button>
                                </div>
                                <div style={{margin:'20px 5% 20px 5%', textAlign:'center'}}>
                                        <Button  variant="link" >
                                                     Descargar archivo .xls de base
                                        </Button>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose} style={{background:'#9CA5CA',border:'1px solid #9CA5CA', width:'200px'}}> Cerrar</Button>
        
                        </Modal.Footer>
                    </Modal>
                    <Container style={{padding:'0', margin:'0', maxWidth:'100%'}}>
                                    <div style={{padding:'2%',background:'#ffffff',paddingLeft:'5%', display:'flex', justifyContent:'space-between'}}>
                                        <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>Cuotas</label>
                                        <div style={{padding:'0px 5px 0px 5px',background:'#ffffff',paddingLeft:'5%', display:'flex'}}>
                                            <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>{this.state.temporada_actual}</label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                                    Cambiar
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                            { temps.map(item => 
                
                                                <Dropdown.Item onClick={()=>this.CambiarTemporada(item.CodTemporada,item.DesTemporada)} key={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
                
                                                )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div style={{display:'flex'}}>
                                            <input style={{height:'30px', borderRadius:'15px', width:'200px', marginRight:'10px', background:'#E0E5F0'}}  className="form-control" placeholder="Buscar" value={this.state.textoBuscar ? this.state.textoBuscar:''} onChange={e => this.getBuscar(e)}/>
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
                                    

                                    <div style={{margin:'20px 5% 20px 5%',color:'#184A7D', fontSize:'12px', fontWeight:'bold', textAlign:'end'}}>
                                        <FaSort/>
                                                    ORDENAR
                                    </div>

                                    <div style={{margin:'20px 5% 20px 5%'}}>
                                        <Row style={{color:'#576774', 
                                                    fontSize:'14px',
                                                    fontWeight:'bold', 
                                                    height:'50px', 
                                                    background:'#FFFFFF',
                                                    width:'100%',
                                                    margin: '0px',
                                                    textAlign:'center',
                                                    alignItems:'center'}}>
                                            <Col>Nro.</Col>
                                            <Col>MATRICULA</Col>
                                            <Col>NOMBRE EP</Col>
                                            <Col>C.BOD</Col>
                                            <Col>GRUPO EMPRESA</Col>
                                            <Col>PMCE</Col>
                                            <Col>LMCE</Col>
                                            <Col>Clase EP</Col>
                                            <Col xs={1}>Temp</Col>
                                            <Col xs={1}>COD</Col>
                                        </Row>
                                        <div style={{maxHeight:'550px', overflow:'auto'}}>
                                            { cuotas.map((item, index) => 
                                                
                                                <Row style={{alignItems:'center',
                                                        width:'100%',
                                                        margin:'0px',
                                                        padding: '10px 0px 10px 0px',
                                                        background: index % 2 === 1? '#F4F6FB':'#FFFFFF',
                                                        color:'#576774',
                                                        textAlign:'center'
                                                    }}>
                                                    <Col> {index + 1}</Col>
                                                    <Col> {item.matricula}</Col>
                                                    <Col> {item.nombre}</Col>
                                                    <Col>227.10</Col>
                                                    <Col>Quijano Raul</Col>
                                                    <Col>0.0001554</Col>
                                                    <Col>4097.40</Col>
                                                    <Col>200.30</Col>
                                                    <Col xs={1}>45</Col>
                                                    <Col xs={1}>9958</Col>
                                                </Row> 
                                            )}               
                                        </div>
                                        
                                    </div>
                                    <div style={{margin:'20px 5% 20px 5%', textAlign:'end'}}>
                                        <Button  onClick={()=>this.handleShow()} 
                                                 variant="primary" style={{background:'#0076BC'}}>
                                                     <BsUpload style={{fontSize:'25px', marginRight:'5px'}}/>
                                                     CARGAR CUOTAS
                                        </Button>
                                    </div>
                                    

                    </Container>  
                </>
            );
    }

}
export default CuotasConfi