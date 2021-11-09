import React from 'react'
import { Container } from 'react-bootstrap';
import  Row  from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import  Col  from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import  Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Dropdown from 'react-bootstrap/Dropdown';
import  './Inicio.css';
import {GetUsuario, GetNickname, SetAyuda, GetArmador} from '../../../services/storage';
import {SetArmador} from '../../../services/storage';
import {SetTemporada} from '../../../services/storage';
import {SetTipoSeleccion, GetTipoSeleccion} from '../../../services/storage';
import Menu from '../../layouts/menu';
import {IoBoat, IoCloudyNightOutline} from "react-icons/io5";
import {IoDocumentText} from "react-icons/io5";
import {IoBagCheck} from "react-icons/io5";
import {postObtenerTemporadas} from '../../../services/apiservices';
import {postObtenerRazonSocial} from '../../../services/apiservices';
import {postInformacionUsuario} from '../../../services/apiservices';
import {FaRedoAlt} from "react-icons/fa";

class Inicio extends React.Component{
    constructor(props){
        super(props);
        //this.routeChange = this.routeChange.bind(this);
        
        this.state = {
            //fields: {},
            //errors: {},
            tempActual:'',
            temporadas:[],
            CodTemporada:'',

            rsocialactual:'',
            rsocial:[],
            CodArmador:'',

            descarga:'',
            cuota:'',
            avance:'',
            cobradas:'',
            porcobrar:'',
            factResgitradas:'',
            enProceso:'',
            facturadas:'',
            sinfacturar:'',
            desFac:'',
            desNofac:'',
            fechaActual:'',
            nickname:'',
            mostrarCuadroEmp:false,
            tipoSeleccion: 'T',
            listaArmadores:''
        };
        //this.validar=false;
    }
    async componentDidMount() {
        GetArmador()
        await this.ObtenerTemporada();
        await this.ObtenerRazonSocial(GetUsuario());
        console.log('Prueba',this.state.CodArmador);
        this.ObtenerInformacionUsuario(GetUsuario(),this.state.listaArmadores,this.state.CodTemporada, this.state.tipoSeleccion);

        var fechaA = new Date();
        
        var fecha = fechaA.toISOString().substr(0,10);
        var hora = fechaA.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second:'numeric',hour12: true });
        
        var fechaActualiza = fecha.split("-")[2]+"/"+fecha.split("-")[1]+"/"+fecha.split("-")[0] + ' ' + hora;
        this.setState({fechaActual:fechaActualiza});
        this.setState({nickname: GetNickname()})

    }

    actualizarDatos=()=>{
        var date = new Date();
        var fecha = date.toISOString().substr(0,10);
        var hora = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second:'numeric',hour12: true });
        
        var fechaActualiza = fecha.split("-")[2]+"/"+fecha.split("-")[1]+"/"+fecha.split("-")[0] + ' ' + hora;
        this.setState({fechaActual:fechaActualiza});

        this.ObtenerInformacionUsuario(GetUsuario(),this.state.listaArmadores,this.state.CodTemporada, this.state.tipoSeleccion);
    }
    ObtenerTemporada(){
        return new Promise((resolve)=>{
            postObtenerTemporadas().then((res)=>{

                if(res){
                    this.setState({temporadas:res});
                    this.setState({CodTemporada:res[0].CodTemporada});
                    this.setState({tempActual:res[0].DesTemporada});

                    SetTemporada(res[0].CodTemporada);
                    resolve(true)
                }
                
             });
        });
        
        
     }

     concatCodigoArmador(){
        var armadores = '';
        for (let index = 1; index < this.state.rsocial.length; index++) {
            const element = this.state.rsocial[index];
            armadores = armadores + element.COD_ARMADOR;
            if(index !== this.state.rsocial.length -1 ){
                armadores = armadores + '|';
            }
        }
        return armadores;
     }

     ObtenerRazonSocial(us){
        return new Promise((resolve)=>{
            postObtenerRazonSocial(us).then((res)=>{

                if(res.ListaEmpresas.length === 1){
                    this.setState({rsocial:res.ListaEmpresas});

                    var codigo = res.ListaEmpresas[0].COD_ARMADOR
                    console.log('codigo armador', codigo)
                    var descri = res.ListaEmpresas.find(data => data.COD_ARMADOR === codigo);
                    console.log('prueba ed',descri)
                    this.setState({CodArmador: codigo});
                    this.setState({listaArmadores:codigo});
                    this.setState({rsocialactual:descri.RAZON_SOCIAL});
                    this.setState({tipoSeleccion:'X'});
                    SetArmador(this.state.CodArmador);
                    SetTipoSeleccion(this.state.tipoSeleccion);
                }
                if(res.ListaEmpresas.length>1){
                    var nueLista = res.ListaEmpresas;
                    const campoTodos = {
                        COD_ARMADOR: "T",
                        MAIL: "todos@msn.com",
                        RAZON_SOCIAL: "TODOS",
                        RUC: "0"
                    };

                    nueLista.unshift(campoTodos);
                    this.setState({rsocial:nueLista});
                    
                    var tipoSel = GetTipoSeleccion() !== '' && GetTipoSeleccion() !== null ? GetTipoSeleccion():'T';

                    if (tipoSel !== 'T'){
                        var codigo = GetArmador()!=='' && GetArmador() !== null? GetArmador():res.ListaEmpresas[1].COD_ARMADOR
                        var descri = res.ListaEmpresas.find(data => data.COD_ARMADOR === codigo);
                        this.setState({CodArmador: codigo});
                        this.setState({rsocialactual:descri.RAZON_SOCIAL});
                        this.setState({tipoSeleccion:'X'});
                        this.setState({listaArmadores:codigo})
                    }else{
                        this.setState({CodArmador: res.ListaEmpresas[0].COD_ARMADOR});
                        this.setState({rsocialactual:res.ListaEmpresas[0].RAZON_SOCIAL});
                        this.setState({tipoSeleccion: 'T'})
                        this.setState({listaArmadores:this.concatCodigoArmador()})
                    }
    
                    SetArmador(this.state.listaArmadores);
                    SetTipoSeleccion(this.state.tipoSeleccion);
                }
                resolve(true);
                 
             });
        }); 
        
        
     }

     ObtenerInformacionUsuario(us,ca,ct, tipoSel){
        postInformacionUsuario(us,ca,ct,tipoSel).then((res)=>{
             this.setState({descarga: new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.Descarga).toFixed(0)) }) ;
             this.setState({cuota:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.Cuota).toFixed(0))}) ;

             if(res){
                let cuotaC =  res.Cuota === 0?1:res.Cuota;
                let porcentaje= (res.Descarga/cuotaC)*100;
                let intporcentaje=Math.round(porcentaje);
                this.setState({avance:Number.parseFloat(intporcentaje).toFixed(0)}) ;
             }
             
             this.setState({cobradas:  new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.Cobradas).toFixed(0))}) ;
             this.setState({porcobrar:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.PorCobrar).toFixed(0))}) ;
             this.setState({factResgitradas:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.FacRegist).toFixed(0))}) ;
             this.setState({enProceso:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.EnProceso).toFixed(0))}) ;
             this.setState({facturadas:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.PrecioFacturadas).toFixed(0))}) ;
             this.setState({sinfacturar:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.PrecioTot-res.PrecioFacturadas).toFixed(0))});
             this.setState({desFac:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.DesFct).toFixed(0))});
             this.setState({desNofac:new Intl.NumberFormat('ES-MX').format(Number.parseFloat(res.DesNoFct).toFixed(0))})
         });
        
     }
