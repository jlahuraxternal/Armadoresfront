import React, {useState} from 'react';
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import  './Grupos.css';
import {GetUsuario, GetArmador, GetTemporada, SetAyuda, SetGrupo} from '../../../services/storage';
import {FaAngleDown} from "react-icons/fa";
import {FaSort} from "react-icons/fa";
import {FaQuestionCircle} from 'react-icons/fa';
import {FaChevronRight,FaChevronLeft} from 'react-icons/fa';
import {postEliminarGrupoParticipantes, postObtenerCobrosFact, postObtenerListaGrupo, postObtenerListaParticipantes, postObtenerListaUsuario, postRegistroGrupo, postRegistroUsuario} from '../../../services/apiservices';
import {postDetalleFacturaUsu} from '../../../services/apiservices';
import {postObtenerTemporadas} from '../../../services/apiservices';
import {postObtenerRazonSocial} from '../../../services/apiservices';
import {SetTemporada} from '../../../services/storage';
import Moment from 'react-moment';
import {alertController} from '../../../services/AlertMessage';
import Form from 'react-bootstrap/Form';
class GruposConfi  extends React.Component{

    constructor(props){
        super(props);
        
        var date = new Date();
        console.log(date);
        var dateActual = date.toISOString().substr(0,10);
        
        console.log(dateActual)
        this.state = {
            filtroUsuario:'',
            listaFiltros:[],
            listaGrupos:[],
            listaOriginal:[],
            listaParticipantes:[],
            listaParticipantesEditar:[],
            listaEditar:[],
            textoBuscar:'',
            isOpenNuevoGrupo: false,
            isOpenEditarGrupo: false,
            nombreGrupo:'',
            participante:{},
            listaDetalle:[],
            listaDetalleEditar:[],
            listaAgregados:[],
            listaAgregadosEdit:[],
            listaUsuarios:[],
            puntero:0,
            puntero1:0,
            grupoSelect:null
        };
    }

    async componentDidMount() {
        await this.ObtenerListaGrupos();
        await this.ObtenerListaUsuarios();
        var listaFil = ['Todos','Menos de 3 usuarios', 'Hasta 5 usuarios', 'Mas de 10 usuarios'];
    
        this.setState({listaFiltros: listaFil});
        await this.ObtenerListaParticipantes();
        
    }

    agregarCampo=()=>{
        var nuevaLista = this.state.listaGrupos;
        console.log('inicio lista', nuevaLista)
        for (let index = 0; index < nuevaLista.length; index++) {
            const element = nuevaLista[index];
           

            if(index == 0){
                //element['seleccionado'] = true;
                element['seleccionado'] = false;
            }else{
                element['seleccionado'] = false;
            }
        }
        console.log('Nueva Lista',nuevaLista);
        this.setState({listaGrupos: nuevaLista});
    }

