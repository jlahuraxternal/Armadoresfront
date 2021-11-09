import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import  logoImg from '../../../images/tasa/logo.png';
import url from '../../../config/Config';
import apiLogin from '../../../services/apiservices';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import  './CuentasCobrar.css';
import {GetUsuario, GetArmador, GetTemporada, SetAyuda, GetTipoSeleccion} from '../../../services/storage';
import Menu from '../../layouts/menu';
import {IoBoat} from "react-icons/io5";
import {IoDocumentText} from "react-icons/io5";
import {IoBagCheck} from "react-icons/io5";
import {FaQuestionCircle} from 'react-icons/fa';
import {FaSort} from 'react-icons/fa';
import {FaChevronRight,FaChevronLeft} from 'react-icons/fa';
import {postObtenerCobrosFact} from '../../../services/apiservices';
import {postDetalleFacturaUsu} from '../../../services/apiservices';
import {postObtenerTemporadas} from '../../../services/apiservices';
import {postObtenerRazonSocial} from '../../../services/apiservices';
import {SetTemporada} from '../../../services/storage';
import Moment from 'react-moment';
import {alertController} from '../../../services/AlertMessage';
import id from 'date-fns/esm/locale/id/index.js';
class CuentasCobrar  extends React.Component{

    constructor(props){
        super(props);
        
        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0,10);
        