/*
   // async onInit(){
        // Cargar Temporadas 
        // Cargar RAzon social
        // Cargar Descargar 
        // Cargar Liquidaciones
    //}
    routeChange() {
        
        let path = `/Registrar2`;
        this.props.history.push(path);
    }

      ativarbton(event) {
      }
      handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});

        if (e.target.value.length>0) {
            console.log("DISPONIBLE")
            this.validar=true;
        }else{
            console.log("NO DISPONIBLE")
            this.validar=false;
        }
    }

    refreshPage() {
        window.location.reload(false);
      }

    handleSubmit(event) {
        alert('Your favorite flavor is: ');
        event.preventDefault();
    }*/

    CambiarTemporada=(codtemp,destemp)=>{
        console.log(codtemp,"-",destemp);
        this.setState({CodTemporada:codtemp});
        this.setState({tempActual:destemp});
        this.ObtenerInformacionUsuario(GetUsuario(),this.state.listaArmadores,codtemp, this.state.tipoSeleccion);

        // Guardar codigo Temporada
        SetTemporada(codtemp);
    }

    openayuda=()=>{
        SetAyuda("Inicio");
        let path = `/Ayuda`;
        this.props.history.push(path);
    }

    openDescargas=()=>{
        SetAyuda("Inicio");
        let path = `/Descargas`;
        this.props.history.push(path);
    }
    openPorCobrar=()=>{
        SetAyuda("Inicio");
        let path = `/CuentasCobrar`;
        this.props.history.push(path);
    }

    openLiquidacion=()=>{
        SetAyuda("Inicio");
        let path = `/Liquidacion`;
        this.props.history.push(path);
    }

    CambiarEmpresa=(codarm,razons)=>{
        console.log(codarm,"-",razons);
        this.setState({CodArmador:codarm});
        this.setState({rsocialactual:razons});

        var tipoSel=''
        var listaArm = ''
        if(codarm === 'T'){
            tipoSel = 'T'
            listaArm = this.concatCodigoArmador();
            this.setState({tipoSeleccion: tipoSel});
            this.setState({listaArmadores: listaArm})
        }else{
            tipoSel = 'X';
            listaArm = codarm;
            this.setState({tipoSeleccion:tipoSel});
            this.setState({listaArmadores:codarm})
        }
        this.ObtenerInformacionUsuario(GetUsuario(),listaArm,this.state.CodTemporada,tipoSel);

        // Guardar codigo Armador
        SetArmador(listaArm);
        SetTipoSeleccion(tipoSel);
        this.mostrarListaEmpresa();
    }

    mostrarListaEmpresa=()=>{
        var bandera = !this.state.mostrarCuadroEmp
        this.setState({mostrarCuadroEmp:bandera});
    }
    render(){
        const temps=this.state.temporadas;
        const empresas=this.state.rsocial;
        
        return(
            <>
                {/* <Menu/> */}
                <Container  style={{maxWidth: "100%", background: 'linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)',
                bottom: "0",
                top: "0",
                minHeight:'100vh'}}>
                    <Row>
                        <Col xs={0} md={4}>
                            <div className="css_div_pri">
                                <div>

                                    <label style={{fontSize:'32px'}}>Hola, </label>
                                    {/* <label style={{fontSize:'32px', fontWeight:'bold', lineHeight:'30px',marginLeft:'5px'}}> {this.state.nickname}</label> */}

                                </div>
                                <div style={{display:'flex', marginBottom:'10px' }}>
                                    <h6 style={{fontSize:'16px', marginBottom:'0px', marginRight:'5px', alignSelf:'center'}}>{this.state.rsocialactual}</h6>
                                    <Button variant="primary"
                                            onClick={this.mostrarListaEmpresa}
                                            style={{background:'#1A8DCC',display:(empresas.length>1?"block":"none"), borderRadius:'15px',fontSize:'14px', height:'30px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #1A8DCC'}}>
                                         Cambiar                   
                                    </Button>
                                    {/* <Dropdown >
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                            Cambiar
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{maxHeight:'300px',overflow:'auto',maxWidth:'400px'}}>
                                        { empresas.map(emp => 
                                        <Dropdown.Item  onClick={()=>this.CambiarEmpresa(emp.COD_ARMADOR,emp.RAZON_SOCIAL)} key={emp.COD_ARMADOR}>{emp.RAZON_SOCIAL}</Dropdown.Item>
                                        )}
                                           
                                        </Dropdown.Menu>
                                    </Dropdown> */}
                                </div>
                                <div>
                                {/* <Form.Label>Seleccionar una empresa</Form.Label> */}
                                { this.state.mostrarCuadroEmp && 
                                    <Form.Control as="select" htmlSize={empresas.length>10?10:empresas.length} custom style={{overflow:'auto', margin:'10px 0 10px 0',boxShadow:'3px 4px 10px rgb(161 169 207)'}}>
                                        { empresas.map(emp =>
                                        <option style={{padding:'8px 0px 8px 0px', fontSize:'12px', color:'#606060'}} 
                                                onClick={()=>this.CambiarEmpresa(emp.COD_ARMADOR,emp.RAZON_SOCIAL)} 
                                                key={emp.COD_ARMADOR}>
                                                {emp.RAZON_SOCIAL}
                                        </option>
                                        )}
                                    </Form.Control>
                                }
                                
                                </div>
                            </div>

                            <div className="css_div_pri2">
                                <div>
                                    <h6 style={{fontSize:'14px', fontStyle:'normal', lineHeight:'20px'}}>¿Necesitas comunicarte con nosotros?</h6>
                                </div>
                                <div>
                                    <h6 style={{fontSize:'14px'}}>Estamos a tu disposición</h6>
                                </div>
                                <Button style={{background:'#0076BC', borderRadius:'20px',fontSize:'14px'}} onClick={this.openayuda}>Ayuda
                                
                                </Button>
                            </div>
                            
                        </Col>
                        <Col xs={12} md={8} style={{background:'#E0E5F0',minHeight:'100vh',top:'0',bottom:'0',right:'0',padding:'0'}}>
                            <Container style={{padding:'0', margin:'0', maxWidth:'100%'}}>
                                <div style={{padding:'2%',background:'#ffffff',paddingLeft:'5%', display:'flex'}}>
                                    <label style={{color:'#184A7D', fontSize:'16px', fontWeight:'bold',marginRight:'10px', marginBottom:'2px'}}>{this.state.tempActual}</label>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                            Cambiar
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{maxHeight:'300px',overflow:'auto'}}>
                                        <Dropdown.ItemText style={{color:'#9CA5CA', fontSize:'14px'}}>Elegir temporada</Dropdown.ItemText>
                                       { temps.map(item => 
		
			                            <Dropdown.Item  style={{padding:'7px 10px 7px 10px', fontSize:'14px'}}
                                                        onClick={()=>this.CambiarTemporada(item.CodTemporada,item.DesTemporada)} key={item.CodTemporada}>{item.DesTemporada}</Dropdown.Item>
		
	                                    )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    
                                    {/* <Button style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px'}}>Cambiar</Button> */}
                                </div>
                                <div style={{textAlign:'end', marginTop:'2%',paddingRight:'5%'}}>
                                    <label style={{fontSize:'10px', color:'#576774', paddingRight:'10px'}}>{this.state.fechaActual}</label>
                                    <Button onClick={this.actualizarDatos}
                                            style={{background:'#9CA5CA', 
                                                    border:'1px solid #9CA5CA',
                                                    borderRadius:'15px',
                                                    fontSize:'12px', 
                                                    height:'24px',
                                                    width:'87px', 
                                                    padding:'0px 5px 0px 5px'}}>
                                                    <FaRedoAlt style={{marginRight:'5px'}}/>
                                                    Actualizar
                                    </Button>
                                </div>

                                <Row style={{margin:'0'}}>
                                    <Col className="css_col_des1" xs={12} md={6} >
                                        <div style={{color:'#576774', fontSize:'16px', fontWeight:'bold', paddingBottom:'10px'}}>Descargas</div>
                                        <Card onClick={this.openDescargas}
                                              style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7', height:'160px'}}>
                                            <Card.Body>
                                                <div style={{width:'30px', height:'30px', background:'#D8F2FF', borderRadius:'8px', textAlign:'center'}}>
                                                    <IoBoat style={{background:'#D8F2FF',borderRadius:'8px', color:'#5CBDEB',fontSize:'20px'}}/>
                                                </div>

                                                <div> 
                                                    <label style={{color:'#184A7D', fontSize:'28px',fontWeight:'bold'}}>{this.state.descarga} TN</label>
                                                </div>
                                                <ProgressBar style={{height:'10px',background: "#DADBE0"}} variant={"colorbar"} now={this.state.avance} />
                                                <div style={{display:'flex',justifyContent:'space-between', fontSize:'12px', color:'#576774'}}>
                                                    <div>
                                                        Avance:
                                                        <label style={{fontWeight:'bold', paddingLeft:'5px'}}>{this.state.avance}%</label>
                                                    </div>
                                                    <div>
                                                        Cuota:
                                                        <label style={{fontWeight:'bold', paddingLeft:'5px'}}>{this.state.cuota} TN</label>
                                                    </div>
                                                </div>
                                                
                                            </Card.Body>
                                        </Card>

                                        <Row style={{marginLeft:'0px', marginRight:'0'}}>
                                            <Col xs={6} md={6} style={{padding:'15px 10px 10px 0px'}}>
                                                <Card onClick={this.openPorCobrar} style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'190px'}}>
                                                    <Card.Body>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Facturadas</Card.Title>
                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.facturadas}</label>
                                                        </div>
                                                        <div style={{fontSize:'14px', color:'#184A7D'}}>
                                                            {this.state.desFac} TN
                                                        </div>
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Monto de las facturas que están para procesar por TASA.</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col xs={6} md={6} style={{padding:'15px 0px 10px 10px'}}>
                                                <Card onClick={this.openPorCobrar} style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'190px'}}>
                                                    <Card.Body>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Sin Facturar</Card.Title>
                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.sinfacturar}</label>
                                                        </div>
                                                        <div style={{fontSize:'14px', color:'#184A7D'}}>
                                                            {this.state.desNofac} TN
                                                        </div>
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Valorización estimada de las TN descargadas sin posibles descuentos.</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row> 
                                    </Col>
                                    <Col xs={12} md={6} className="css_col_fac">
                                        <div style={{color:'#576774', fontSize:'16px', fontWeight:'bold', paddingBottom:'10px'}}>Facturas por cobrar</div>

                                        <Row style={{marginLeft:'0px', marginRight:'0'}}>
                                            <Col xs={6} md={6} style={{padding:'0px 10px 10px 0px'}}>
                                                <Card   onClick={this.openPorCobrar}
                                                        style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'160px'}}>
                                                    <Card.Body>
                                                        <div style={{width:'30px', height:'30px', background:'#F8E9D2', borderRadius:'8px', textAlign:'center'}}>
                                                            <IoDocumentText style={{borderRadius:'8px', color:'#F39200',fontSize:'20px'}}/>
                                                        </div>
                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.factResgitradas}</label>
                                                        </div>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Registradas</Card.Title>
                                                        
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Facturas recibidas por Tasa</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col xs={6} md={6} style={{padding:'0px 0px 10px 10px'}}>
                                                <Card   onClick={this.openPorCobrar}
                                                        style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'160px'}}>
                                                    <Card.Body>
                                                        <div style={{width:'30px', height:'30px', background:'#D6F6C2', borderRadius:'8px', textAlign:'center'}}>
                                                            <IoDocumentText style={{background:'#D8F2FF',borderRadius:'8px', color:'#69BC36',fontSize:'20px'}}/>
                                                        </div>
                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.enProceso}</label>
                                                        </div>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>En progreso</Card.Title>
                                                        
                                                        
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Facturas procesadas en liquidaciones</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <div style={{color:'#576774', fontSize:'16px', fontWeight:'bold', paddingBottom:'10px'}}>Liquidaciones</div>

                                        <Row style={{marginLeft:'0px', marginRight:'0'}}>
                                            <Col xs={6} md={6} style={{padding:'0px 10px 10px 0px'}}>
                                                <Card   onClick={this.openLiquidacion}
                                                        style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'160px'}}>
                                                    <Card.Body>
                                                        <div style={{width:'30px', height:'30px', background:'#D6F6C2', borderRadius:'8px', textAlign:'center'}}>
                                                            <IoBagCheck style={{background:'#D8F2FF',borderRadius:'8px', color:'#69BC36',fontSize:'20px'}}/>
                                                        </div>
                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.cobradas}</label>
                                                        </div>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Cobradas</Card.Title>
                                                        
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Liquidaciones depositadas</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                            <Col xs={6} md={6} style={{padding:'0px 0px 10px 10px'}}>
                                                <Card   onClick={this.openLiquidacion}
                                                        style={{ width: '100%', boxShadow:'3px 4px 10px #B0B4C7',height:'160px'}}>
                                                    <Card.Body>
                                                        <div style={{width:'30px', height:'30px', background:'#F8E9D2', borderRadius:'8px', textAlign:'center'}}>
                                                            <IoBagCheck style={{borderRadius:'8px', color:'#F39200',fontSize:'20px'}}/>
                                                        </div>

                                                        <div style={{color:'#184A7D', fontWeight:'bold', fontSize:'13px'}}>
                                                            $
                                                            <label style={{fontSize:'16px',paddingLeft:'5px', display:'initial'}}>{this.state.porcobrar}</label>
                                                        </div>
                                                        <Card.Title style={{color:'#184A7D', fontSize:'12px', fontWeight:'bold'}}>Por cobrar</Card.Title>
                                                        
                                                        <div style={{marginTop:'25px'}}>
                                                            <label style={{fontSize:'10px', color:'#576774'}}>Liquidaciones en espera de aprobación del banco</label>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
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
export default Inicio