    agregarParticipantesArray(){
        let listaP = this.state.listaParticipantesEditar;
        var listaEdi = this.state.listaAgregadosEdit;
        for (let index = 0; index < listaP.length; index++) {
            const element = listaP[index];
            
            if (element.ListDetalle !== null){
                // Hay detalle
                let detalleP = element.ListDetalle;
                for (let index = 0; index < detalleP.length; index++) {
                    const participanteDet = detalleP[index];
                    if(participanteDet.Estado === 'Agregado'){
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 1
                        };
                        
                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if(!buscaPar){
                            listaEdi.push(ele);
                        }
                    }
                    
                }

            }else{
                // No hay detalle
                if(element.Estado === 'Agregado'){
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if(!buscaPar){
                        listaEdi.push(ele);
                    }
                }
            }
        }
        console.log('Lista al entrar Editar', listaEdi);
        this.setState({listaAgregadosEdit: listaEdi});
    }

    ObtenerListaUsuarios(){
        return new Promise((resolve)=>{
            postObtenerListaUsuario().then((res)=>{
                   console.log('despues de registrar correo',res);
                    if(res.ListaUsuario){
                        this.setState({listaUsuarios:res.ListaUsuario});
                    }
                    resolve(true);
            });
        })    
    }

    ObtenerListaGrupos(){
        return new Promise((resolve)=>{
            postObtenerListaGrupo().then((res)=>{
                    console.log("Lista Grupos", res);
                   if(res.ListaGrupo) {
                        this.setState({listaGrupos: res.ListaGrupo});
                        this.setState({listaOriginal: res.ListaGrupo});
                        this.agregarCampo();
                   }
                   resolve(true);
            });
        })    
    }

    ObtenerListaParticipantesEditar(nroP, idGrupo){
        return new Promise((resolve)=>{
            postObtenerListaParticipantes(nroP,idGrupo).then((res)=>{
                    
                   if(res.ListaParticipante) {
                        var listaN = res.ListaParticipante.filter( data => data.Correo !=='')
                        this.setState({listaParticipantesEditar: listaN});
                        console.log("Lista Part Editar", listaN);
                        this.agregarParticipantesArray();
                   }
                   resolve(true);
            });
        })    
    }

    ObtenerListaParticipantes(){
        return new Promise((resolve)=>{
            postObtenerListaParticipantes(0,0).then((res)=>{
                    console.log("Lista Part", res);
                   if(res.ListaParticipante) {
                        var listaN = res.ListaParticipante.filter( data => data.Correo !=='' && data.Estado ==='Agregar')
                        this.setState({listaParticipantes: listaN});
                   }
                   resolve(true);
            });
        })    
    }

    handleShow = () => {
        this.setState({nombreGrupo:''})
        this.setState({isOpenNuevoGrupo: true});
    }
    handleClose = () =>{
        this.setState({isOpenNuevoGrupo: false});
    }

    irNuevoGrupo=()=>{
        SetAyuda("GruposNuevo");
        let path = `/GruposNuevo`;
        this.props.history.push(path);
    }
    irEditarGrupo=()=>{
        if (this.state.grupoSelect === null){
            alertController('Error', "Debe seleccionar un grupo para editar",3).then();
            return;
        }
        this.setState({listaAgregadosEdit:[]});
        
        this.setState({isOpenEditarGrupo: true});
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        console.log(grupo);
        SetGrupo(grupo.Idgrupo);
        /* if(grupo){
            this.setState({nombreGrupo:grupo.DescripcionGrupo});
            this.ObtenerListaParticipantesEditar(grupo.Participantes,grupo.Idgrupo);
            
        } */

        SetAyuda("GruposEditar");
        let path = `/GruposEditar`;
        this.props.history.push(path);
    }
    handleShowEditar = () => {
        

        if (this.state.grupoSelect === null){
            alertController('Error', "Debe seleccionar un grupo para editar",3).then();
            return;
        }
        this.setState({listaAgregadosEdit:[]});
        
        this.setState({isOpenEditarGrupo: true});
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        console.log(grupo);
        if(grupo){
            this.setState({nombreGrupo:grupo.DescripcionGrupo});
            this.ObtenerListaParticipantesEditar(grupo.Participantes,grupo.Idgrupo);
            
        }
    }
    handleCloseEditar = () =>{
        this.setState({isOpenEditarGrupo: false});
    }

    getBuscar(e) {
        console.log(e.target.value);
        this.setState({textoBuscar: e.target.value}); 

        let nuevaLista = this.state.listaOriginal.filter( data => {
            return data.Idgrupo.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
                   data.DescripcionGrupo.toLowerCase().includes(e.target.value.toLowerCase()) ||
                   data.Participantes.toString().toLowerCase().includes(e.target.value.toLowerCase());
        });
        console.log(nuevaLista);
        if(e.target.value !== ''){
            this.setState({listaGrupos: nuevaLista});
        }else{
            this.setState({listaGrupos: this.state.listaOriginal});
        }

    }
    
    getNombreGrupo(e) {
        console.log(e.target.value)
        this.setState({nombreGrupo: e.target.value}); 
    }

    CambiarFiltro=(codFiltro)=>{
        console.log(codFiltro);
        this.setState({filtroUsuario:codFiltro});

        if (codFiltro === 'Todos') {
            this.setState({listaGrupos: this.state.listaOriginal});
        }

        if (codFiltro === 'Menos de 3 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Participantes < 3);
            console.log(nuevaLista);
            this.setState({listaGrupos: nuevaLista});
        }

        if (codFiltro === 'Hasta 5 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Participantes <=5);
            console.log(nuevaLista);
            this.setState({listaGrupos: nuevaLista});
        }

        if (codFiltro === 'Mas de 10 usuarios') {
            let nuevaLista = this.state.listaOriginal.filter( data => data.Participantes > 10);
            console.log(nuevaLista);
            this.setState({listaGrupos: nuevaLista});
        }
    }

    cambiarIcono=(participante,index)=>{
        console.log("aqui", participante);
        if (!participante){
            participante = [];
        }
        this.setState({participante:participante});
        this.setState({listaDetalle: participante.ListDetalle});
        this.setState({puntero: index});
    }

    abrirDetalle=(participante1,index)=>{
        
        console.log("aqui", participante1);
        if (!participante1){
            participante1 = [];
        }
        //this.agregarListaDetalle(participante1.ListDetalle);
        this.setState({listaDetalleEditar: participante1.ListDetalle});
        this.setState({puntero1: index});
    }

    onCheck(val, puntero) {
        console.log("target", val);
        this.setState({grupoSelect: val});
        const listaNueva = this.state.listaGrupos;
        for (let index = 0; index < listaNueva.length; index++) {
            const element = listaNueva[index];
            element.selected = false;  
        }
        
        listaNueva[val].selected = true;
        this.setState({listaGrupos: listaNueva});

        for (let index = 0; index < this.state.listaGrupos.length; index++) {
            const element = this.state.listaGrupos[index];
            element.seleccionado = false;
        }
        this.state.listaGrupos[puntero].seleccionado = true;

    }
    async eliminarGrupo(){
        let boolean = await alertController('¿Está seguro que desea eliminar el grupo?','Estos usuarios ya no podrán visualizar la información de otros usuarios dentro del grupo',2).then();
        if (!boolean){
            return;
        }
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        console.log(grupo);
        if(grupo){
            this.eliminarGrupoParticipantes(grupo.Idgrupo,0,GetUsuario());
            
        }
    }

    agregarParticipanteCab(participante){
        participante.Estado = participante.Estado ==='Agregar'? 'Agregado':'Agregar';
        const ele = {
            CodArmador: participante.CodArmador,
            Correo: participante.Correo,
            IndicadorAdd: 1
        };
        var lista = this.state.listaAgregados;

        if (participante.Estado === 'Agregado'){
            lista.push(ele);
            this.setState({listaAgregados: lista});
        }else{
            lista = lista.filter( data => data.Correo !==ele.Correo);
            this.setState({listaAgregados: lista});
        }
        console.log("Lista para agregar", lista);  
    }

    agregarListaDetalle(detalle){
        var lista = this.state.listaAgregadosEdit;
        for (let index = 0; index < detalle.length; index++) {
            const element = detalle[index];
            
            if(element.Estado === 'Agregado'){
                const ele = {
                    CodArmador: element.CodArmador,
                    Correo: element.Correo,
                    IndicadorAdd: 1
                };
                lista.push(ele);
            }
        }
        this.setState({listaAgregadosEdit: lista});
    }

    verificarDetalleEstado(detalle){
        var estado = '';
        var det = detalle.filter(data => data.Estado === 'Agregado');
        if(det.length === detalle.length){
            estado = 'Agregado';
        }else{
            estado =  'Agregar';
        }
        this.setState({listaDetalleEditar: detalle});
        let encabezado = this.state.listaParticipantesEditar[this.state.puntero1];
        encabezado.Estado = estado;
    }
    editarParticipanteDet(participanteDet,index){
        participanteDet.Estado = participanteDet.Estado ==='Agregar'? 'Agregado':'Agregar';
        const ele = {
            CodArmador: participanteDet.CodArmador,
            Correo: participanteDet.Correo,
            IndicadorAdd: 1
        };

        var lista = this.state.listaAgregadosEdit;
        
        if (participanteDet.Estado === 'Agregado'){
            lista.push(ele);
            this.setState({listaAgregadosEdit: lista});
        }else{
            lista = lista.filter( data => data.Correo !==ele.Correo);
            this.setState({listaAgregadosEdit: lista});
        }
        this.verificarDetalleEstado(this.state.listaDetalleEditar);
        console.log("Lista para agregar editar", lista);  
    }

    editarParticipanteCab(participante){
        participante.Estado = participante.Estado ==='Agregar'? 'Agregado':'Agregar';

        if(participante.ListDetalle === null){
            // No tiene lista detalle
            const ele = {
                CodArmador: participante.CodArmador,
                Correo: participante.Correo,
                IndicadorAdd: 1
            };
            var lista = this.state.listaAgregadosEdit;

            if (participante.Estado === 'Agregado'){
                lista.push(ele);
                this.setState({listaAgregadosEdit: lista});
            }else{
                lista = lista.filter( data => data.Correo !==ele.Correo);
                this.setState({listaAgregadosEdit: lista});
            }
            console.log("Lista para agregar editar", lista);  
        }else{
            // Se tiene una lista de agregados
            var lista = this.state.listaAgregadosEdit;

            if(participante.Estado === 'Agregado'){
                for (let index = 0; index < participante.ListDetalle.length; index++) {
                    const element = participante.ListDetalle[index];
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let ele2 = lista.find(data => data.Correo === ele.Correo);
                    if(!ele2){
                        lista.push(ele);
                        element.Estado = 'Agregado'
                    }
                    
                }
                this.setState({listaAgregadosEdit: lista});
            }else{

                for (let index = 0; index < participante.ListDetalle.length; index++) {
                    const element = participante.ListDetalle[index];
                    lista = lista.filter( data => data.Correo !==element.Correo);   
                    element.Estado = 'Agregar'
                }
                this.setState({listaAgregadosEdit: lista});
                    
            }
            console.log("Lista para agregar editar", lista); 
        }
        
        

        
    }

    async guardarAgregados(){

        if (this.state.listaAgregados.length === 0 ){
            alertController('Error', "Debe agregar por lo menos un participante",3).then();
            return;
        }
        let boolean = await alertController('Advertencia', "¿Está seguro que desea crear un grupo nuevo?", 2).then();
        console.log(boolean)
        if (!boolean){
            return;
        }
        await this.registrarNuevoGrupo(0, this.state.nombreGrupo, GetUsuario(), this.state.listaAgregados);
    }

    async guardarAgregadosEditar(){
        console.log('Estado Final', this.state.listaParticipantesEditar);
        if (this.state.listaAgregadosEdit.length === 0 ){
            alertController('Error', "Debe agregar por lo menos un participante",3).then();
            return;
        }
        let boolean = await alertController('Advertencia', "¿Está seguro que desea actualizar el grupo?", 2).then();
        console.log(boolean)
        if (!boolean){
            return;
        }

        this.agregarTodosLosParticipantes();
        let grupo = this.state.listaGrupos[this.state.grupoSelect];
        if(grupo){
            await this.actualizarGrupo(grupo.Idgrupo, this.state.nombreGrupo, GetUsuario(), this.state.listaAgregadosEdit);
        }
    }
    
    agregarTodosLosParticipantes(){
        let listaP = this.state.listaParticipantesEditar;
        var listaEdi = this.state.listaAgregadosEdit;
        for (let index = 0; index < listaP.length; index++) {
            const element = listaP[index];
            
            if (element.ListDetalle !== null){
                // Hay detalle
                let detalleP = element.ListDetalle;
                for (let index = 0; index < detalleP.length; index++) {
                    const participanteDet = detalleP[index];
                    if(participanteDet.Estado === 'Agregado'){
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 1
                        };
                        
                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if(!buscaPar){
                            listaEdi.push(ele);
                        }
                    }else{
                        const ele = {
                            CodArmador: participanteDet.CodArmador,
                            Correo: participanteDet.Correo,
                            IndicadorAdd: 0
                        };
                        let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                        if(!buscaPar){
                            listaEdi.push(ele);
                        }
                    }
                    
                }

            }else{
                // No hay detalle
                if(element.Estado === 'Agregado'){
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 1
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if(!buscaPar){
                        listaEdi.push(ele);
                    }
                }else{
                    const ele = {
                        CodArmador: element.CodArmador,
                        Correo: element.Correo,
                        IndicadorAdd: 0
                    };
                    let buscaPar = listaEdi.find(data => data.Correo === ele.Correo);
                    if(!buscaPar){
                        listaEdi.push(ele);
                    }
                }
            }
        }
        console.log("Final edit", listaEdi)
        this.setState({listaAgregadosEdit: listaEdi});
    }
    actualizarGrupo(idGrupo, nombreGrupo, usuario, listaParti){
        return new Promise((resolve)=>{
            postRegistroGrupo(idGrupo, nombreGrupo, usuario, listaParti).then((res)=>{
                   console.log("respuesta grupo Editar", res);
                   if (res.Success === true){
                        alertController('Información', res.Message,1);
                        this.handleCloseEditar();
                        this.ObtenerListaGrupos();
                   }else{
                        alertController('Error', res.Message,3);
                   }
                   resolve(true);
            });
        })    

    }

    registrarNuevoGrupo(idGrupo, nombreGrupo, usuario, listaParti){
        return new Promise((resolve)=>{
            postRegistroGrupo(idGrupo, nombreGrupo, usuario, listaParti).then((res)=>{
                   console.log("respuesta grupo", res);
                   if (res.Success === true){
                        alertController('Información', res.Message,1);
                        this.handleClose();
                        this.ObtenerListaGrupos();
                   }else{
                        alertController('Error', res.Message,3);
                   }
                   resolve(true);
            });
        })    

    }

    eliminarGrupoParticipantes(idGrupo, activo, usuario){
        return new Promise((resolve)=>{
            postEliminarGrupoParticipantes(idGrupo, activo, usuario).then((res)=>{
                   console.log("respuesta eliminar", res);
                   if (res.Success === true){
                        alertController('Información', res.Message,1);
                        this.ObtenerListaGrupos();
                   }else{
                        alertController('Error', res.Message,3);
                   }
                   resolve(true);
            });
        })    
    }

    CambiarOpcion=(codigo)=>{

        if(codigo === 1){
            SetAyuda("Usuarios");
            let path = `/Usuarios`;
            this.props.history.push(path);
        }

        if(codigo === 2){
            SetAyuda("Grupos");
            let path = `/Grupos`;
            this.props.history.push(path);
        }
        
    }
    render(){
        const filtros = this.state.listaFiltros;
        const grupos = this.state.listaGrupos;
        const listaPar = this.state.listaParticipantes;
        const parti = this.state.listaDetalle;
        const parti1 = this.state.listaDetalleEditar;
        const listaEditar = this.state.listaParticipantesEditar;
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
                                                           background: '#FFFFFF',
                                                           color: '#184A7D'}}
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
                                                           background: '#06426B',
                                                           color: '#FFFFFF'}}
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
                    <Modal show={this.state.isOpenNuevoGrupo} 
                        onHide={this.handleClose} 
                        centered
                        size="lg">
                        <Modal.Header closeButton 
                            style={{background:'#F4F6FB'}}>
                            <FaChevronLeft style={{alignSelf:'center', color:'#0076BC', fontSize:'17px', marginRight:'10px'}}/>
                            <Modal.Title style={{fontSize:'16px', color:'#0076BC'}}>
                                Nuevo Grupo
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{background:'#F4F6FB'}}>
                            <div style={{margin:'10px 4% 10px 4%'}}>
                                <div>
                                    <label style={{color:'#576774', fontWeight:'600'}}>ESCRIBA EL NOMBRE DEL GRUPO</label>
                                    <input style={{height:'40px',  
                                                   width:'400px', 
                                                   marginRight:'10px'}}  
                                           className="form-control" 
                                           value={this.state.nombreGrupo ? this.state.nombreGrupo:''} 
                                           onChange={e => this.getNombreGrupo(e)}/>
                                            
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <label style={{color:'#576774', fontWeight:'600'}}>SELECCIONE PARTICIPANTES</label>
                                    <div style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold', textAlign:'end'}}>
                                        <FaSort/>
                                                    ORDENAR
                                    </div>
                                    <div style={{borderRadius:'8px', background:'white'}}>
                                        <Row style={{color:'#576774', 
                                                        fontSize:'12px',
                                                        fontWeight:'bold', 
                                                        height:'50px', 
                                                        width:'100%',
                                                        margin: '0px',
                                                        textAlign:'center',
                                                        alignItems:'center'}}>
                                            <Col xs={1}>GRUPO</Col>
                                            <Col xs={3}>RAZÓN SOCIAL</Col>
                                            <Col xs={2}>RUC</Col>
                                            <Col xs={3}>EMAIL</Col>
                                            <Col xs={2}>ESTADO</Col>
                                            <Col xs={1}></Col>
                                        </Row>
                                        
                                        <Accordion defaultActiveKey="10" style={{maxHeight:'300px', overflow:'auto'}}>
                                        { listaPar.map((participante,index) =>
                                                <Card>
                                                    <Card.Header style={{background: '#FFFFFF'}}>
                                                    
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width:'100%'}}>
                                                            <Row style={{alignItems:'center', fontSize:'13px'}}>
                                                                <Col xs={1}> {participante.Grupo}</Col>
                                                                <Col xs={3}> {participante.RAZON_SOCIAL}</Col>
                                                                <Col xs={2}> {participante.RUC}</Col>
                                                                <Col xs={3}>
                                                                    <div style={{background:'#D7DEEC', borderRadius:'8px', padding:'4px'}}>
                                                                        {participante.Correo}
                                                                    </div> 
                                                                    
                                                                </Col>
                                                                <Col xs={2} style={{textAlign:'center'}}> 
                                                                    <Button onClick={()=> this.agregarParticipanteCab(participante)}
                                                                            style={{padding:'5px', 
                                                                                 background: participante.Estado ==='Agregar'? '#184A7D':'#74AE2A', 
                                                                                 color: '#FFFFFF', 
                                                                                 fontWeight:'500', 
                                                                                 fontSize:'11.7px',
                                                                                 borderRadius:'8px'}}>
                                                                                    {participante.Estado}
                                                                    </Button> 
                                                                </Col>
                                                                <Col xs={1}>
                                                                    { participante.ListDetalle !== null &&
                                                                        <Accordion.Toggle as={Button} 
                                                                            variant="link" eventKey={index +1} 
                                                                            style={{textAlign:'end'}}
                                                                            onClick={()=>this.cambiarIcono(participante,index)}>
                                                                            <FaAngleDown style={{fontSize:'20px'}}/>
                                                                        </Accordion.Toggle>        
                                                                    }
                                                                    
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        
                                                    </div>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index+1} style={{overflowY:'auto',maxHeight:'400px'}}>
                                                        <>
                                                        { parti.map((detalleUsu, index) =>
                                                            <Card.Body style={{padding:'0px', background:'#F4F6FB'}}>
                                                                        

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
                        </Modal.Body>
                        <Modal.Footer style={{background:'#F4F6FB'}}>
                            <Button onClick={this.handleClose} style={{background:'#9CA5CA',border:'1px solid #9CA5CA', width:'200px'}}> Cerrar</Button>
                            <Button onClick={()=> this.guardarAgregados()}
                                    style={{background:'#0076BC', width:'200px'}}> Guardar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.isOpenEditarGrupo} 
                        onHide={this.handleCloseEditar} 
                        centered
                        size="lg">
                        <Modal.Header closeButton 
                            style={{background:'#F4F6FB'}}>
                            <FaChevronLeft style={{alignSelf:'center', color:'#0076BC', fontSize:'17px', marginRight:'10px'}}/>
                            <Modal.Title style={{fontSize:'16px', color:'#0076BC'}}>
                                Editar Grupo
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{background:'#F4F6FB'}}>
                            <div style={{margin:'10px 4% 10px 4%'}}>
                                <div>
                                    <label style={{color:'#576774', fontWeight:'600'}}>EDITAR EL NOMBRE DEL GRUPO</label>
                                    <input style={{height:'40px',  
                                                   width:'400px', 
                                                   marginRight:'10px'}}  
                                           className="form-control" 
                                           value={this.state.nombreGrupo ? this.state.nombreGrupo:''} 
                                           onChange={e => this.getNombreGrupo(e)}/>
                                            
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <label style={{color:'#576774', fontWeight:'600'}}>SELECCIONE PARTICIPANTES</label>
                                    <div style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold', textAlign:'end'}}>
                                        <FaSort/>
                                                    ORDENAR
                                    </div>
                                    <div style={{borderRadius:'8px', background:'white'}}>
                                        <Row style={{color:'#576774', 
                                                        fontSize:'12px',
                                                        fontWeight:'bold', 
                                                        height:'50px', 
                                                        width:'100%',
                                                        margin: '0px',
                                                        textAlign:'center',
                                                        alignItems:'center'}}>
                                            <Col xs={2}>GRUPO</Col>
                                            <Col xs={2}>RAZÓN SOCIAL</Col>
                                            <Col xs={2}>RUC</Col>
                                            <Col xs={3}>EMAIL</Col>
                                            <Col xs={2}>ESTADO</Col>
                                            <Col xs={1}></Col>
                                        </Row>
                            
                                        <Accordion  style={{maxHeight:'300px', overflow:'auto'}}>
                                        { listaEditar.map((participante1,index) =>
                                                <Card>
                                                    <Card.Header style={{background: '#FFFFFF'}}>
                                                    
                                                    <div style={{display:'flex'}}>
                                                        <div style={{width:'100%'}}>
                                                            <Row style={{alignItems:'center', fontSize:'13px'}}>
                                                                <Col xs={2} style={{padding:'0px 3px'}}> {participante1.Grupo}</Col>
                                                                <Col xs={2} style={{padding:'0px 3px'}}> {participante1.RAZON_SOCIAL}</Col>
                                                                <Col xs={2} style={{padding:'0px 3px'}}> {participante1.RUC}</Col>
                                                                <Col xs={3} style={{padding:'0px 3px'}}>
                                                                    <div style={{display:'flex', justifyContent:'space-between'}}>
                                                                        {participante1.ListDetalle !== null &&
                                                                            <div style={{background:'#D7DEEC', borderRadius:'8px', padding:'4px', width:'80%'}}>
                                                                                {participante1.Correo}
                                                                            </div> 
                                                                        }
                                                                        {participante1.ListDetalle === null &&
                                                                            <div style={{background:'#D7DEEC', borderRadius:'8px', padding:'4px', width:'100%'}}>
                                                                                {participante1.Correo}
                                                                            </div> 
                                                                        }
                                                                        {participante1.ListDetalle !== null &&
                                                                            <div style={{width:'20%', alignSelf:'center'}}>
                                                                                <div style={{alignSelf:'center', background:'#295F96', color:'#FFFFFF', padding:'5px',borderRadius:'5px', textAlign:'center',alignSelf:'center',margin:'4px'}}>
                                                                                    {participante1.ListDetalle.length}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    
                                                                    
                                                                </Col>
                                                                <Col xs={2} style={{textAlign:'center', padding:'0px 3px'}}> 
                                                                    <Button onClick={()=> this.editarParticipanteCab(participante1)}
                                                                            style={{padding:'5px', 
                                                                                 background: participante1.Estado ==='Agregar'? '#184A7D':'#74AE2A', 
                                                                                 color: '#FFFFFF', 
                                                                                 fontWeight:'500', 
                                                                                 fontSize:'11.7px',
                                                                                 borderRadius:'8px'}}>
                                                                                    {participante1.Estado === 'Agregado' && participante1.ListDetalle !==null?'Agregados': participante1.Estado === 'Agregado' && participante1.ListDetalle ===null?'Agregado':participante1.Estado === 'Agregar' && participante1.ListDetalle === null ? 'Agregar':'Agregar todos'}
                                                                    </Button> 
                                                                </Col>
                                                                <Col xs={1} style={{padding:'0px 3px'}}>
                                                                    { participante1.ListDetalle !== null &&
                                                                        <Accordion.Toggle as={Button} 
                                                                            variant="link" eventKey={index +1} 
                                                                            style={{textAlign:'end'}}
                                                                            onClick={()=>this.abrirDetalle(participante1,index)}>
                                                                            <FaAngleDown style={{fontSize:'20px'}}/>
                                                                        </Accordion.Toggle>        
                                                                    }
                                                                    
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        
                                                    </div>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index+1} style={{overflowY:'auto',maxHeight:'400px'}}>
                                                        <>
                                                        { parti1.map((detalleUsu, index1) =>
                                                            <Card.Body style={{padding:'0px', background:'#F4F6FB', paddingTop:'10px',paddingBottom:'10px',borderBottom:'1px solid #d9d9d9'}}>
                                                                <Row style={{alignItems:'center', fontSize:'11.7px', color:'#576774', margin:'0px'}}>
                                                                    <Col xs={2} style={{padding:'0px 3px',textAlign:'center'}}> - </Col>
                                                                    <Col xs={2} style={{padding:'0px 3px',textAlign:'center'}}> - </Col>
                                                                    <Col xs={2} style={{padding:'0px 3px',textAlign:'center'}}> - </Col>
                                                                    <Col xs={3} style={{padding:'0px 3px',textAlign:'center'}}>
                                                                        <div style={{background:'#D7DEEC', borderRadius:'8px', padding:'4px', width:'100%'}}>
                                                                                {detalleUsu.Correo}
                                                                        </div> 
                                                                    </Col>
                                                                    <Col xs={2} style={{textAlign:'center', padding:'0px 3px'}}> 
                                                                    <Button onClick={()=> this.editarParticipanteDet(detalleUsu,index)}
                                                                            style={{padding:'5px', 
                                                                                 background: detalleUsu.Estado ==='Agregar'? '#184A7D':'#74AE2A', 
                                                                                 color: '#FFFFFF', 
                                                                                 fontWeight:'500', 
                                                                                 fontSize:'11.7px',
                                                                                 borderRadius:'8px'}}>
                                                                        {detalleUsu.Estado}    
                                                                    </Button> 
                                                                </Col>
                                                                </Row>
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
                        </Modal.Body>
                        <Modal.Footer style={{background:'#F4F6FB'}}>
                            <Button onClick={this.handleCloseEditar} style={{background:'#9CA5CA',border:'1px solid #9CA5CA', width:'200px'}}> Cerrar</Button>
                            <Button onClick={()=> this.guardarAgregadosEditar()}
                                    style={{background:'#0076BC', width:'200px'}}> Guardar</Button>
                        </Modal.Footer>
                    </Modal>
                    <Container style={{padding:'0', margin:'0', maxWidth:'100%'}}>
                                    <div style={{padding:'2%',background:'#ffffff',paddingLeft:'5%', display:'flex', justifyContent:'space-between'}}>
                                        <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>Grupos</label>
                                        
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
                                    <div style={{margin:'20px 5% 20px 5%', textAlign:'start'}}>
                                        <Button  onClick={()=>this.irNuevoGrupo()} 
                                                 variant="primary" style={{background:'#0076BC'}}>CREAR NUEVO GRUPO</Button>
                                    </div>
                                    <div style={{margin:'20px 5% 20px 5%', borderRadius:'5px'}}>
                                        <Row style={{color:'#576774', 
                                                    fontSize:'14px',
                                                    fontWeight:'bold', 
                                                    height:'50px', 
                                                    background:'#FFFFFF',
                                                    width:'100%',
                                                    margin: '0px',
                                                    textAlign:'center',
                                                    alignItems:'center'}}>
                                            <Col>NÚMERO</Col>
                                            <Col>GRUPO</Col>
                                            <Col>PARTICIPANTES</Col>
                                            <Col xs={1}></Col>
                                        </Row>
                                        <div style={{maxHeight:'500px',overflow:'auto'}}>
                                        { grupos.map((item, index) => 
                                            
                                            <Row style={{alignItems:'center',
                                                     width:'100%',
                                                     margin:'0px',
                                                     padding: '10px 0px 10px 0px',
                                                     //background: index % 2 === 1? '#F4F6FB':'#FFFFFF',
                                                     background: item.seleccionado === false? '#fff':'rgb(200 237 255)',
                                                     opacity: item.seleccionado === false? '0.7':'1',
                                                     color:'#576774',
                                                     textAlign:'center',
                                                     height:'50px',
                                                     fontSize:'11.7px'
                                                }}>
                                                <Col> {item.Idgrupo}</Col>
                                                <Col> {item.DescripcionGrupo}</Col>
                                                <Col> {item.Participantes} usuarios</Col>
                                                <Col xs={1}>
                                                    <Form.Check
                                                        type="radio"
                                                        name={index + 1}
                                                        id={index + 1}
                                                        value={index}
                                                        key={index + 1}
                                                        checked={item.selected}
                                                        onChange={(e)=> this.onCheck(e.target.value, index)}
                                                    />
                                                </Col>
                                            </Row> 
                                        )}     
                                        </div>
                                          
                                    </div>
                                    <div style={{margin:'20px 5% 20px 5%', textAlign:'end'}}>
                                        <Button  onClick={()=>this.eliminarGrupo()} 
                                                 variant="primary" style={{background:'#FF0000',marginRight:'10px', border:'1px solid #FF0000'}}>ELIMINAR
                                        </Button>
                                        <Button  onClick={()=>this.irEditarGrupo()} 
                                                 variant="primary" style={{background:'#0076BC'}}>EDITAR
                                        </Button>
                                        
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
export default GruposConfi