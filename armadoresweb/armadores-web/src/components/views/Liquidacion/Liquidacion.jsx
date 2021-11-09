import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal'
import { FaShip, FaChevronRight, FaChevronLeft, FaClipboardList, FaSort, FaQuestion } from "react-icons/fa";
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Liquidacion.css';
import { postConsultaArchivo, postDetalleDescargaXEmb, postDetalleLiquidacionUsu, postObtenerDatosDescarga, postObtenerDescargasXEmb, postObtenerListaDescarga, postObtenerListaLiquidaciones, postObtenerTemporadas } from '../../../services/apiservices';
import Loader from '../../common/Loader';
import Swal from 'sweetalert2';
import Menu from '../../layouts/menu';
import { GetArmador, GetTemporada, GetTipoSeleccion, SetAyuda } from '../../../services/storage';
import Dropdown from 'react-bootstrap/Dropdown';
class Liquidacion extends Component {
    state = {
        fields: {},
        errors: {},
        windowHeight: window.innerHeight,
        temporadas: [],
        isOpen: false,
        isOpen2: false,
        lstTemporadas: [],
        isOpenDetalle: false,
        selectTemporada: GetTemporada(),//"0000000047",
        Temporada: { DesTemporada: "" },
        selectArmador: GetArmador(),
        tipoSelect: GetTipoSeleccion(),
        cuotaTotal: 1,
        descarga: 0,




        registradas:0,
        enproceso:0,
        dineroregistradas:0,
        dineroenproceso:0,

        listaFacturas: [],
        listaFacturas2: [],

        isOpenModal: false,
        Detalle: {},


        isordenemision:false,
        ismonto:false,

        isordenemision2:false,
        ismonto2:false
    }
    validar = false;
    loading = false;



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
        let countregistrada = 0;
        let countenproceso = 0;
        let acumregistrada = 0;
        let acumproceso = 0;
        postObtenerListaLiquidaciones(this.state.selectArmador, this.state.selectTemporada,'X',GetTipoSeleccion()).then(v => {
            console.log(v);
            v.forEach(p => {
                if (p.FechaEmision != undefined) {
                  let spliteado = p.FechaEmision.split(' ')[0].split('/');
                  p.FechaEmision = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                }
                if (p.FechaPago != undefined) {
                  let spliteado = p.FechaPago.split(' ')[0].split('/');
                  p.FechaPago = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                }
                if (p.Estado == 'S') {
                  countregistrada++;
                  acumregistrada += (Number.parseFloat(p.Monto));
                } else {
                  countenproceso++;
                  acumproceso += (Number.parseFloat(p.Monto));
                }

              });
            this.setState({ registradas: countregistrada, enproceso: countenproceso,dineroregistradas:acumregistrada,dineroenproceso:acumproceso,listaFacturas:v })

        });
        /*postObtenerListaDescarga(this.state.selectArmador, this.state.selectTemporada ?? '').then(v => {
            console.log(v);
            this.setState({ registradas: v.length, listaFacturas: v });
        }).finally(() => this.loading = false);*/
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
    closeModal2 = () => this.setState({ isOpen2: false });

    closeModaldetalle= () => this.setState({ isOpenModal: false });

    visibledetalle(item) {
        this.loading = true;
        //this.setState({ isOpenDetalle: true })

        postObtenerDescargasXEmb(this.state.selectArmador, this.state.selectTemporada, item.Matr_Embarc).then(v => {
            console.log(v);
            //setFechaActual(formatDate(new Date().toString()))
            v.forEach(p => {
                if (p.Fecha_Desc != undefined) {
                    let spliteado = p.Fecha_Desc.toString().split(' ')[0].split('/');
                    p.Fecha_Desc = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                }

            });

            this.setState({ listaFacturas2: v, isOpenDetalle: true });

        }).finally(() => this.loading = false);


    }

    visiblemodal(item) {
        this.loading = true;
        //this.setState({ isOpenModal: true });
        //this.setState({ isOpenDetalle: true })

        //let fecha = (item.Fecha_Desc + '').split('/')[2] + '-' + (item.Fecha_Desc + '').split('/')[1] + '-' + (item.Fecha_Desc + '').split('/')[0]

        postConsultaArchivo(item.Cod_armador, item.Nro_liquidacion).then(res => {
                console.log(res);
                
                console.log("vuelta : "+res)
                  if (res.url!=null) {
                    var win = window.open(res.url, '_blank');
                    if (win != null) {
                        win.focus();
                      }
                  }else {
                    Swal.fire('Sin archivo PDF'
                      )
                  }

            }).finally(() => this.loading = false);


    }

