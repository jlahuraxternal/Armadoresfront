import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import './Grupos.css';
import { GetUsuario, GetArmador, GetTemporada, SetAyuda, GetGrupo } from '../../../services/storage';
import { FaAngleDown } from "react-icons/fa";
import { FaSort } from "react-icons/fa";
import { FaQuestionCircle } from 'react-icons/fa';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { postEliminarGrupoParticipantes, postObtenerCobrosFact, postObtenerListaGrupo, postObtenerListaParticipantes, postObtenerListaUsuario, postRegistroGrupo, postRegistroUsuario } from '../../../services/apiservices';
import { postDetalleFacturaUsu } from '../../../services/apiservices';
import { postObtenerTemporadas } from '../../../services/apiservices';
import { postObtenerRazonSocial } from '../../../services/apiservices';
import { SetTemporada } from '../../../services/storage';
import Moment from 'react-moment';
import { alertController } from '../../../services/AlertMessage';
import Form from 'react-bootstrap/Form';
import { IoAddOutline } from 'react-icons/io5';
class GruposNuevo extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0, 10);

        console.log(dateActual)
        this.state = {
            filtroUsuario: '',
            listaFiltros: [],
            listaGrupos: [],
            listaOriginal: [],
            listaParticipantes: [],
            listaParticipantesEditar: [],
            listaEditar: [],
            textoBuscar: '',
            isOpenNuevoGrupo: false,
            isOpenEditarGrupo: false,
            nombreGrupo: '',
            participante: {},
            listaDetalle: [],
            listaDetalleEditar: [],
            listaAgregados: [],
            listaAgregadosEdit: [],
            listaUsuarios: [],
            puntero: 0,
            puntero1: 0,
            grupoSelect: null,
            abierto: false
        };
    }

    async componentDidMount() {
        await this.ObtenerListaGrupos();
        await this.ObtenerListaUsuarios();
        var listaFil = ['Todos', 'Menos de 3 usuarios', 'Hasta 5 usuarios', 'Mas de 10 usuarios'];

        this.setState({ listaFiltros: listaFil });
        await this.ObtenerListaParticipantes();



    }

    agregarCampo = () => {
        var nuevaLista = this.state.listaGrupos;
        console.log('inicio lista', nuevaLista)
        for (let index = 0; index < nuevaLista.length; index++) {
            const element = nuevaLista[index];


            if (index == 0) {
                //element['seleccionado'] = true;
                element['seleccionado'] = false;
            } else {
                element['seleccionado'] = false;
            }
        }
        console.log('Nueva Lista', nuevaLista);
        this.setState({ listaGrupos: nuevaLista });
    }

    agregarParticipantesArray() {
        let listaP = this.state.listaParticipantesEditar;
        var listaEdi = this.state.listaAgregadosEdit;
        for (let index = 0; index < listaP.length; index++) {
            const element = listaP[index];

            if (element.ListDetalle !== null) {
                // Hay detalle
                let detalleP = element.ListDetalle;
                for (let index = 0; index < detalleP.length; index++) {
                    const participanteDet = detalleP[index];
                    if (participanteDet.Estado === 'Agregado') {
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 1
                        };

                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if (!buscaPar) {
                            listaEdi.push(ele);
                        }
                    }

                }

            } else {
                // No hay detalle
                if (element.Estado === 'Agregado') {
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if (!buscaPar) {
                        listaEdi.push(ele);
                    }
                }
            }
        }
        console.log('Lista al entrar Editar', listaEdi);
        this.setState({ listaAgregadosEdit: listaEdi });
    }

    ObtenerListaUsuarios() {
        return new Promise((resolve) => {
            postObtenerListaUsuario().then((res) => {
                console.log('despues de registrar correo', res);
                if (res.ListaUsuario) {
                    this.setState({ listaUsuarios: res.ListaUsuario });
                }
                resolve(true);
            });
        })
    }

    ObtenerListaGrupos() {
        return new Promise((resolve) => {
            postObtenerListaGrupo().then((res) => {
                console.log("Lista Grupos", res);
                if (res.ListaGrupo) {
                    this.setState({ listaGrupos: res.ListaGrupo });
                    this.setState({ listaOriginal: res.ListaGrupo });
                    this.agregarCampo();
                }
                resolve(true);
            });
        })
    }

    ObtenerListaParticipantesEditar(nroP, idGrupo) {
        return new Promise((resolve) => {
            postObtenerListaParticipantes(nroP, idGrupo).then((res) => {

                if (res.ListaParticipante) {
                    var listaN = res.ListaParticipante.filter(data => data.Correo !== '')
                    this.setState({ listaParticipantesEditar: listaN });
                    console.log("Lista Part Editar", listaN);
                    this.agregarParticipantesArray();
                }
                resolve(true);
            });
        })
    }

    ObtenerListaParticipantes() {
        return new Promise((resolve) => {
            postObtenerListaParticipantes(0, 0).then((res) => {
                console.log("Lista Part", res);
                if (res.ListaParticipante) {
                    var listaN = res.ListaParticipante//.filter(data => data.Correo !== '' && data.Estado === 'Agregar')
                    this.setState({ listaParticipantes: listaN });
                }
                resolve(true);
            });
        })
    }

    handleShow = () => {
        this.setState({ nombreGrupo: '' })
        this.setState({ isOpenNuevoGrupo: true });
    }
    handleClose = () => {
        this.setState({ isOpenNuevoGrupo: false });
    }

    handleShowEditar = () => {


        if (this.state.grupoSelect === null) {
            alertController('Error', "Debe seleccionar un grupo para editar", 3).then();
            return;
        }
        this.setState({ listaAgregadosEdit: [] });

        this.setState({ isOpenEditarGrupo: true });
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        console.log(grupo);
        if (grupo) {
            this.setState({ nombreGrupo: grupo.DescripcionGrupo });
            this.ObtenerListaParticipantesEditar(grupo.Participantes, grupo.Idgrupo);

        }
    }
    handleCloseEditar = () => {
        this.setState({ isOpenEditarGrupo: false });
    }

    getBuscar(e) {
        console.log(e.target.value);
        this.setState({ textoBuscar: e.target.value });

        let nuevaLista = this.state.listaOriginal.filter(data => {
            return data.Idgrupo.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
                data.DescripcionGrupo.toLowerCase().includes(e.target.value.toLowerCase()) ||
                data.Participantes.toString().toLowerCase().includes(e.target.value.toLowerCase());
        });
        console.log(nuevaLista);
        if (e.target.value !== '') {
            this.setState({ listaGrupos: nuevaLista });
        } else {
            this.setState({ listaGrupos: this.state.listaOriginal });
        }

    }

    getNombreGrupo(e) {
        console.log(e.target.value)
        this.setState({ nombreGrupo: e.target.value });
    }

    CambiarFiltro = (codFiltro) => {
        console.log(codFiltro);
        this.setState({ filtroUsuario: codFiltro });

        if (codFiltro === 'Todos') {
            this.setState({ listaGrupos: this.state.listaOriginal });
        }

        if (codFiltro === 'Menos de 3 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter(data => data.Participantes < 3);
            console.log(nuevaLista);
            this.setState({ listaGrupos: nuevaLista });
        }

        if (codFiltro === 'Hasta 5 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter(data => data.Participantes <= 5);
            console.log(nuevaLista);
            this.setState({ listaGrupos: nuevaLista });
        }

        if (codFiltro === 'Mas de 10 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter(data => data.Participantes > 10);
            console.log(nuevaLista);
            this.setState({ listaGrupos: nuevaLista });
        }
    }

    cambiarIcono = (participante, index) => {
        console.log("aqui", participante);
        if (!participante) {
            participante = [];
        }
        this.setState({ participante: participante });
        this.setState({ listaDetalle: participante.ListDetalle });
        this.setState({ puntero: index });
    }

    abrirDetalle = (participante1, index) => {

        console.log("aqui", participante1);
        if (!participante1) {
            participante1 = [];
        }
        //this.agregarListaDetalle(participante1.ListDetalle);
        this.setState({ listaDetalleEditar: participante1.ListDetalle });
        this.setState({ puntero1: index });
    }

    onCheck(val, puntero) {
        console.log("target", val);
        this.setState({ grupoSelect: val });
        const listaNueva = this.state.listaGrupos;
        for (let index = 0; index < listaNueva.length; index++) {
            const element = listaNueva[index];
            element.selected = false;
        }

        listaNueva[val].selected = true;
        this.setState({ listaGrupos: listaNueva });

        for (let index = 0; index < this.state.listaGrupos.length; index++) {
            const element = this.state.listaGrupos[index];
            element.seleccionado = false;
        }
        this.state.listaGrupos[puntero].seleccionado = true;

    }
    async eliminarGrupo() {
        let boolean = await alertController('¿Está seguro que desea eliminar el grupo?', 'Estos usuarios ya no podrán visualizar la información de otros usuarios dentro del grupo', 2).then();
        if (!boolean) {
            return;
        }
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        console.log(grupo);
        if (grupo) {
            this.eliminarGrupoParticipantes(grupo.Idgrupo, 0, GetUsuario());

        }
    }

    agregarParticipanteCab(participante,cab) {
        if (cab=="c") {
            participante.Estado = participante.Estado === 'Agregar Todos' ? 'Agregados' : 'Agregar Todos';
        }else{
            participante.Estado = participante.Estado === 'Agregar' ? 'Agregado' : 'Agregar';
        }
        
        const ele = {
            CodArmador: participante.CodArmador,
            Correo: participante.Correo,
            IndicadorAdd: 1
        };
        var lista = this.state.listaAgregados;

        if(cab=="c"){
            if (participante.Estado === 'Agregados') {
                //CABECERA
                const element1 = participante;
                const ele1 = {
                    CodArmador: element1.CodArmador,
                    Correo: element1.Correo,
                    IndicadorAdd: 1
                };
                let ele2 = lista.find(data => data.Correo === ele1.Correo);
                if(!ele2){
                    lista.push(ele1);
                    //element.Estado = 'Agregado'
                }

                //DETALLE
                participante.ListDetalle.forEach(element => {
                    element.Estado = 'Agregado';
                    let elem = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    lista.push(elem);   
                });
                
                this.setState({ listaAgregados: lista });
            } else {
                participante.ListDetalle.forEach(element => {
                    element.Estado = 'Agregar';
                    lista = lista.filter(data => data.Correo !== element.Correo);
                    this.setState({ listaAgregados: lista });
                });
                
            }
        }else{
            if (participante.Estado === 'Agregado') {
                lista.push(ele);
                this.setState({ listaAgregados: lista });
            } else {
                lista = lista.filter(data => data.Correo !== ele.Correo);
                this.setState({ listaAgregados: lista });
            }
        }
        console.log("Lista para agregar", lista);
    }

    agregarListaDetalle(detalle) {
        var lista = this.state.listaAgregadosEdit;
        for (let index = 0; index < detalle.length; index++) {
            const element = detalle[index];

            if (element.Estado === 'Agregado') {
                const ele = {
                    CodArmador: element.CodArmador,
                    Correo: element.Correo,
                    IndicadorAdd: 1
                };
                lista.push(ele);
            }
        }
        this.setState({ listaAgregadosEdit: lista });
    }

    verificarDetalleEstado(detalle) {
        var estado = '';
        var det = detalle.filter(data => data.Estado === 'Agregado');
        if (det.length === detalle.length) {
            estado = 'Agregado';
        } else {
            estado = 'Agregar';
        }
        this.setState({ listaDetalleEditar: detalle });
        let encabezado = this.state.listaParticipantesEditar[this.state.puntero1];
        encabezado.Estado = estado;
    }
    editarParticipanteDet(participanteDet, index) {
        participanteDet.Estado = participanteDet.Estado === 'Agregar' ? 'Agregado' : 'Agregar';
        const ele = {
            CodArmador: participanteDet.CodArmador,
            Correo: participanteDet.Correo,
            IndicadorAdd: 1
        };

        var lista = this.state.listaAgregadosEdit;

        if (participanteDet.Estado === 'Agregado') {
            lista.push(ele);
            this.setState({ listaAgregadosEdit: lista });
        } else {
            lista = lista.filter(data => data.Correo !== ele.Correo);
            this.setState({ listaAgregadosEdit: lista });
        }
        this.verificarDetalleEstado(this.state.listaDetalleEditar);
        console.log("Lista para agregar editar", lista);
    }

    editarParticipanteCab(participante) {
        participante.Estado = participante.Estado === 'Agregar' ? 'Agregado' : 'Agregar';

        if (participante.ListDetalle === null) {
            // No tiene lista detalle
            const ele = {
                CodArmador: participante.CodArmador,
                Correo: participante.Correo,
                IndicadorAdd: 1
            };
            var lista = this.state.listaAgregadosEdit;

            if (participante.Estado === 'Agregado') {
                lista.push(ele);
                this.setState({ listaAgregadosEdit: lista });
            } else {
                lista = lista.filter(data => data.Correo !== ele.Correo);
                this.setState({ listaAgregadosEdit: lista });
            }
            console.log("Lista para agregar editar", lista);
        } else {
            // Se tiene una lista de agregados
            var lista = this.state.listaAgregadosEdit;

            if (participante.Estado === 'Agregado') {
                for (let index = 0; index < participante.ListDetalle.length; index++) {
                    const element = participante.ListDetalle[index];
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let ele2 = lista.find(data => data.Correo === ele.Correo);
                    if (!ele2) {
                        lista.push(ele);
                        element.Estado = 'Agregado'
                    }

                }
                this.setState({ listaAgregadosEdit: lista });
            } else {

                for (let index = 0; index < participante.ListDetalle.length; index++) {
                    const element = participante.ListDetalle[index];
                    lista = lista.filter(data => data.Correo !== element.Correo);
                    element.Estado = 'Agregar'
                }
                this.setState({ listaAgregadosEdit: lista });

            }
            console.log("Lista para agregar editar", lista);
        }




    }

    async guardarAgregados() {

        if (this.state.listaAgregados.length === 0) {
            alertController('Error', "Debe agregar por lo menos un participante", 3).then();
            return;
        }
        let boolean = await alertController('Advertencia', "¿Está seguro que desea crear un grupo nuevo?", 2).then();
        console.log(boolean)
        if (!boolean) {
            return;
        }
        await this.registrarNuevoGrupo(0, this.state.nombreGrupo, GetUsuario(), this.state.listaAgregados);
    }

    async guardarAgregadosEditar() {
        console.log('Estado Final', this.state.listaParticipantesEditar);
        if (this.state.listaAgregadosEdit.length === 0) {
            alertController('Error', "Debe agregar por lo menos un participante", 3).then();
            return;
        }
        let boolean = await alertController('Advertencia', "¿Está seguro que desea actualizar el grupo?", 2).then();
        console.log(boolean)
        if (!boolean) {
            return;
        }

        this.agregarTodosLosParticipantes();

        let codigoGrupo = Number(GetGrupo());
        if (codigoGrupo) {
            let grupo = this.state.listaGrupos.find(data => data.Idgrupo === codigoGrupo);
            if (grupo) {
                await this.actualizarGrupo(grupo.Idgrupo, this.state.nombreGrupo, GetUsuario(), this.state.listaAgregadosEdit);
            }
        }

    }

    agregarTodosLosParticipantes() {
        let listaP = this.state.listaParticipantesEditar;
        var listaEdi = this.state.listaAgregadosEdit;
        for (let index = 0; index < listaP.length; index++) {
            const element = listaP[index];

            if (element.ListDetalle !== null) {
                // Hay detalle
                let detalleP = element.ListDetalle;
                for (let index = 0; index < detalleP.length; index++) {
                    const participanteDet = detalleP[index];
                    if (participanteDet.Estado === 'Agregado') {
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 1
                        };

                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if (!buscaPar) {
                            listaEdi.push(ele);
                        }
                    } else {
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 0
                        };
                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if (!buscaPar) {
                            listaEdi.push(ele);
                        }
                    }

                }

            } else {
                // No hay detalle
                if (element.Estado === 'Agregado') {
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if (!buscaPar) {
                        listaEdi.push(ele);
                    }
                } else {
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 0
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if (!buscaPar) {
                        listaEdi.push(ele);
                    }
                }
            }
        }
        console.log("Final edit", listaEdi)
        this.setState({ listaAgregadosEdit: listaEdi });
    }
    actualizarGrupo(idGrupo, nombreGrupo, usuario, listaParti) {
        return new Promise((resolve) => {
            postRegistroGrupo(idGrupo, nombreGrupo, usuario, listaParti).then((res) => {
                console.log("respuesta grupo Editar", res);
                if (res.Success === true) {
                    alertController('Información', res.Message, 1);

                    this.ObtenerListaGrupos();
                    this.volverGrupos();
                } else {
                    alertController('Error', res.Message, 3);
                }
                resolve(true);
            });
        })

    }

    registrarNuevoGrupo(idGrupo, nombreGrupo, usuario, listaParti) {
        return new Promise((resolve) => {
            postRegistroGrupo(idGrupo, nombreGrupo, usuario, listaParti).then((res) => {
                console.log("respuesta grupo", res);
                if (res.Success === true) {
                    alertController('Información', res.Message, 1);
                    //this.ObtenerListaGrupos();
                    this.volverGrupos();
                } else {
                    alertController('Error', res.Message, 3);
                }
                resolve(true);
            });
        })

    }

    eliminarGrupoParticipantes(idGrupo, activo, usuario) {
        return new Promise((resolve) => {
            postEliminarGrupoParticipantes(idGrupo, activo, usuario).then((res) => {
                console.log("respuesta eliminar", res);
                if (res.Success === true) {
                    alertController('Información', res.Message, 1);
                    this.ObtenerListaGrupos();
                } else {
                    alertController('Error', res.Message, 3);
                }
                resolve(true);
            });
        })
    }

    CambiarOpcion = (codigo) => {

        if (codigo === 1) {
            SetAyuda("Usuarios");
            let path = `/Usuarios`;
            this.props.history.push(path);
        }

        if (codigo === 2) {
            SetAyuda("Grupos");
            let path = `/Grupos`;
            this.props.history.push(path);
        }

    }
    volverGrupos = () => {
        SetAyuda("GruposNuevo");
        let path = `/Grupos`;
        this.props.history.push(path);
    }
    render() {
        const filtros = this.state.listaFiltros;
        const grupos = this.state.listaGrupos;
        const listaPar = this.state.listaParticipantes;
        const parti = this.state.listaDetalle;
        const parti1 = this.state.listaDetalleEditar;
        const listaEditar = this.state.listaParticipantesEditar;
        const puntero = this.state.puntero;
        const listaDetalle2 = this.state.listaDetalle;
        const abierto = this.state.abierto;
        return (
            <>
                <Container style={{
                    maxWidth: "100%", background: 'linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)',
                    bottom: "0",
                    top: "0",
                    minHeight: '100vh'
                }}>
                    <Row>
                        <Col xs={0} md={4}>
                            <div className="css_div_pri">
                                <div>
                                    <label style={{ fontSize: '32px', fontWeight: 'bold' }}>Configuración </label>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Row style={{ marginLeft: '0px', marginRight: '0', width: '100%' }}>
                                        <Col xs={6} md={6} style={{ padding: '15px 10px 10px 0px' }}>
                                            <Card style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                                height: '140px',
                                                background: '#FFFFFF',
                                                color: '#184A7D'
                                            }}
                                                onClick={() => this.CambiarOpcion(1)}>
                                                <Card.Body>

                                                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                        <label style={{ fontSize: '24px' }}>Usuarios</label>
                                                    </div>
                                                    <Card.Title style={{ fontSize: '13px', fontWeight: 'bold' }}>{this.state.listaUsuarios ? this.state.listaUsuarios.length : 0} usuarios</Card.Title>

                                                    <div style={{ fontSize: '12px' }}>

                                                    </div>

                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <Col xs={6} md={6} style={{ padding: '15px 0px 10px 10px' }}>
                                            <Card style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                                height: '140px',
                                                background: '#06426B',
                                                color: '#FFFFFF'
                                            }}
                                                onClick={() => this.CambiarOpcion(2)}>
                                                <Card.Body>
                                                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                        <label style={{ fontSize: '24px' }}>Grupos</label>
                                                    </div>
                                                    <Card.Title style={{ fontSize: '13px', fontWeight: 'bold' }}>{this.state.listaGrupos ? this.state.listaGrupos.length : 0} grupos</Card.Title>

                                                    <div style={{ fontSize: '12px', color: '#9CA5CA' }}>

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

                        <Col xs={12} md={8} style={{ background: '#E0E5F0', minHeight: '100vh', top: '0', bottom: '0', right: '0', padding: '0' }}>
                            <>
                                <Container style={{ padding: '0', margin: '0', maxWidth: '100%' }}>
                                    <div onClick={() => this.volverGrupos()}
                                        style={{ background: '#E0E5F0', margin: '20px 5%', display: 'flex' }}>
                                        <FaChevronLeft style={{ alignSelf: 'center', color: '#184A7D', fontSize: '17px', marginRight: '10px' }} />
                                        <div style={{ fontSize: '16px', color: '#184A7D', fontWeight: 'bold' }}>
                                            Nuevo Grupo
                                        </div>
                                    </div>
                                    <div style={{ background: 'E0E5F0' }}>
                                        <div style={{ margin: '10px 5% 10px 5%' }}>

                                            <div>
                                                <label style={{ color: '#576774', fontWeight: '600' }}>ESCRIBA EL NOMBRE DEL GRUPO</label>
                                                <input style={{
                                                    height: '40px',
                                                    width: '400px',
                                                    marginRight: '10px'
                                                }}
                                                    className="form-control"
                                                    value={this.state.nombreGrupo}
                                                    onChange={e => this.getNombreGrupo(e)} />

                                            </div>
                                            <div style={{ marginTop: '20px' }}>
                                                <label style={{ color: '#576774', fontWeight: '600' }}>SELECCIONE PARTICIPANTES</label>
                                                <div style={{ color: '#184A7D', fontSize: '12px', fontWeight: 'bold', textAlign: 'end' }}>
                                                    <FaSort />
                                                    ORDENAR
                                                </div>
                                                <div style={{ borderRadius: '8px', background: 'white' }}>
                                                    <Row style={{
                                                        color: '#576774',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        height: '50px',
                                                        background: '#FFFFFF',
                                                        width: '100%',
                                                        margin: '0px',
                                                        textAlign: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: '5px 5px 0px 0px'
                                                    }}>
                                                        <Col xs={3} style={{ textAlign: 'center' }}>RAZÓN SOCIAL</Col>
                                                        <Col xs={2} style={{ textAlign: 'center' }}>RUC</Col>
                                                        <Col xs={4} style={{ textAlign: 'center' }}>EMAIL</Col>
                                                        <Col xs={2} style={{ textAlign: 'left', paddingLeft: '3.5%' }}>ESTADO</Col>
                                                        <Col xs={1}></Col>
                                                    </Row>
                                                    <Accordion style={{ height: '600px', overflow: 'auto', borderRadius: '0px 0px 8px 8px' }}>
                                                        {listaPar.map((usuario, index) =>
                                                            <Card style={{ paddingRight: '0px' }}>
                                                                <Card.Header style={{ background: '#FFFFFF' }}>

                                                                    <div style={{ display: 'flex' }}>
                                                                        <div style={{ width: '100%' }}>
                                                                            <Row style={{ alignItems: 'center', fontSize: '11.7px', color: '#576774' }}>
                                                                                <Col xs={3} style={{ textAlign: 'center' }}> {usuario.RAZON_SOCIAL} </Col>
                                                                                <Col xs={2} style={{ textAlign: 'center' }}> {usuario.RUC}</Col>
                                                                                <Col xs={4} style={{ textAlign: 'center' }}>
                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                        {usuario.Correo &&
                                                                                            <div style={{ background: '#D7DEEC', textAlign: 'center', width: '88%', borderRadius: '8px', padding: '4px' }}>
                                                                                                {usuario.Correo}
                                                                                            </div>
                                                                                        }
                                                                                        {!usuario.Correo &&
                                                                                            <div>
                                                                                                -
                                                                                            </div>
                                                                                        }

                                                                                        {usuario.ListDetalle && usuario.ListDetalle.length > 0 && <div style={{ alignSelf: 'center', background: '#295F96', color: '#FFFFFF', padding: '5px', borderRadius: '5px' }}>
                                                                                            {usuario.ListDetalle ? usuario.ListDetalle.length + 1 : 0}
                                                                                        </div>}


                                                                                    </div>

                                                                                </Col>
                                                                                <Col xs={2} style={{ textAlign: 'center', padding: '0px 3px 0px 3px' }}>

                                                                                    <Button onClick={() => this.agregarParticipanteCab(usuario,(usuario.ListDetalle!=null)?"c":"")}
                                                                                        style={{
                                                                                            padding: '5px',
                                                                                            background: (usuario.Estado.startsWith("Agregado") ? '#74AE2A' : '#184A7D'),
                                                                                            color: '#FFFFFF',
                                                                                            fontWeight: '500',
                                                                                            borderRadius: '7px',
                                                                                            border: 'none',
                                                                                            fontSize: '11.7px',
                                                                                            width: '100%'
                                                                                        }}>
                                                                                        {usuario.Estado}
                                                                                    </Button>
                                                                                </Col>
                                                                                <Col xs={1} style={{ padding: '0px 3px 0px 3px' }}>
                                                                                    {usuario.ListDetalle !== null &&
                                                                                        <Accordion.Toggle as={Button}
                                                                                            variant="link" eventKey={index + 1}
                                                                                            style={{ textAlign: 'end' }}
                                                                                            onClick={(item) => {
                                                                                                this.cambiarIcono(usuario, usuario.ListDetalle, index);
                                                                                                console.log(item);
                                                                                            }}
                                                                                        >
                                                                                            <FaAngleDown style={{ fontSize: '20px' }} />
                                                                                        </Accordion.Toggle>
                                                                                    }

                                                                                </Col>
                                                                            </Row>
                                                                        </div>

                                                                    </div>
                                                                </Card.Header>
                                                                <Accordion.Collapse eventKey={index + 1} style={{ overflowY: 'auto', maxHeight: '500px' }}>
                                                                    <>
                                                                        {listaDetalle2.map((detalleUsu, index) =>
                                                                            <Card.Body style={{ padding: '0px', background: '#F4F6FB' }}>
                                                                                <Card.Header style={{ paddingTop: '10px', paddingBottom: '10px', background: '#F4F6FB' }}>

                                                                                    <div style={{ display: 'flex' }}>
                                                                                        <div style={{ width: '100%' }}>
                                                                                            <Row style={{ alignItems: 'center', fontSize: '11.7px', color: '#576774' }}>
                                                                                                <Col xs={3} style={{ padding: '0px 3px 0px 3px' }}> {detalleUsu.RAZON_SOCIAL} </Col>
                                                                                                <Col xs={2} style={{ padding: '0px 3px 0px 3px' }}> {detalleUsu.RUC}</Col>
                                                                                                <Col xs={4} style={{}}>
                                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                                                        {detalleUsu.Correo &&
                                                                                                            <div style={{ background: '#D7DEEC', width: '88%', textAlign: 'center', borderRadius: '8px', padding: '4px' }}>
                                                                                                                {detalleUsu.Correo}
                                                                                                            </div>
                                                                                                        }
                                                                                                        {!detalleUsu.Correo &&
                                                                                                            <div>
                                                                                                                -
                                                                                                            </div>
                                                                                                        }

                                                                                                    </div>

                                                                                                </Col>
                                                                                                <Col xs={2} style={{ textAlign: 'center', padding: '0px 3px 0px 3px' }}>
                                                                                                    <Button onClick={() => this.agregarParticipanteCab(detalleUsu,"")}
                                                                                                        style={{
                                                                                                            padding: '5px',
                                                                                                            background: (detalleUsu.Estado=="Agregar" ? '#184A7D' : '#74AE2A'),
                                                                                                            color: '#FFFFFF',
                                                                                                            fontWeight: '500',
                                                                                                            borderRadius: '7px',
                                                                                                            border: 'none',
                                                                                                            fontSize: '11.7px',
                                                                                                            width: '100%'
                                                                                                        }}>
                                                                                                        {detalleUsu.Estado}
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
                                            </div>
                                        </div>
                                        <div style={{ background: 'E0E5F0', margin: '10px 5% 10px 5%', textAlign: 'end' }}>
                                            <Button onClick={() => this.volverGrupos()} style={{ background: '#9CA5CA', border: '1px solid #9CA5CA', width: '200px', marginRight: '10px' }}> Cerrar</Button>
                                            <Button onClick={() => this.guardarAgregados()}
                                                style={{ background: '#0076BC', width: '200px' }}> Guardar</Button>
                                        </div>
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
export default GruposNuevo