        console.log(dateActual)
        this.state = {
            isOpenDetalleCobrar: false,
            isOpenTemporada: false,
            fechaInicio: dateActual,
            fechaFin: dateActual,
            temporadas:[],
            listaEmpresas:[],
            cod_armador_actual:'',
            cod_temporada_actual:'',
            temporada_actual:'Seleccionar temporada',
            factura_registradas:[],
            factura_en_proceso:[],
            total_reg:0,
            total_proc:0,
            detallefact:[],
            listadesc:[],
            estadoActual:''
        };
    }

    async componentDidMount() {
        await this.ObtenerTemporada();
        await this.ObtenerRazonSocial(GetUsuario());
        this.cargarTodasLasFacturas()
    }

    diferenciaDiasFechas(fechaMe, fechaMa){
        var day1 = new Date(fechaMe);
        var day2 = new Date(fechaMa);
        var difference = day2.getDay()-day1.getDay();
        return difference;
    }

    cargarTodasLasFacturas(){
        if(this.state.temporadas.length === 0){
            alertController('Información','Lista de temporadas vacía.', 4);
            return;
        }
        if(this.state.listaEmpresas.length === 0){
            alertController('Información','Lista de empresas vacía.', 4);
            return;
        }

        this.setState({factura_registradas: []});
        this.setState({factura_en_proceso: []});


        this.ObtenerCobrosFacturas('X','X',"X","X",GetArmador(),GetTemporada(),"X",GetTipoSeleccion());
                    
        var temp = this.state.temporadas.find(data => data.CodTemporada === GetTemporada());

        if(temp){
            this.setState({cod_temporada_actual: temp.CodTemporada});
            this.setState({temporada_actual: temp.DesTemporada})
        }
        /* this.state.temporadas.forEach(element => {
            const temporada = element;
            this.state.listaEmpresas.forEach( async(element) =>{
                const empresa = element;
                await this.ObtenerCobrosFacturas('X','X',"X","X",empresa.COD_ARMADOR,temporada.CodTemporada,"X");
            });        
        }); */
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

    CambiarTemporada=(codtemp,destemp)=>{
        console.log(codtemp,"-",destemp);
        this.setState({cod_temporada_actual:codtemp});
        this.setState({temporada_actual:destemp});

        this.setState({factura_registradas: []});
        this.setState({factura_en_proceso: []});

        this.ObtenerCobrosFacturas('X','X',"X","X",GetArmador(),codtemp,"X", GetTipoSeleccion());
        
        SetTemporada(codtemp);
        /* this.state.listaEmpresas.forEach( element =>{
                const empresa = element;
                this.ObtenerCobrosFacturas('X','X',"X","X",empresa.COD_ARMADOR,codtemp,"X");
        });  */ 
    }

    CambiarTemporada2 = (event) =>{
        console.log(event.target.value);
        this.setState({cod_temporada_actual:event.target.value});
        //this.setState({temporada_actual:destemp});
    }

    ObtenerCobrosFacturas(fechaini,fechafin,anio,mes,armador,temporada,estado,tipoSel){
       
        if (fechaini !== 'X'){
            fechaini = fechaini.split('-').reverse().join('/');
        }
        if (fechafin !== 'X'){
            fechafin = fechafin.split('-').reverse().join('/');
        }
        /* console.log('Fecha Inicial par des', fechaini);
        console.log('Fecha Fin par des', fechafin);
        console.log('Cod Armador', armador)
        console.log('temporada', temporada) */
        return new Promise((resolve)=>{
            postObtenerCobrosFact('X','X',anio,mes,armador,temporada,estado,tipoSel).then((res)=>{
                 console.log("facturas reg y pro", res)
                 var registradas = res.filter(data => data.Estado === 'R');
                 var procesos = res.filter(data => data.Estado !== 'R');

                 
                 var nuevoReg = this.state.factura_registradas;

                 registradas.forEach(element => {
                     var valor = nuevoReg.find( data => data.Cod_Factura === element.Cod_Factura)
                     if(!valor){
                         nuevoReg.push(element);
                     }
                 });
            
                 if(registradas.length > 0){
                    this.setState({factura_registradas: nuevoReg});
                 }
                 
                 var nuevoPro = this.state.factura_en_proceso;
                 procesos.forEach(element => {
                    var valor = nuevoPro.find( data => data.Cod_Factura === element.Cod_Factura)
                    if(!valor){
                        nuevoPro.push(element);
                    }
                 });

                 if(procesos.length > 0){
                     this.setState({factura_en_proceso: nuevoPro});
                 } 

                 //this.setState({factura_registradas: res.filter(data => data.Estado === 'R')});
                 //this.setState({factura_en_proceso: res.filter(data => data.Estado !== 'R')});
                 this.calcularTotales();
                 resolve(true)
             });
        });      
     }

    calcularTotales(){
        let tr=0;
        for(var i=0;i<this.state.factura_registradas.length;i++){
                tr=tr+parseFloat(this.state.factura_registradas[i].Monto);
        }
        this.setState({total_reg:tr.toLocaleString('en')});

        let tp=0;
        for(var i=0;i<this.state.factura_en_proceso.length;i++){
            tp=tp+parseFloat(this.state.factura_en_proceso[i].Monto);
        }
        this.setState({total_proc:tp.toLocaleString('en')});

    }

    ObtenerDetalleFacturas(fact,armador,temporada){
        return new Promise((resolve)=>{
            postDetalleFacturaUsu(fact,armador,temporada).then((res)=>{
                 console.log(res);
                 this.setState({detallefact:res});
                 this.setState({listadesc:res.ListaDesc});
                 resolve(true)
             });
        });      
     }

     ObtenerRazonSocial(us){
        return new Promise((resolve)=>{
            postObtenerRazonSocial(us).then((res)=>{
                console.log('Razon social', res)
                if(res.ListaEmpresas.length>0){
                    this.setState({listaEmpresas:res.ListaEmpresas});
                }
                
                resolve(true);
                 
             });
        }); 
        
     }

    handleShow = (item,fact, estado) => {
        console.log("Item Detalle",item)
        this.ObtenerDetalleFacturas(fact,item.Cod_Armador,GetTemporada());
        this.setState({isOpenDetalleCobrar: true});
        this.setState({estadoActual:estado})
    }
    handleClose = () =>{
        this.setState({isOpenDetalleCobrar: false});
    }

    handleShowTemporada = () => {
        this.setState({isOpenTemporada: true});
    }
    handleCloseTemporada = () =>{
        this.setState({isOpenTemporada: false});

        //this.setState({factura_registradas: []});
        //this.setState({factura_en_proceso: []});

        
        this.state.listaEmpresas.forEach( element =>{
                const empresa = element;
                
                this.ObtenerCobrosFacturas(this.state.fechaInicio,this.state.fechaFin,"X","X",empresa.COD_ARMADOR,this.state.cod_temporada_actual,"X","X");
        });        
        
    }
    
    onChangeFechaInicio =(e) =>{
        this.setState({fechaInicio: e.target.value});
    }

    onChangeFechaFin =(e) =>{
        this.setState({fechaFin: e.target.value});
    }

    resetValores=() =>{
        var date = new Date();
        var dateActual = date.toISOString().substr(0,10);
        this.setState({fechaInicio: dateActual});
        this.setState({fechaFin: dateActual});
    }
    TotalDescarga=(descargas)=>{
        var total = 0;
        descargas.forEach(element => {
            total = total + parseFloat(element.TON_DESC);
        });
        return new Intl.NumberFormat('ES-MX').format(Number.parseFloat(total).toFixed(2));
    }

    ordenarFacturas=(tipo)=>{

        switch(tipo){

            case 1:
                var facturas = this.state.factura_registradas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.Fecha_emision < element.Fecha_emision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_registradas: facturas});
                console.log(facturas);
                return;

            case 2:
                var facturas = this.state.factura_registradas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.Fecha_emision > element.Fecha_emision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_registradas: facturas});
                console.log(facturas);
                return;    
            case 3:
                var facturas = this.state.factura_registradas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(parseFloat(element2.Monto) > parseFloat(element.Monto)){
                            console.log("es mayor")
                            var aux = element2;
                            facturas[index2] = element;
                            facturas[index1] = aux;
                        }

                    }
                }
                this.setState({factura_registradas: facturas});
                console.log(facturas);
                return;
            case 4:
                var facturas = this.state.factura_registradas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(parseFloat(element2.Monto) < parseFloat(element.Monto)){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_registradas: facturas});
                console.log(facturas);
                return;

            
        }
    }

    ordenarFacturasProceso=(tipo)=>{

        switch(tipo){

            case 1:
                var facturas = this.state.factura_en_proceso;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.Fecha_emision < element.Fecha_emision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_en_proceso: facturas});
                return;

            case 2:
                var facturas = this.state.factura_en_proceso;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.Fecha_emision > element.Fecha_emision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_en_proceso: facturas});
                return;    
            case 3:
                var facturas = this.state.factura_en_proceso;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(parseFloat(element2.Monto) > parseFloat(element.Monto)){
                            console.log("es mayor")
                            var aux = element2;
                            facturas[index2] = element;
                            facturas[index1] = aux;
                        }

                    }
                }
                this.setState({factura_en_proceso: facturas});
                return;
            case 4:
                var facturas = this.state.factura_en_proceso;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(parseFloat(element2.Monto) < parseFloat(element.Monto)){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({factura_en_proceso: facturas});
                return;

            
        }
    }

    convertDateFormat(fechaA) {
        var fecha = fechaA.substr(0,10);
        return fecha;
    }

    openayuda=()=>{
        SetAyuda("CuentasCobrar");
        let path = `/Ayuda`;
        this.props.history.push(path);
    }

    render(){
        const fact_reg=this.state.factura_registradas;
        const fact_proc=this.state.factura_en_proceso;
        const lista_desc=this.state.listadesc;
        const temps=this.state.temporadas;

        return(
                <>
                    {/* <Modal centered
                           show={this.state.isOpenTemporada}
                           onHide={this.handleCloseTemporada}
                           size="md">
                        <Modal.Body>
                            <div style={{color:'#184A7D', fontSize:'20px', fontWeight:'bold', marginTop:'10px', marginBottom:'15px'}}>
                                Temporada
                            </div>
                            
                            <Form.Group controlId="exampleForm.ControlSelect1"
                                        style={{width:'100%', border:'1px solid #9CA5CA', borderRadius:'5px', height:'50px'}}>
                                <Form.Control as="select"
                                              defaultValue="0"
                                              onChange={this.CambiarTemporada2}
                                              style={{fontWeight:'bold',background:'transparent', borderRadius:'5px',fontSize:'12px', height:'48px',width:'100%', padding:'0px 10px 0px 5px', border:'1px solid transparent', color:'#184A7D', textAlign:'end'}}>
                                    <option value="0">Seleccionar</option>
                                    { temps.map(item =>
                                        <option  key={item.CodTemporada} value={item.CodTemporada}>{item.DesTemporada}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <div style={{color:'#184A7D', fontSize:'20px', fontWeight:'bold', marginTop:'30px'}}>
                                Rango de fechas
                            </div>

                            <div style={{fontSize:'14px', color:'#576774', fontWeight:'bold', marginTop:'15px', marginBottom:'10px'}}>Desde</div>
                            <div>
                                <input  style={{width:'100%', height:'50px', borderRadius:'5px', border:'1px solid #9CA5CA',padding:'5px', color:'#606060'}}
                                        type="date" name="fechaInicio" 
                                        placeholder="dd/mm/yyyy" value={this.state.fechaInicio}
                                        onChange={this.onChangeFechaInicio}
                                        min="1997-01-01" max="2050-12-31"/>
                            </div>

                            <div style={{fontSize:'14px', color:'#576774', fontWeight:'bold', marginTop:'15px', marginBottom:'10px'}}>Hasta</div>
                            <div>
                                <input  style={{width:'100%', height:'50px', borderRadius:'5px', border:'1px solid #9CA5CA',padding:'5px',color:'#606060'}}
                                        type="date" name="begin" 
                                        placeholder="dd/mm/yyyy" value={this.state.fechaFin}
                                        onChange={this.onChangeFechaFin}
                                        min="01/01/1990" max="12/01/2050"/>
                            </div>

                            <div style={{width:'100%', margin:'5% 0px 10px 0px', textAlign:'center'}}>
                                <Button onClick={this.resetValores}
                                        style={{background:'transparent', color:'#0076BC', border:'transparent', margin:'0px 4% 0px 4%', fontWeight:'bold'}}>
                                    <label style={{textDecoration:'underline', marginBottom:'0px'}}>Borrar</label>
                                </Button>
                                <Button onClick={this.handleCloseTemporada}
                                        style={{background:'#76A140', border:'#76A140'}}> 
                                    <label style={{marginBottom:'0px'}}>Continuar</label>
                                </Button>
                            </div>
                            
                        </Modal.Body>   
                    </Modal> */}

                    <Modal show={this.state.isOpenDetalleCobrar} 
                        onHide={this.handleClose} 
                        centered
                        size="lg">
                        <Modal.Header closeButton>
                            <FaChevronLeft style={{alignSelf:'center', color:'#0076BC', fontSize:'17px', marginRight:'10px'}}/>
                            <Modal.Title style={{fontSize:'16px', color:'#0076BC'}}>
                                Factura {this.state.detallefact.Factura}
                            </Modal.Title>
                            <div style={{background:'#F8E9D2', borderRadius:'10px', color:'#F39200', marginLeft:'15px', fontSize:'12px',alignSelf:'center'}}>
                                <label style={{margin:'0px', padding:'4px 10px 4px 10px'}}>{this.state.estadoActual}</label> 
                                
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{width:'100%'}}>
                                <Row style={{margin:'0px 3% 0px 3%'}}>
                                    <Col xs={12} md={6}>
                                        <div style={{color:'#576774', fontWeight:'bold', fontSize:'20px'}}>
                                            $
                                            <label style={{fontSize:'24px',paddingLeft:'5px'}}>{new Intl.NumberFormat('ES-MX').format(Number.parseFloat(this.state.detallefact.Monto).toFixed(2))}</label>
                                        </div>
                                        <div style={{fontSize:'12px', color:'#020B2B', fontStyle:'normal', fontWeight:'normal'}}>
                                            TN factura: {new Intl.NumberFormat('ES-MX').format(Number.parseFloat(this.state.detallefact.Descarga).toFixed(2))} TN
                                        </div>
                                        <hr style={{background:'rgb(232,232,232)'}}/>
                                        <div>
                                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774'}}>
                                                <label>Barco</label>
                                                <label>{this.state.detallefact.Nombre_Emb}</label>
                                            </div>
                                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774'}}>
                                                <label>
                                                    Fecha de emisión</label>
                                                <label>
                                                    <Moment format="DD/MM/YYYY">
                                                        {this.state.detallefact.Fecha_emision}
                                                    </Moment>
                                                </label>
                                            </div>
                                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774'}}>
                                                <label>Matrícula</label>
                                                <label>{this.state.detallefact.Matricula}</label>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col xs={12} md={6}>
                                        <hr className="css_lin_des"/>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774', fontWeight:'bold', marginBottom:'10px'}}>
                                                <label>TN descargadas total</label>
                                                <label>{this.TotalDescarga(lista_desc)} TN</label>
                                        </div>
                                        {lista_desc.map(ld=>
                                            {ld.TON_DESC !== '0' && id.TON_DESC !== '' && <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774', marginBottom:'10px'}}>
                                                                <label>TN descargada 
                                                                    <Moment format="DD/MM/YYYY" style={{marginLeft:'5px'}}>
                                                                        {ld.BLDAT}
                                                                    </Moment>
                                                                </label>
                                                                <label>{new Intl.NumberFormat('ES-MX').format(Number.parseFloat(ld.TON_DESC).toFixed(2))} TN</label>
                                                             </div>
                                            }
                                        )}
                                    </Col>
                                    
                                </Row>
                                
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div style={{width:'100%'}}>
                                <Row style={{margin:'0px 3% 0px 3%'}}>  
                                    <Col xs={12} md={6}>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:this.diferenciaDiasFechas(this.state.detallefact.Fecha_Pago,this.state.detallefact.Fecha_emision) <=3?'rgb(134 189 74)': '#EE4266', marginBottom:'10px', fontWeight:'bold'}}>
                                                    <label>Fecha de pago</label>
                                                    {this.state.detallefact.Fecha_Pago !== '' && <label>
                                                        <Moment format="DD/MM/YYYY">
                                                        {this.state.detallefact.Fecha_Pago}
                                                        </Moment>
                                                    </label>}
                                                    {this.state.detallefact.Fecha_Pago === '' &&<label> - </label>}
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774', marginBottom:'10px'}}>
                                                <label>Fecha de recepción</label>
                                                {this.state.detallefact.Fecha_Pago !== '' && <label>
                                                        <Moment format="DD/MM/YYYY">
                                                        {this.state.detallefact.Fecha_Pago}
                                                        </Moment>
                                                    </label>}
                                                {this.state.detallefact.Fecha_Pago === '' &&<label> - </label>}
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', color:'#576774', marginBottom:'10px'}}>
                                                <label>Fecha de contabilización</label>
                                                {this.state.detallefact.Fecha_Conta !== '' && <label>
                                                        <Moment format="DD/MM/YYYY">
                                                        {this.state.detallefact.Fecha_Conta}
                                                        </Moment>
                                                    </label>}
                                                {this.state.detallefact.Fecha_Conta === '' &&<label> - </label>}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            <Button onClick={this.handleClose}> cerrar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* <Menu/> */}

                    <Container  style={{maxWidth: "100%", background: 'linear-gradient(168.95deg, #A6DA64 10.47%, #95C657 93.95%)',
                    bottom: "0",
                    top: "0",
                    minHeight:'100vh'}}>
                        <Row>
                            <Col xs={0} md={4}>
                                <div className="css_div_pri">
                                    <div>
                                        <label style={{fontSize:'32px', fontWeight:'bold'}}>Cuentas por cobrar </label>
                                    </div>
                                    <div style={{display:'flex' }}>
                                    <Row style={{marginLeft:'0px', marginRight:'0', width:'100%'}}>
                                                <Col xs={6} md={6} style={{padding:'15px 10px 10px 0px'}}>
                                                    <Card style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',borderRadius:'8px'}}>
                                                        <Card.Body>
                                                            <div style={{width:'30px', height:'30px', background:'#F8E9D2', borderRadius:'8px', textAlign:'center'}}>
                                                                <IoDocumentText style={{borderRadius:'8px', color:'#F39200',fontSize:'20px'}}/>
                                                            </div>
                                                            <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'20px'}}>
                                                                <label style={{fontSize:'24px'}}>{this.state.factura_registradas.length} facturas</label>
                                                            </div>
                                                            <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Registradas</Card.Title>
                                                            
                                                            <div style={{fontSize:'12px', color:'#9CA5CA'}}>
                                                                $ {this.state.total_reg}
                                                            </div>
                                                            
                                                        </Card.Body>
                                                    </Card>
                                                </Col>

                                                <Col xs={6} md={6} style={{padding:'15px 0px 10px 10px'}}>
                                                    <Card style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',borderRadius:'8px'}}>
                                                        <Card.Body>
                                                            <div style={{width:'30px', height:'30px', background:'#D6F6C2', borderRadius:'8px', textAlign:'center'}}>
                                                                <IoDocumentText style={{background:'#D8F2FF',borderRadius:'8px', color:'#69BC36',fontSize:'20px'}}/>
                                                            </div>

                                                            <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'20px'}}>
                                                                <label style={{fontSize:'24px'}}>{this.state.factura_en_proceso.length} facturas</label>
                                                            </div>
                                                            <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>En proceso</Card.Title>
                                                            
                                                            <div style={{fontSize:'12px', color:'#9CA5CA'}}>
                                                                $ {this.state.total_proc}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                        </Row>
                                    </div>

                                    <div className="css_des_cue">
                                        <label style={{fontSize:'14px', lineHeight:'20px',fontWeight:'bold',marginTop:'20px'}}>
                                            Registradas: facturas recibidas por Tasa que ún no forman parte de una liquidación
                                        </label>

                                        <label style={{fontSize:'14px', lineHeight:'20px',fontWeight:'bold',  marginTop:'20px'}}>
                                            En proceso: Facturas recibidas y procesadas, ya forman parte de una liquidación
                                        </label>

                                    </div>
                                </div>

                                <div className="css_div_pri2">
                                    <div>
                                        <label style={{fontSize:'14px', fontStyle:'normal', lineHeight:'20px',marginBottom:'0px'}}>¿Necesitas comunicarte con nosotros?</label>
                                    </div>
                                    <div>
                                        <label style={{fontSize:'14px'}}>Estamos a tu disposición</label>
                                    </div>
                                    <Button style={{background:'#0076BC', borderRadius:'20px',fontSize:'14px'}} onClick={this.openayuda}>
                                        
                                        Ayuda
                                        <FaQuestionCircle style={{fontSize:'20px', marginLeft:'10px'}}/>
                                    </Button>
                                </div>
                                
                            </Col>
                            <Col xs={12} md={8} style={{background:'#E0E5F0',minHeight:'100vh',top:'0',bottom:'0',right:'0',padding:'0'}}>
                                <Container style={{padding:'0', margin:'0', maxWidth:'100%'}}>
                                    <div style={{padding:'2%',background:'#ffffff',paddingLeft:'5%', display:'flex'}}>
                                        <label style={{color:'#184A7D', fontSize:'14px', fontWeight:'bold',marginRight:'10px',marginBottom:'0px', alignSelf:'center'}}>{this.state.temporada_actual}</label>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'13px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                                Cambiar
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.ItemText style={{color:'#9CA5CA', fontSize:'14px'}}>Elegir temporada</Dropdown.ItemText>
                                                { temps.map(item => 
                
                                                <Dropdown.Item  style={{fontSize:'13px'}}
                                                                onClick={()=>this.CambiarTemporada(item.CodTemporada,item.DesTemporada)} key={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
                
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    <Row style={{margin:'0'}}>
                                        <Col className="css_col_des1" xs={12} md={6} >
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <div style={{color:'#576774', fontSize:'14px', fontWeight:'normal', paddingBottom:'10px'}}>Registradas</div>
                                                {/* <div style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>
                                                    <FaSort/>
                                                    ORDENAR
                                                </div> */}

                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic" 
                                                                    style={{fontWeight:'bold',background:'transparent', borderRadius:'15px',fontSize:'12px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid transparent', color:'#184A7D'}}>
                                                        ORDENAR
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturas(1)} key="1">Por fecha: Más cercano</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturas(2)} key="2">Por fecha: Más lejano</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturas(3)} key="3">Por monto: Mayor a menor</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturas(4)} key="4">Por monto: Menor a mayor</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                        
                                            </div>
                                            <div style={{height:'700px', overflowY:'auto'}}>
                                                
                                                { fact_reg.map(fr => 
                                                <Card onClick={()=>this.handleShow(fr, fr.Cod_Factura,'Registrada')} 
                                                    style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7', marginBottom:'15px', borderRadius:'10px'}} key={fr.Cod_Factura}>
                                                    <Card.Body>
                                                        <div style={{display:'flex',justifyContent:'space-between'}}> 
                                                            <label style={{color:'#184A7D', fontSize:'16px',fontWeight:'bold', marginBottom:'0px'}}>Factura {fr.Cod_Factura}</label>
                                                            <label style={{marginBottom:'0px'}}>
                                                                <FaChevronRight style={{color:'#0076BC',fontSize:'15px'}}/>
                                                            </label>
                                                        </div>
                                                        <div style={{color:'#9CA5CA', fontWeight:'bold',fontSize:'16px'}}>
                                                            Monto $ {new Intl.NumberFormat('ES-MX').format(fr.Monto)}
                                                        </div>
                                                        <Row style={{marginTop:'20px'}}>
                                                            <Col>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold', marginRight:'4px'}}>F.emisión</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060'}}>
                                                                    <Moment format="DD/MM/YYYY">
                                                                        {fr.Fecha_emision}
                                                                    </Moment>
                                                        
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold',marginRight:'4px'}}>Descarga</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060'}}>{new Intl.NumberFormat('ES-MX').format(Number.parseFloat(fr.Descarga).toFixed(2))} TN</label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{alignSelf:'center'}}>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold', marginBottom:'0px'}}>Barco</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060', marginBottom:'0px'}}>{fr.Matricula}</label>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div style={{textAlign:'center', borderRadius:'15px', background:'#F8E9D2'}}>
                                                                    <label style={{color:'#F39200', fontSize:'12px', fontWeight:'bold'}}>Registrada</label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                                )}
                                            </div>
                                            
                                        </Col>
                                        <Col xs={12} md={6} className="css_col_fac">
                                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                                <div style={{color:'#576774', fontSize:'14px', fontWeight:'normal', paddingBottom:'10px'}}>En proceso</div>
                                                {/* <div style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>
                                                    <FaSort/>
                                                    ORDENAR
                                                </div> */}
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic" 
                                                                    style={{fontWeight:'bold',background:'transparent', borderRadius:'15px',fontSize:'12px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid transparent', color:'#184A7D'}}>
                                                        ORDENAR
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturasProceso(1)} key="1">Por fecha: Más cercano</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturasProceso(2)} key="2">Por fecha: Más lejano</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturasProceso(3)} key="3">Por monto: Mayor a menor</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>this.ordenarFacturasProceso(4)} key="4">Por monto: Menor a mayor</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>

                                            <div style={{height:'700px', overflowY:'auto'}}>
                                                { fact_proc.map(fp => 
                                                <Card   onClick={()=>this.handleShow(fp,fp.Cod_Factura, 'En proceso')}
                                                        style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7', marginBottom:'15px', borderRadius:'10px'}} key={fp.Cod_Factura}>
                                                    <Card.Body>
                                                        <div style={{display:'flex',justifyContent:'space-between'}}> 
                                                            <label style={{color:'#184A7D', fontSize:'16px',fontWeight:'bold', marginBottom:'0px'}}>Factura {fp.Cod_Factura}</label>
                                                            <label style={{marginBottom:'0px'}}>
                                                                <FaChevronRight style={{color:'#0076BC',fontSize:'15px'}}/>
                                                            </label>
                                                        </div>
                                                        <div style={{color:'#9CA5CA', fontWeight:'bold',fontSize:'16px'}}>
                                                            Monto $ {new Intl.NumberFormat('ES-MX').format(Number.parseFloat(fp.Monto).toFixed(2))}
                                                        </div>
                                                        <Row style={{marginTop:'20px'}}>
                                                            <Col>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold', marginRight:'4px'}}>F.emisión</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060'}}>
                                                                    <Moment format="DD/MM/YYYY">
                                                                        {fp.Fecha_emision}
                                                                    </Moment>
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold', marginRight:'4px'}}>Descarga</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060'}}>{new Intl.NumberFormat('ES-MX').format(Number.parseFloat(fp.Descarga).toFixed(2))} TN</label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col style={{alignSelf:'center'}}>
                                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                    <label style={{fontSize:'12px', fontWeight:'bold', marginBottom:'0px'}}>Barco</label>
                                                                    <label style={{fontSize:'12px', fontWeight:'normal',color:'#606060', marginBottom:'0px'}}>{fp.Matricula}</label>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div style={{textAlign:'center', borderRadius:'15px', background:'#D6F6C2'}}>
                                                                    <label style={{color:'#69BC36', fontSize:'12px', fontWeight:'bold'}}>En proceso</label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                                )}
                                            </div>
                                            
                                        </Col>
                                    </Row>
                                    
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                    
                </>
            );
    }

}
export default CuentasCobrar