    transform(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    openayuda=()=>{
        SetAyuda("Liquidacion");
        let path = `/Ayuda`;
        this.props.history.push(path);
    }

    ordenarCobradas=(tipo)=>{

        switch(tipo){

            case 1:
                var facturas = this.state.listaFacturas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.FechaEmision < element.FechaEmision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({listaFacturas: facturas});
                console.log(facturas);
                return;

            case 2:
                var facturas = this.state.listaFacturas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.FechaEmision > element.FechaEmision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({listaFacturas: facturas});
                console.log(facturas);
                return;    
            case 3:
                var facturas = this.state.listaFacturas;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(parseFloat(element2.Monto) > parseFloat(element.Monto)){
                            var aux = element2;
                            facturas[index2] = element;
                            facturas[index1] = aux;
                        }

                    }
                }
                this.setState({listaFacturas: facturas});
                console.log(facturas);
                return;
            case 4:
                var facturas = this.state.listaFacturas;
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
                this.setState({listaFacturas: facturas});
                console.log(facturas);
                return;

            
        }
    }

    ordenarPorCobrar=(tipo)=>{

        switch(tipo){

            case 1:
                var facturas = this.state.listaFacturas2;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.FechaEmision < element.FechaEmision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({listaFacturas2: facturas});
                return;

            case 2:
                var facturas = this.state.listaFacturas2;
                for (let index1 = 0; index1 < facturas.length -1; index1++) {
                    const element = facturas[index1];
                    for (let index2 = index1 +1; index2 < facturas.length; index2++) {
                        const element2 = facturas[index2];
                        if(element2.FechaEmision > element.FechaEmision){
                            var aux = facturas[index2];
                            facturas[index2] = facturas[index1];
                            facturas[index1] = aux;
                        }
                    }
                }
                this.setState({listaFacturas2: facturas});
                return;    
            case 3:
                var facturas = this.state.listaFacturas2;
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
                this.setState({listaFacturas2: facturas});
                return;
            case 4:
                var facturas = this.state.listaFacturas2;
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
                this.setState({listaFacturas2: facturas});
                return;

            
        }
    }

    selectionTemp = (value) => {
        this.loading = true;
        this.setState({ selectTemporada: value.target.value });
        this.setState({ Temporada: this.state.lstTemporadas.find(e => e.CodTemporada == value.target.value) })

        let countregistrada = 0;
        let countenproceso = 0;
        let acumregistrada = 0;
        let acumproceso = 0;
        postObtenerListaLiquidaciones(this.state.selectArmador, value.target.value,'X',GetTipoSeleccion()).then(v => {
            console.log(v);
            let listacobradas = [];
            let listaporcobrar = [];
            v.forEach(p => {
                if (p.FechaEmision != undefined) {
                  let spliteado = p.FechaEmision.split(' ')[0].split('/');
                  p.FechaEmision = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                }
                if (p.FechaPago != undefined) {
                  let spliteado = p.FechaPago.split(' ')[0].split('/');
                  p.FechaPago = spliteado[1] + '/' + spliteado[0] + '/' + spliteado[2];
                }
                if (p.Estado == 'S') {
                  countregistrada++;
                  acumregistrada += (Number.parseFloat(p.Monto));
                  listacobradas.push(p);
                } else {
                  countenproceso++;
                  acumproceso += (Number.parseFloat(p.Monto));
                  listaporcobrar.push(p);
                }

              });


            this.setState({ registradas: countregistrada,
                 enproceso: countenproceso,
                 dineroregistradas:acumregistrada,
                 dineroenproceso:acumproceso,
                 listaFacturas:listacobradas,
                 listaFacturas2:listaporcobrar,
                 })

        });
        this.setState({ listaFacturas2: [], isOpenDetalle: false });

    }
    render() {

        const { windowHeight, descarga, cuotaTotal, registradas,dineroregistradas
            ,enproceso,dineroenproceso, listaFacturas, listaFacturas2,Detalle,isordenemision,ismonto
            ,isordenemision2,ismonto2 } = this.state;


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
                            <label htmlFor="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Temporada</label>

                            <select className="form-control" aria-label="Default select example" onChange={this.selectionTemp} defaultValue={this.state.selectTemporada}>
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
                            <label htmlFor="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Temporada</label>
                            <select className="form-control" aria-label="Default select example">
                                {this.state.lstTemporadas.map(item => {
                                    return (<option value={item.CodTemporada} key={item.CodTemporada} selected>{item.DesTemporada}</option>)
                                })}
                            </select>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button variant="secondary" className="btn btn-secondary" onClick={this.closeModal2}>
                            Cerrar
                        </button>
                        <button variant="primary" className="btn btn-primary" onClick={this.closeModal2}>
                            Guardar Cambios
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.isOpenModal} size="lg" onHide={this.closeModaldetalle} style={{borderRadius: 8}}>
                    <Modal.Header closeButton style={{color:"#0076BC",
                        paddingTop: 44,
                        paddingLeft: 52,
                        paddingRight: 52,
                        border: "none"
                        }}>
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
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",    
                                    color: "#184A7D",
                                    fontSize: 16,
                                    fontWeight: "bold"}}>
                                        {Detalle.Nombre_Emb}
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
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
                                <div style={{ color: '#576774', backgroundColor: Detalle.Camaron > 21.5 ? '#EE4266' : '#E0E5F0', width: 40, height: 40, borderRadius: 10, fontSize: 23, marginLeft: 20, padding: 6, marginTop: 10 }} >🦐</div>
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
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                         Fecha y hora de arribo puerto
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Fecha_Puerto}  {Detalle.Hora_Puerto}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        TDC arribo
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Tdc_Arribo}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        Fecha y hora inicio de descarga
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        color: "#576774",
                                        fontSize: 12,
                                        textAlign: "right"}}>
                                        {Detalle.Fecha_Ini_Desc}  {Detalle.Hora_Ini_Desc}
                                    </Col>
                                </Row>
                                <Row style={{ paddingTop: 10,paddingBottom: 10 }}>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
                                        fontSize: 12,
                                        color: "#020B2B"}}>
                                        Fecha y hora fin de descarga
                                    </Col>
                                    <Col xs={12} md={6} style={{ paddingLeft: "3%", paddingRight: "3%",
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
                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%", background: "linear-gradient(166.34deg, #FEA928 8.34%, #F0B238 92.8%)" }}>
                        <div style={{ height: 70, color: '#ffffff', fontSize: 32, fontWeight: 500, paddingTop: 10 }}>Liquidaciones</div>
                        
                        <Row>
                            <Col>
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
                                        background: "#D6F6C2",
                                        borderRadius: 8,
                                        paddingLeft: 7,
                                        color: "#69BC36",
                                        fontSize: 18
                                    }}
                                    ><FaClipboardList /></div>

                                    <div style={{ fontSize: 14, color: "#184A7D", fontWeight: "bold", marginBottom: 10 }}><span style={{fontSize:24}}>{registradas}</span> {registradas>1?"liquidaciones":"liquidación"}</div>
                                    <Row style={{ fontSize: 12, marginTop: 10,color:"#184A7D" }}>
                                        <Col>
                                            Cobradas
                                        </Col>
                                    </Row>
                                    <Row style={{ fontSize: 12, marginTop: 10,color:"#9CA5CA", fontWeight:700 }}>
                                        <Col>$ <b>{this.transform(dineroregistradas.toFixed(2))}</b></Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col>
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
                                        background: "#F8E9D2",
                                        borderRadius: 8,
                                        paddingLeft: 7,
                                        color: "#F39200",
                                        fontSize: 18
                                    }}
                                    ><FaClipboardList /></div>

                                    <div style={{ fontSize: 14, color: "#184A7D", fontWeight: "bold", marginBottom: 10 }}><span style={{fontSize:24}}>{enproceso}</span> {enproceso>1?"liquidaciones":"liquidación"}</div>
                                    <Row style={{ fontSize: 12, marginTop: 10,color:"#184A7D" }}>
                                        <Col >Por cobrar</Col>
                                    </Row>
                                    <Row style={{ fontSize: 12, marginTop: 10,color:"#9CA5CA", fontWeight:700 }}>
                                        <Col>$ {this.transform(dineroenproceso.toFixed(2))}</Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <div style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, paddingTop: 38}}>Cobradas: Liquidaciones depositadas en su cuenta bancaria</div>
                        <div style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, paddingTop: 26}}>Por Cobrar: Liquidaciones en espera de aprobación del banco para ser depositadas</div>
                                    
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
                                fontWeight: "bold", paddingLeft: "10%",
                                paddingTop: 0, borderRight: "rgb(156 165 202 / 39%) solid 1px",
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
                                    <Dropdown.ItemText style={{color:'#9CA5CA', fontSize:'14px', fontWeight:'normal'}}>Elegir temporada</Dropdown.ItemText>
                                    { this.state.lstTemporadas.map(item => 
    
                                    <Dropdown.Item  style={{padding:'7px 10px 7px 10px', fontSize:'14px'}}
                                                    key={item.CodTemporada} 
                                                    value={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
    
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>

                            
                            <Row style={{ margin: '30px 10% 0px 10%' }}>
                                    <Col md={4} style={{paddingLeft:'0px'}}>
                                    <div style={{ color: '#576774', fontSize: '14px', alignSelf:'center', paddingLeft:'0px'}}>Cobradas</div>
                                    </Col>
                                    <Col md={8} >
                                    <Row style={{flexDirection: "row-reverse"}}>
                                 

                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" 
                                                        style={{fontWeight:'bold',background:'transparent', borderRadius:'15px',fontSize:'12px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid transparent', color:'#184A7D'}}>
                                            ORDENAR
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>this.ordenarCobradas(1)} key="1">Por fecha: Más cercano</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarCobradas(2)} key="2">Por fecha: Más lejano</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarCobradas(3)} key="3">Por monto: Mayor a menor</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarCobradas(4)} key="4">Por monto: Menor a mayor</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    </Row>
                                    </Col>
                            </Row>

                            <Col xs={12} md={6} style={{
                                padding: "10%", minWidth: "100%",
                                marginTop: 0,
                                height: windowHeight,
                                paddingTop: 0,
                                overflow:'auto'
                            }}>
                                
                                <div>
                                {listaFacturas.map(item => {
                                    return (
                                        <div key={item.Matr_Embarc} style={{
                                            background: "#fff",
                                            borderRadius: 8,
                                            boxShadow: "3px 2px 5px #b0b4c7",
                                            cursor: "pointer",
                                            padding: "7%",
                                            marginTop: "15px"
                                        }}
                                            onClick={this.visiblemodal.bind(this, item)}
                                        >
                                            <Row>
                                                <Col md={10}>
                                                    <div style={{ fontSize: 16, color: "#184A7D", fontWeight: "bold", marginBottom: 0 }}>Liquidación {item.Nro_liquidacion}</div>
                                                </Col>
                                                <Col md={2} style={{
                                                    textAlign: "right",
                                                    color: "#0076BC"
                                                }}>
                                                    <FaChevronRight />
                                                </Col>
                                            </Row>
                                            <Row style={{ fontSize: 16, marginTop: 8,color:"#9CA5CA", fontWeight:700 }}>
                                                <Col>Monto $ {this.transform(Number.parseFloat(item.Monto).toFixed(2))}</Col>
                                            </Row>

                                            <Row style={{ fontSize: 12, marginTop: 26,color:"#606060"}}>
                                                <Col md={3} ><b>F.Emisión</b></Col>
                                                <Col md={3}>{item.FechaEmision}</Col>
                                                <Col style={{visibility:"hidden",padding:'0px 5px 0px 5px'}}><b>Descarga</b></Col>
                                                <Col style={{visibility:"hidden",padding:'0px'}}>{this.transform(Number.parseFloat(item.Descarga).toFixed(2))} TN</Col>
                                            </Row>

                                            <Row style={{ fontSize: 12, marginTop: 10,color:"#606060"}}>
                                                <Col md={3} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    paddingTop: 4
                                                }}><b>F. pago</b></Col>
                                                <Col md={3} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    paddingTop: 4,
                                                    fontWeight: 'bold'                                                    
                                                }}
                                                >{item.FechaPago}</Col>
                                                <Col md={6} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    backgroundColor: item.Estado == 'S' ? "#D6F6C2" : "#F8E9D2",
                                                    borderRadius: 100,
                                                    padding: 5,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                                ><b>{item.Estado == 'S' ? "Cobradas" : "Por cobrar"}</b></Col>
                                            </Row>
                                        </div>
                                    )
                                })}
                                </div>
                                

                            </Col>
                            <Col xs={0} md={6}></Col>
                        </Container>
                    </Col>
                    <Col xs={12} md={4} style={{ padding: 0 }}>
                        <Container style={{ padding: 0, margin: 0, minWidth: "100%", background: '#D5DAE5', minHeight: "100%", height: "100%" }}>
                            <div style={{
                                height: 70, color: '#184A7D',
                                background: "#ffffff", fontSize: 16,
                                fontWeight: "bold", paddingLeft: "10%",
                                paddingTop: 0,
                                zIndex: 1000
                            }}>
                               
                            </div>

                            <Row style={{margin: '30px 10% 0px 10%' }}>
                                    <Col md={4}>
                                    <div style={{ color: '#576774', fontSize: '14px', alignSelf:'center', paddingLeft:'0px'}}>Por Cobrar</div>
                                    </Col>
                                    <Col md={8} >
                                        <Row style={{flexDirection: "row-reverse"}}>
                                    
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" 
                                                        style={{fontWeight:'bold',background:'transparent', borderRadius:'15px',fontSize:'12px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid transparent', color:'#184A7D'}}>
                                            ORDENAR
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>this.ordenarPorCobrar(1)} key="1">Por fecha: Más cercano</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarPorCobrar(2)} key="2">Por fecha: Más lejano</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarPorCobrar(3)} key="3">Por monto: Mayor a menor</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.ordenarPorCobrar(4)} key="4">Por monto: Menor a mayor</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    
                                    </Row>
                                    </Col>
                            </Row>
                            <Col xs={12} md={6} style={{
                                padding: "10%",
                                minWidth: "100%",
                                marginTop: 0,
                                height: windowHeight,
                                overflow: "auto",
                                paddingTop: 0,
                                
                            }}>
                                

                                {listaFacturas2.map(item => {
                                    return (
                                        <div key={item.Matr_Embarc} style={{
                                            background: "#fff",
                                            borderRadius: 8,
                                            boxShadow: "3px 2px 5px #b0b4c7",
                                            cursor: "pointer",
                                            padding: "7%",
                                            marginTop: "15px"
                                        }}
                                            onClick={this.visiblemodal.bind(this, item)}
                                        >
                                            <Row>
                                                <Col md={10}>
                                                    <div style={{ fontSize: 16, color: "#184A7D", fontWeight: "bold", marginBottom: 0 }}>Liquidación {item.Nro_liquidacion}</div>
                                                </Col>
                                                <Col md={2} style={{
                                                    textAlign: "right",
                                                    color: "#0076BC"
                                                }}>
                                                    <FaChevronRight />
                                                </Col>
                                            </Row>
                                            <Row style={{ fontSize: 16, marginTop: 8,color:"#9CA5CA", fontWeight:700 }}>
                                                <Col>Monto $ {this.transform(Number.parseFloat(item.Monto).toFixed(2))}</Col>
                                            </Row>

                                            <Row style={{ fontSize: 12, marginTop: 26,color:"#606060"}}>
                                                <Col><b>F.Emisión</b></Col>
                                                <Col>{item.FechaEmision}</Col>
                                                <Col style={{visibility:"hidden"}}><b>Descarga</b></Col>
                                                <Col style={{visibility:"hidden"}}>{this.transform(Number.parseFloat(item.Descarga).toFixed(2))} TN</Col>
                                            </Row>

                                            <Row style={{ fontSize: 12, marginTop: 10,color:"#606060"}}>
                                                <Col md={3} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    paddingTop: 4
                                                }}><b>F. pago</b></Col>
                                                <Col md={3} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    paddingTop: 4
                                                }}
                                                >{item.FechaPago}</Col>
                                                <Col md={6} style={{
                                                    color: item.Estado == 'S' ? '#69BC36' : "#F39200",
                                                    backgroundColor: item.Estado == 'S' ? "#D6F6C2" : "#F8E9D2",
                                                    borderRadius: 100,
                                                    padding: 5,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                                ><b>{item.Estado == 'S' ? "Cobradas" : "Por cobrar"}</b></Col>
                                            </Row>
                                        </div>
                                    )
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
export default Liquidacion