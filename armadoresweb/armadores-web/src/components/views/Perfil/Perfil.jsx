import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import { FaShip, FaChevronRight, FaChevronLeft, FaClipboardList, FaQuestion } from "react-icons/fa";
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Perfil.css';
import { postConsultaArchivo, postDetalleDescargaXEmb, postDetalleLiquidacionUsu, postObtenerDatosDescarga, postObtenerDescargasXEmb, postObtenerInfoEmpresa, postObtenerListaDescarga, postObtenerListaLiquidaciones, postObtenerRazonSocial, postObtenerTemporadas } from '../../../services/apiservices';
import Loader from '../../common/Loader';
import Swal from 'sweetalert2';
import Menu from '../../layouts/menu';
import { Dropdown } from 'react-bootstrap';
import { GetArmador, GetTemporada, GetUsuario, SetArmador,SetTipoSeleccion,GetTipoSeleccion, SetAyuda } from '../../../services/storage';




class Perfil extends Component {
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
        rsocial:[],
        selectArmador: GetArmador(),
        selectArmadorDesc: "",
        usuario: GetUsuario(),
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


        listaTemporada:[],
        listaTemporadaAr:[],
        perfil:{},
        mostrarCuadroEmp:false


    }
    validar = false;
    loading = false;



    handleResize = ()=> {
        this.setState({ windowHeight: window.innerHeight });
    }

    ObtenerRazonSocial(us,perfil){
        return new Promise((resolve)=>{
            postObtenerRazonSocial(us).then((res)=>{

                if(res.ListaEmpresas.length>0){
                    this.setState({rsocial:res.ListaEmpresas});
                    //this.setState({CodArmador:res.ListaEmpresas.find(p=>p.COD_ARMADOR=this.state.selectArmador).COD_ARMADOR}) ;
                    //this.setState({selectArmadorDesc:res.ListaEmpresas.find(p=>p.COD_ARMADOR=perfil.Cod_Armador).RAZON_SOCIAL}) ;
                }
                resolve(true);
                 
             });
        }); 
        
        
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
        
        postObtenerInfoEmpresa(this.state.usuario).then(v => {
            console.log(v);
            let perfili;
            if (v.ListaEmpresas.length>0) {
                let lista= [];
                v.ListaEmpresas.forEach((ttt) => {
                  lista.push({ label: ttt.Razon_social, value: ttt.Cod_Armador })
                });
                //debugger;
                if (GetTipoSeleccion()=="T") {
                    perfili=v.ListaEmpresas[0];
                }else{
                    perfili=v.ListaEmpresas.find(p=>p.Cod_Armador==GetArmador());
                }
                
                SetArmador(perfili.Cod_Armador);
                SetTipoSeleccion("X")
                if (perfili.Banco!=undefined) {
                    perfili.Banco = perfili.Banco.split('-')[0];
                }
                
                console.log(perfili)
                this.setState({ listaTemporada: v.ListaEmpresas, listaTemporadaAr: lista,perfil:perfili,selectArmadorDesc:perfili.Razon_social,selectArmador:perfili.Cod_Armador})  
              }
            
              this.ObtenerRazonSocial(this.state.usuario,perfili)
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


    openayuda=()=>{
        SetAyuda("Perfil");
        let path = `/Ayuda`;
        this.props.history.push(path);
    }

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

        postConsultaArchivo(this.state.selectArmador, item.Nro_liquidacion).then(res => {
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

    CambiarEmpresa=(codarm,razons)=>{
        console.log(codarm,"-",razons);
        this.setState({selectArmador:codarm});
        this.setState({selectArmadorDesc:razons});
        SetArmador(codarm);
        SetTipoSeleccion("X")
        postObtenerInfoEmpresa(this.state.usuario).then(v => {
            console.log(v);
            let perfili;
            if (v.ListaEmpresas.length>0) {
                let lista= [];
                v.ListaEmpresas.forEach((ttt) => {
                  lista.push({ label: ttt.Razon_social, value: ttt.Cod_Armador })
                });
                //CambiarEmpresa

                let perfil = v.ListaEmpresas.find((e)=>e.Cod_Armador==codarm)
                if (perfil && perfil.Banco!=undefined) {
                    perfil.Banco = perfil.Banco.split('-')[0];
                }else{
                    perfil ={};
                }
                this.setState({ listaTemporada: v.ListaEmpresas, 
                    listaTemporadaAr: lista,
                    perfil:perfil
                })
              }

              this.mostrarListaEmpresa();
            

        });
    }

    mostrarListaEmpresa=()=>{
        var bandera = !this.state.mostrarCuadroEmp
        this.setState({mostrarCuadroEmp:bandera});
    }

    selectionTemp = (value) => {
        this.loading = true;
        this.setState({ selectTemporada: value.target.value });
        this.setState({ Temporada: this.state.lstTemporadas.find(e => e.CodTemporada == value.target.value) })

        let countregistrada = 0;
        let countenproceso = 0;
        let acumregistrada = 0;
        let acumproceso = 0;
        postObtenerListaLiquidaciones(this.state.selectArmador, value.target.value,'X').then(v => {
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

        const { windowHeight, perfil } = this.state;


        return (
            <>
            <Container style={{
                maxWidth: "100%", background: '#E0E5F0', 
                bottom: "0",
                top: "0",
            }}>
                <Loader loading={this.loading} />

                <Row style={{ height: "100%" }}>
                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%", background: "linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)" }}>
                        <div style={{ height: 70, color: '#ffffff', fontSize: 32, fontWeight: 500, paddingTop: 10 }}>Perfil</div>
                        
                        <div style={{ height: 70, color: '#ffffff', fontSize: 32, paddingTop: 10 }}>Hola, </div>
                        
                        <div style={{display:'flex'}}>
                            <div style={{ height: 40, color: '#ffffff', fontSize: 16, marginRight:'7px', paddingTop:'3px'}}>{this.state.selectArmadorDesc}</div>
                            
                            <Button variant="primary"
                                            onClick={this.mostrarListaEmpresa}
                                            style={{background:'#1A8DCC',display:(this.state.rsocial.length>1?"block":"none"), borderRadius:'15px',fontSize:'14px', height:'30px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #1A8DCC'}}>
                                         Cambiar                   
                            </Button>

                            {/* <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{background:'#184A7D', borderRadius:'15px',fontSize:'14px', height:'24px',width:'87px', padding:'0px 5px 0px 5px', border:'1px solid #184A7D'}}>
                                    Cambiar
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{maxHeight:'300px',overflow:'auto',maxWidth:'400px'}} defaultValue={this.state.selectArmador}>
                                { this.state.rsocial.map(emp => 
                                    <Dropdown.Item onClick={()=>this.CambiarEmpresa(emp.COD_ARMADOR,emp.RAZON_SOCIAL)} key={emp.COD_ARMADOR} >{emp.RAZON_SOCIAL}</Dropdown.Item>
                                )}
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>

                        <div>
                                {/* <Form.Label>Seleccionar una empresa</Form.Label> */}
                                { this.state.mostrarCuadroEmp && 
                                    <Form.Control as="select" htmlSize={this.state.rsocial.length>10?10:this.state.rsocial.length} custom style={{overflow:'auto', margin:'10px 0 10px 0',boxShadow:'3px 4px 10px rgb(161 169 207)'}}>
                                        { this.state.rsocial.map(emp =>
                                        <option style={{padding:'8px 0px 8px 0px', fontSize:'12px', color:'#606060'}} 
                                                onClick={()=>this.CambiarEmpresa(emp.COD_ARMADOR,emp.RAZON_SOCIAL)} 
                                                key={emp.COD_ARMADOR}>
                                                {emp.RAZON_SOCIAL}
                                        </option>
                                        )}
                                    </Form.Control>
                                }
                                
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

                        {/* <div className="css_div_pri2">
                            <div style={{ color: '#ffffff', fontSize: '14px', paddingTop:'90%'}}>
                                ¿Necesitas comunicarte con nosotros? 
                                <br />    
                                Estamos a tu disposición
                            </div>

                            <div style={{
                                background: '#0076BC',
                                borderColor: '#0076BC',
                                fontWeight: 500,
                                fontSize: 14,
                                marginTop:10,
                                borderRadius: 50,
                            }} className="btn btn-primary"
                                onClick={this.openayuda}
                            >   Ayuda 
                                <FaQuestion style={{background:"white",color:"#0076BC",padding:2,borderRadius:10}} />
                            
                            </div>
                        </div> */}
                        

                    </Col>
                    <Col xs={12} md={8} style={{ padding: "60px 100px" }}>
                        <Container style={{ padding: 0,borderRadius:8,background:"white" }}>
                            <Row>
                            <Col xs={6} md={6} style={{
                                padding: "7%",
                                marginTop: -70,
                                height: windowHeight-100,
                                overflow: "auto",
                                paddingTop: 100
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>NOMBRE USUARIO</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{this.state.usuario}</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>RAZÓN SOCIAL</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Razon_social}</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>RUC</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.RUC}</div>
                                </Row>

                                <div style={{
                                    height: 1, backgroundColor: '#C4C4C4', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>

                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>EMAIL</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Correo}</div>
                                </Row>

                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>TELEFONO</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Telefono}</div>
                                </Row>

                                <div style={{
                                    height: 1, backgroundColor: '#C4C4C4', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>

                            </Col>
                            <Col xs={6} md={6} style={{
                                padding: "7%",
                                marginTop: -70,
                                height: windowHeight-100,
                                overflow: "auto",
                                paddingTop: 100
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>BANCO</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Banco}</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>MONEDA</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Moneda}</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b>CUENTA BANCARIA</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>{perfil.Cuenta_Banco}</div>
                                </Row>

                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>CCI: {perfil.Cuenta_Banco_cci??"-"}</div>
                                </Row>

                                <div style={{
                                    height: 1, backgroundColor: '#C4C4C4', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>


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
export default Perfil