import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaShip, FaChevronRight, FaChevronLeft, FaQuestion } from "react-icons/fa";
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Descargas.css';
import { postDetalleDescargaXEmb, postObtenerDatosDescarga, postObtenerDescargasXEmb, postObtenerListaDescarga, postObtenerListaPlanta, postObtenerPlantas, postObtenerTemporadas } from '../../../services/apiservices';
import Loader from '../../common/Loader';
import Menu from '../../layouts/menu';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { es } from 'date-fns/locale';
import { GetArmador, GetTemporada, GetTipoSeleccion, SetAyuda } from '../../../services/storage';
var imageName = require('../../../images/camaron2.png');



class Descargas extends Component {
    
    state = {
        fields: {},
        errors: {},
        windowHeight: window.innerHeight,
        temporadas: [],
        isOpen: false,
        isOpen2: false,
        lstTemporadas: [],
        isOpenDetalle: false,
        selectTemporada: GetTemporada(),
        Temporada: { DesTemporada: "" },
        selectArmador: GetArmador(),
        tipoSelect: GetTipoSeleccion(),
        cuotaTotal: 1,
        descarga: 0,

        lstPuerto: [],
        selectPuerto:"X",
        selectPuertodesc:"",
        fecha:"TODA",
        selectMatricula:"",
        selectPuerto1:"X",
        


        registradas: 0,
        listaFacturas: [],
        listaFacturas2: [],

        isOpenModal: false,
        Detalle: {},

        idarmador:""

    }
    validar = false;
    loading = false;
    istodas=true;

    selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }
    selectionRange1 = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }

    agregarCampo=()=>{
        var nuevaLista = this.state.listaFacturas;
        console.log('inicio lista', nuevaLista)
        for (let index = 0; index < nuevaLista.length; index++) {
            const element = nuevaLista[index];
           

            if(index == 0){
                element['seleccionado'] = true;
            }else{
                element['seleccionado'] = false;
            }
        }
        console.log('Nueva Lista',nuevaLista);
        this.setState({listaFacturas: nuevaLista});
    }

    handleResize = ()=> {
        this.setState({ windowHeight: window.innerHeight });
    }

    
    componentDidMount() {


        
        this.loading = true;
        window.addEventListener("resize", this.handleResize);
        postObtenerTemporadas().then(va => {
            console.log(va);
            this.setState({ lstTemporadas: va, Temporada: va.find(e => e.CodTemporada == this.state.selectTemporada) })
        })

        /*postObtenerPlantas().then(va => {
            console.log(va);
            this.setState({ lstPuerto: va, selectPuerto:"X",selectPuertodesc:"TODOS" })
        })*/

        postObtenerDatosDescarga(this.state.selectArmador, this.state.selectTemporada, this.state.tipoSelect).then(v => {
            console.log('Datos descarga',v);
            this.setState({ cuotaTotal: v.Cuota_Total, descarga: v.Descarga })

            

        });
        postObtenerListaDescarga(this.state.selectArmador, this.state.selectTemporada ?? '',"X","X","X", this.state.tipoSelect).then(v => {
            console.log(v);
            this.setState({ registradas: v.length, listaFacturas: v??[] });

            this.agregarCampo();
        }).finally(() => this.loading = false);

        
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    routeChange() {

        let path = `/Registrar2`;
        this.props.history.push(path);
    }


    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        if (e.target.value.length > 0) {
            console.log("DISPONIBLE")
            this.validar = true;
        } else {
            console.log("NO DISPONIBLE")
            this.validar = false;
        }
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });
    openModal2 = () => this.setState({ isOpen2: true });
    closeModal2 = () => {
        
        this.setState({ isOpen2: false  })
        //this.istodas= true;
    }

    closeModaldetalle= () => this.setState({ isOpenModal: false });

    visibledetalle(item, puntero) {
        console.log(puntero);
        console.log(item);

        for (let index = 0; index < this.state.listaFacturas.length; index++) {
            const element = this.state.listaFacturas[index];
            element.seleccionado = false;
        }
        this.state.listaFacturas[puntero].seleccionado = true;


        this.loading = true;
        //this.setState({ isOpenDetalle: true })    

        postObtenerListaPlanta(item.Cod_armador, this.state.selectTemporada, item.Matr_Embarc,"X","X","X").then(va => {
            console.log(va);
            //setFechaActual(formatDate(new Date().toString()))
            this.setState({ lstPuerto: va, selectPuerto:"X",selectPuertodesc:"TODOS" })

        }).finally(() => this.loading = false);
        
        postObtenerDescargasXEmb(item.Cod_armador, this.state.selectTemporada, item.Matr_Embarc,"X","X","X").then(v => {
            console.log(v);
            //setFechaActual(formatDate(new Date().toString()))
            v.forEach(p => {
                if (p.Fecha_Desc != undefined) {
                    let spliteado = p.Fecha_Desc.toString().split(' ')[0].split('/');
                    p.Fecha_Desc = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                    p.Fecha_Desc1 = spliteado[0] + '/' + spliteado[1] + '/' + spliteado[2];
                }

            });

            this.setState({ listaFacturas2: v, isOpenDetalle: true,selectMatricula:item.Matr_Embarc });

        }).finally(() => this.loading = false);


        this.setState({ selectPuertodesc:"TODOS"});

        this.setState({ fecha:"TODA",idarmador:item.Cod_armador});


    }

    visiblemodal(item) {
        this.loading = true;
        //this.setState({ isOpenModal: true });
        //this.setState({ isOpenDetalle: true })

        let fecha = (item.Fecha_Desc + '').split('/')[2] + '-' + (item.Fecha_Desc + '').split('/')[1] + '-' + (item.Fecha_Desc + '').split('/')[0]

        postDetalleDescargaXEmb(item.Cod_armador,
            this.state.selectTemporada, item.Matr_Embarc, item.Cod_Planta, fecha, item.Nro_Operacion,"X","X","X").then(v => {
                console.log(v);
                //setdetalle(v);

                //setfactura(f);
                let spliteado = v.Fecha_Desc.split(' ')[0].split('/');
                v.Fecha_Desc = ((spliteado[1].length>1?spliteado[1]:("0"+spliteado[1])) + '/' + (spliteado[0].length>1?spliteado[0]:("0"+spliteado[0])) + '/' + spliteado[2]);

                let spliteado1 = v.Fecha_Puerto.split(' ')[0].split('/');
                v.Fecha_Puerto = ((spliteado1[1].length>1?spliteado1[1]:("0"+spliteado1[1])) + '/' + (spliteado1[0].length>1?spliteado1[0]:("0"+spliteado1[0])) + '/' + spliteado1[2]);

                let spliteado2 = v.Fecha_Ini_Desc.split(' ')[0].split('/');
                v.Fecha_Ini_Desc = ((spliteado2[1].length>1?spliteado2[1]:("0"+spliteado2[1])) + '/' + (spliteado2[0].length>1?spliteado2[0]:("0"+spliteado2[0])) + '/' + spliteado2[2]);

                //let spliteado3 = v.Fecha_Desc.split(' ')[0].split('/');
                //v.Fecha_Desc = (spliteado[0].length>1?spliteado[0]:("0"+spliteado[0]) + '/' + spliteado3[1] + '/' + spliteado3[2]);

                let hora1 = (v.Hora_Puerto + "").substring(0, 2) + ':' + (v.Hora_Puerto + "").substring(2, 4);
                v.Hora_Puerto = hora1;

                let hora2 = (v.Hora_Ini_Desc + "").substring(0, 2) + ':' + (v.Hora_Ini_Desc + "").substring(2, 4);
                v.Hora_Ini_Desc = hora2;

                let hora3 = (v.Hora_Fin_Desc + "").substring(0, 2) + ':' + (v.Hora_Fin_Desc + "").substring(2, 4);
                v.Hora_Fin_Desc = hora3;

                this.setState({ isOpenModal: true, Detalle: v });

            }).finally(() => this.loading = false);


    }

    transform(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    selectionTemp = (value) => {
        this.loading = true;
        this.setState({ selectTemporada: value.target.value });
        this.setState({ Temporada: this.state.lstTemporadas.find(e => e.CodTemporada == value.target.value) })

        postObtenerDatosDescarga(this.state.selectArmador, value.target.value, this.state.tipoSelect).then(v => {
            console.log(v);
            this.setState({ cuotaTotal: v.Cuota_Total, descarga: v.Descarga })

        });
        postObtenerListaDescarga(this.state.selectArmador, value.target.value ?? '','X','X','X',this.state.tipoSelect).then(v => {
            console.log(v);
            this.setState({ registradas: v.length, listaFacturas: v??[] });
        }).finally(() => this.loading = false);
        this.setState({ listaFacturas2: [], isOpenDetalle: false });

    }

    getFormattedDateddmmyyyy(date) {
        let year = date.getFullYear();
        
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return day+'/'+ month  + '/' + year;
    }

    getFormattedDateyyyymmdd(date) {
        let year = date.getFullYear();
        
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/'+ month  + '/' + day;
    }

    selectionPuerto = (value) => {
        //this.loading = true;
        this.setState({ selectPuerto1: value.target.value });
        

    }
    handleSelect=(ranges)=>{
        console.log(ranges);
        this.selectionRange1.startDate=ranges.selection.startDate;
        this.selectionRange1.endDate=ranges.selection.endDate;
        this.istodas=false;
        
    }

    selecttoda=()=>{
        this.setState({fecha:"TODA"});
        this.istodas=true;

        this.selectionRange1 = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
          }
    }

    closeModal2g=()=>{

        this.setState({ selectPuerto: this.state.selectPuerto1 });
        if (!this.istodas) {
            this.selectionRange.startDate=this.selectionRange1.startDate;
            this.selectionRange.endDate=this.selectionRange1.endDate;
            //this.istodas=true;

            this.setState({fecha:this.getFormattedDateddmmyyyy(this.selectionRange.startDate)+" - "+this.getFormattedDateddmmyyyy(this.selectionRange.endDate) })
        }
       

        if (this.state.selectPuerto1=="X") {
            this.setState({ selectPuertodesc:"TODOS"});
        }else{
            this.setState({ selectPuertodesc: this.state.lstPuerto.find(e => e.CodPlanta == this.state.selectPuerto1).DesPlanta })
        }
        

        /*postObtenerListaPlanta(this.state.idarmador, this.state.selectTemporada ?? '',this.state.selectMatricula,this.state.selectPuerto1,(this.state.fecha=="TODA" && this.istodas)?"X":this.getFormattedDateyyyymmdd(this.selectionRange.startDate),(this.state.fecha=="TODA" && this.istodas)?"X":this.getFormattedDateyyyymmdd(this.selectionRange.endDate)).then(va => {
            console.log(va);
            //setFechaActual(formatDate(new Date().toString()))
            this.setState({ lstPuerto: va, selectPuerto:"X",selectPuertodesc:"TODOS" })

        }).finally(() => this.loading = false);*/
        


        postObtenerDescargasXEmb(this.state.idarmador, this.state.selectTemporada ?? '',this.state.selectMatricula,this.state.selectPuerto1,(this.state.fecha=="TODA" && this.istodas)?"X":this.getFormattedDateyyyymmdd(this.selectionRange.startDate),(this.state.fecha=="TODA" && this.istodas)?"X":this.getFormattedDateyyyymmdd(this.selectionRange.endDate)).then(v => {
            console.log(v);
            v.forEach(p => {
                if (p.Fecha_Desc != undefined) {
                    let spliteado = p.Fecha_Desc.toString().split(' ')[0].split('/');
                    p.Fecha_Desc = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                    p.Fecha_Desc1 = spliteado[0] + '/' + spliteado[1] + '/' + spliteado[2];
                }

            });


            this.setState({ listaFacturas2: v ,isOpen2: false});
        }).finally(() => this.loading = false);
    }

    openayuda=()=>{
        SetAyuda("Descargas");
        let path = `/Ayuda`;
        this.props.history.push(path);
    }

    /* CambiarTemporada=(codtemp,destemp)=>{
        console.log(codtemp,"-",destemp);
        this.setState({CodTemporada:codtemp});
        this.setState({tempActual:destemp});
        this.ObtenerInformacionUsuario(GetUsuario(),this.state.CodArmador,codtemp);

        // Guardar codigo Temporada
        SetTemporada(codtemp);
    } */

    render() {

        const { windowHeight, descarga, cuotaTotal, registradas, listaFacturas, listaFacturas2,Detalle,lstPuerto } = this.state;


        return (
            <>
            <Container style={{
                maxWidth: "100%", background: '#E0E5F0',
                bottom: "0",
                top: "0",
            }}>
                <Loader loading={this.loading} />
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cambiar Temporada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group" style={{ width: "100%" }}>
                            <label htmlFor="email" style={{ color: '#184A7D', fontSize: '16px', fontWeight: '700' }}>Temporada</label>

                            <select class="form-control" aria-label="Default select example" onChange={this.selectionTemp} defaultValue={this.state.selectTemporada}>
                                {this.state.lstTemporadas.map(item => {
                                    return (<option value={item.CodTemporada} key={item.CodTemporada} >{item.DesTemporada}</option>)
                                })}
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button variant="secondary" className="btn btn-secondary" onClick={this.closeModal}>
                            Cerrar
                        </button>
                        <button variant="primary" className="btn btn-primary" onClick={this.closeModal}>
                            Guardar Cambios
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.isOpen2} onHide={this.closeModal2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cambiar Puerto y Rango de Fechas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group" style={{ width: "100%" }}>
                            <label htmlFor="puerto" style={{ color: '#184A7D', fontSize: '16px', fontWeight: '700' }}>Puerto</label>
                            <select class="form-control" id="puerto" aria-label="Default select example" onChange={this.selectionPuerto} defaultValue={this.state.selectPuerto}>
                            <option value="X">TODOS</option>
                                {lstPuerto.map(item => {
                                    return (<option value={item.CodPlanta} key={item.CodPlanta}>{item.DesPlanta}</option>)
                                })}
                            </select>

                            <label htmlFor="fecha" style={{ color: '#184A7D', fontSize: '16px', fontWeight: '700',marginTop:10 }}>Rango Fechas</label>
                            <button variant="primary" className="btn btn-primary" style={{background:'#184A7D',height:26,marginLeft:10,padding:"0px 10px"}} onClick={this.selecttoda}>
                            Escoger TODA
                            </button>
                            <br/>
                            <DateRangePicker
                                    locale={es}
                                    dateDisplayFormat="d MMM yyyy"
                                    showMonthArrow={false}
                                    ranges={[this.selectionRange1]}
                                    onChange={this.handleSelect}
                                    
                                />

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button variant="secondary" className="btn btn-secondary" onClick={this.closeModal2}>
                            Cerrar
                        </button>
                        <button variant="primary" className="btn btn-primary" style={{background:'#184A7D'}} onClick={this.closeModal2g}>
                            Guardar Cambios
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.isOpenModal} size="lg" onHide={this.closeModaldetalle} style={{borderRadius: 8}}>
                    <Modal.Header closeButton style={{color:"#0076BC",
                        paddingTop: 44,
                        paddingLeft: 52,
                        paddingRight: 52,
                        border: "none"}}>
                        <Modal.Title style={{color: "#0076bc",
                        fontSize: 16,
                        fontWeight: "bold"}}> <FaChevronLeft /> Descarga {Detalle.Fecha_Desc}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid" style={{height: "30rem",
                        paddingLeft: 37,
                        paddingRight: 37}}>
                        <Container>
                            <Row>
                            <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%"}}>
                                <Row style={{ paddingTop: 12,paddingBottom: 12 }}>
                                    <Col xs={12} md={8} style={{ paddingLeft: "3%", paddingRight: "3%",    
                                    color: "#184A7D",
                                    fontSize: 16,
                                    fontWeight: "bold"}}>
                                        {Detalle.Nombre_Emb}
                                    </Col>
                                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        marginTop: 4,
                                        textAlign: "right"}}>
                                        {Detalle.Matr_Embarc}
                                    </Col>
                                </Row>
                                <Row style={{  paddingTop: 12,paddingBottom: 12 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"
                                    }}>
                                        Fecha de Descarga
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"
                                    }}>
                                        {Detalle.Fecha_Desc}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 12,paddingBottom: 12 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        Centro
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.DesPlanta}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 12,paddingBottom: 12 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                    Descargado
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {this.transform(Number.parseFloat(Detalle.Descarga).toFixed(2))} TN
                                    </Col>
                                </Row>
                                <Row style={{  paddingTop: 12,paddingBottom: 12}}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                    Declarado
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {this.transform(Number.parseFloat(Detalle.Declarado).toFixed(2))} TN
                                    </Col>
                                </Row>
                                <div style={{
                                    height: 1, backgroundColor: '#9CA5CA', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>

                                <Row>
                                <div>
                                    
                                </div>    
                                <div style={{ color: '#576774', backgroundColor: Detalle.Camaron > 21.5 ? '#E0E5F0' : '#E0E5F0', width: 40, height: 40, borderRadius: 10,marginLeft: 20, padding: 6, marginTop: 10, textAlign:'center' }} >
                                <img src={imageName.default} style={{width:"auto",bottom: 0}}></img>
                                </div>
                                <Col>
                                    <div 
                                        style={{
                                            flex: .8,
                                            fontSize: 10,
                                            marginTop: 0,
                                            textAlign: 'left',
                                            fontWeight: 'bold',
                                            color: Detalle.Camaron > 21.5 ? '#EE4266' : '#576774',
                                            paddingLeft: 20
                                        }}>
                                        CAMARONCILLO
                                    </div>
                                    <div
                                        style={{
                                            flex: .8,
                                            fontSize: 20,
                                            marginTop: 0,
                                            textAlign: 'left',
                                            fontWeight: 'normal',
                                            color: Detalle.Camaron > 21.5 ? '#EE4266' : '#576774',
                                            paddingLeft: 20
                                        }}>
                                        {Number.parseFloat(Detalle.Camaron).toFixed(2)}%
                                    </div>
                                </Col>

                                <Col>
                                    <div
                                        style={{
                                            flex: .8,
                                            fontSize: 10,
                                            marginTop: 0,
                                            textAlign: 'left',
                                            fontWeight: 'bold',
                                            color: '#576774',
                                            paddingLeft: 20
                                        }}>
                                        JUVENILES
                                    </div>
                                    <div
                                        style={{
                                            flex: .8,
                                            fontSize: 20,
                                            marginTop: 0,
                                            textAlign: 'left',
                                            fontWeight: 'normal',
                                            color: '#576774',
                                            paddingLeft: 20
                                        }}>
                                        {Number.parseFloat(Detalle.Juveniles).toFixed(2)}%
                                    </div>
                                </Col>
                            </Row>

                            <div style={{
                                height: 1, backgroundColor: '#9CA5CA', borderRadius: 20, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                            }}></div>

                            </Col>
                            <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%"}}>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#576774"}}>
                                        <b>Datos de marea</b>
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={8} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                         Fecha y hora de arribo puerto
                                    </Col>
                                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Fecha_Puerto}  {Detalle.Hora_Puerto}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={8} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        TDC arribo
                                    </Col>
                                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Tdc_Arribo}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={8} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        Fecha y hora inicio de descarga
                                    </Col>
                                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Fecha_Ini_Desc}  {Detalle.Hora_Ini_Desc}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={8} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        Fecha y hora fin de descarga
                                    </Col>
                                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Fecha_Desc}  {Detalle.Hora_Fin_Desc}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        TDC descarga
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Tdc_Descarga}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        TVN descarga
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Tvn_Descarga}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        
                        </Container>
                        


                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Row style={{ height: "100%" }}>
                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%", background: "linear-gradient(162.5deg, #00B9FF 12.09%, #469DD3 92.14%)" }}>
                        <div style={{ height: 70, color: '#ffffff', fontSize: 32, fontWeight: 500, paddingTop: 10 }}>Descargas</div>

                        <div style={{
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "3px 4px 10px #b0b4c7",
                            padding: "7%",
                            marginTop: "16%"
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                background: "#D8F2FF",
                                borderRadius: 8,
                                paddingLeft: 7,
                                color: "#5CBDEB",
                                fontSize: 18
                            }}
                            ><FaShip /></div>

                            <div style={{ fontSize: 24, color: "#184A7D", fontWeight: "bold", marginBottom: 10 }}>{registradas} Embarcaciones</div>
                            <ProgressBar style={{ background: "#DADBE0", height: 8 }} variant={"colorbar"} now={(descarga / (cuotaTotal == 0 ? 1 : cuotaTotal)) * 100} />
                            <Row style={{ fontSize: 12, marginTop: 10 }}>
                                <Col>Avance: <b>{((descarga / cuotaTotal) * 100).toFixed(0)}%</b></Col>
                                <Col style={{ textAlign: "right" }}>{this.transform(descarga.toFixed(0))} TN de <b>{this.transform(cuotaTotal.toFixed(0))} TN</b></Col>
                            </Row>
                        </div>

                        <div style={{ color: '#ffffff', fontSize: 14, paddingTop: 100 }}>¿Necesitas comunicarte con nosotros? <br />    
                                Estamos a tu disposición</div>
                        <div style={{
                                    background: '#0076BC',
                                    borderColor: '#0076BC',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    marginTop:10,
                                    borderRadius: 50,
                                }} className="btn btn-primary"
                                    onClick={this.openayuda}
                                >Ayuda <FaQuestion style={{background:"white",color:"#0076BC",padding:2,borderRadius:10}} />
                                
                                </div>
                    </Col>
                    
                    <Col xs={12} md={4} style={{ padding: 0 }}>
                        <Container style={{ padding: 0, margin: 0, minWidth: "100%" }}>
                            <div style={{
                                height: 70, color: '#184A7D',
                                background: "#ffffff", fontSize: 14,
                                paddingLeft: "10%",
                                borderRight: "rgb(156 165 202 / 39%) solid 1px",
                                zIndex: 1000,
                                display:'flex'
                            }}>
                                <label style={{color:'#184A7D', fontSize:'14px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px', alignSelf:'center'}}>{this.state.Temporada?.DesTemporada}</label>
                                <Dropdown style={{alignSelf:'center'}} >
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic"  
                                                     style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'30px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D', marginRight:'5px'}}>
                                        Cambiar
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{maxHeight:'300px',overflow:'auto'}}  menuAlign="right" onChange={this.selectionTemp}>
                                    <Dropdown.ItemText style={{color:'#9CA5CA', fontSize:'14px'}}>Elegir temporada</Dropdown.ItemText>
                                    { this.state.lstTemporadas.map(item => 
    
                                    <Dropdown.Item  style={{padding:'7px 10px 7px 10px', fontSize:'14px'}}
                                                    key={item.CodTemporada} 
                                                    value={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
    
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                
                                {/* <select class="form-control" aria-label="Default select example" onChange={this.selectionTemp} defaultValue={this.state.selectTemporada}>
                                {this.state.lstTemporadas.map(item => {
                                    return (<option value={item.CodTemporada} key={item.CodTemporada} >{item.DesTemporada}</option>)
                                })}
                                onClick={()=>this.CambiarTemporada(item.CodTemporada,item.DesTemporada)} 
                                </select> */}

                                {/* {this.state.Temporada?.DesTemporada}

                                <button type="submit" style={{
                                    background: '#184A7D',
                                    borderColor: '#184A7D',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    height: "30px",
                                    padding: 5,
                                    borderRadius: 50,
                                    marginLeft: 25
                                }} className="btn btn-primary"
                                    onClick={this.openModal}
                                >Cambiar</button> */}
                            </div>
                            <Col xs={12} md={6} style={{
                                padding: "0% 10% 0% 10%", minWidth: "100%",
                                marginTop: '0px',
                                height: windowHeight,
                                overflow: "auto",
                                paddingTop: 50
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>Embarcaciones</div>
                                </Row>


                                {listaFacturas?.map((item,index) => {
                                    return (
                                        <div  key={item.Matr_Embarc} style={{
                                            /* background:  item.seleccionado === false? '#fff':'rgb(200 237 255)', */
                                            background: '#fff',
                                            opacity: item.seleccionado === false? '0.5':'1',
                                            borderRadius: 8,
                                            boxShadow: "3px 4px 10px #b0b4c7",
                                            cursor: "pointer",
                                            padding: "7%",
                                            marginTop: "15px"
                                        }}
                                            onClick={this.visibledetalle.bind(this, item,index)}
                                        >
                                            <Row>
                                                <Col md={10}>
                                                    <div style={{ fontSize: 16, color: "#184A7D", fontWeight: "bold", marginBottom: 12 }}>{item.Nombre_Emb}</div>
                                                </Col>
                                                <Col md={2} style={{
                                                    textAlign: "right",
                                                    color: "#0076BC"
                                                }}>
                                                    <FaChevronRight />
                                                </Col>
                                            </Row>

                                            <ProgressBar style={{ background: "#DADBE0", height: 8 }} variant={"colorbar"} now={(Number.parseFloat((item.Descarga / item.Cuota_total).toFixed(2))) * 100} />
                                            <Row style={{ fontSize: 12, marginTop: 8 }}>
                                                <Col>{((item.Descarga / item.Cuota_total) * 100).toFixed(0)}% | {this.transform(Number.parseFloat(item.Descarga).toFixed(0))} TN</Col>
                                                <Col style={{ textAlign: "right" }}>{this.transform(Number.parseFloat(item.Cuota_total).toFixed(0))} TN</Col>
                                            </Row>
                                        </div>
                                    )
                                })}

                            </Col>
                            <Col xs={0} md={6}></Col>
                        </Container>
                    </Col>
                    <Col xs={12} md={4} style={{ padding: 0, display: this.state.isOpenDetalle ? "block" : "none" }}>
                        <Container style={{ padding: 0, margin: 0, minWidth: "100%", background: '#D5DAE5', minHeight: "100%", height: "100%" }}>
                            <div style={{
                                height: 70, color: '#184A7D',
                                background: "#ffffff", fontSize: 14,
                                fontWeight: "bold", paddingLeft: "10%",
                                paddingTop: 10,
                                zIndex: 500,
                            }}>
                                <Row>
                                    <Col xs="8" md="8" style={{alignSelf:'center'}}>
                                     
                                            <div style={{marginRight:'5px'}}>Puerto: {this.state.selectPuertodesc}</div>
                                            <div> Fechas: {this.state.fecha}</div>
                                            
                                        
                                    </Col>
                                    <Col xs="4" md="4" style={{paddingTop: 10,}} >
                                    <button type="submit" style={{
                                    background: '#184A7D',
                                    borderColor: '#184A7D',
                                    fontWeight: 500,
                                    
                                    fontSize: 14,
                                    height: "30px",
                                    padding: '5px 10px 5ps 10px',
                                    borderRadius: 50,
                                    marginLeft: 25,
                                    fontWeight:'normal',
                                    paddingTop:'0px',
                                    paddingBottom:'0px'
                                }} className="btn btn-primary"
                                    onClick={this.openModal2}
                                >Cambiar</button> 
                                    </Col>
                                </Row>
                                
                                 
                            </div>
                            <Col xs={12} md={6} style={{
                                padding: "0% 10% 0% 10%",
                                minWidth: "100%",
                                marginTop: '0',
                                height: windowHeight,
                                overflow: "auto",
                                paddingTop: 50,
                                position: "relative"
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>Descargas</div>
                                </Row>
                                {listaFacturas2?.map(item2 => {
                                    return (<div key={item2.Indice} style={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        boxShadow: "3px 4px 10px #b0b4c7",
                                        padding: "7%",
                                        marginTop: "15px"
                                    }}
                                        onClick={this.visiblemodal.bind(this, item2)}
                                    >
                                        <div style={{display:'flex', justifyContent:'space-between'}}>
                                            <div style={{ fontSize: 14, color: "#184A7D", fontWeight: "bold" }}>Descarga {item2.Fecha_Desc1}</div>
                                            <FaChevronRight style={{color:'rgb(0, 118, 188)'}}/>
                                        </div>
                                        
                                        <Row style={{ fontSize: 10, marginTop: 10 }}>
                                            <Col md={3} style={{ color: '#576774' }}><b>Puerto</b></Col>
                                            <Col md={5} style={{}}>{item2.DesPlanta}</Col>
                                        </Row>
                                        <Row style={{ fontSize: 10, marginTop: 10 }}>
                                            <Col md={3} style={{ color: '#576774' }}><b>Descargado</b></Col>
                                            <Col md={5} style={{}}>{this.transform(Number.parseFloat(item2.Descarga).toFixed(2))} TON</Col>
                                        </Row>
                                    </div>)

                                })}
                            </Col>
                            <Col xs={0} md={6}></Col>
                        </Container>
                    </Col>

                </Row>
            </Container>
            </>
        );
    }

}
export default Descargas