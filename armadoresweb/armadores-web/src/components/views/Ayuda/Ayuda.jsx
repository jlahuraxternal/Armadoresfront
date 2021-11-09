import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal'
import { FaShip, FaChevronRight, FaChevronLeft, FaPhoneAlt,FaEnvelope, FaCheck } from "react-icons/fa";
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Ayuda.css';
import { postConsultaArchivo, postDetalleDescargaXEmb, postDetalleLiquidacionUsu, postObtenerDatosDescarga, postObtenerDescargasXEmb, postObtenerInfoEmpresa, postObtenerListaDescarga, postObtenerListaLiquidaciones, postObtenerRazonSocial, postObtenerTemporadas, postRegistroArmadorimput } from '../../../services/apiservices';
import Loader from '../../common/Loader';
import Swal from 'sweetalert2';
import Menu from '../../layouts/menu';
import { Dropdown } from 'react-bootstrap';
import { GetArmador, GetAyuda, GetTemporada, GetUsuario } from '../../../services/storage';
import ReactStars from "react-rating-stars-component";
import {IoClose} from 'react-icons/io5';



class Ayuda extends Component {
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
        selectArmador: "",
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

        congrat:false

    }
    validar = false;
    loading = false;
    rating = 0;
    mensaje = "";



    handleResize = ()=> {
        this.setState({ windowHeight: window.innerHeight });
    }

    ObtenerRazonSocial(us,perfil){
        return new Promise((resolve)=>{
            postObtenerRazonSocial(us).then((res)=>{

                if(res.ListaEmpresas.length>0){
                    this.setState({rsocial:res.ListaEmpresas});
                    //this.setState({CodArmador:res.ListaEmpresas.find(p=>p.COD_ARMADOR=this.state.selectArmador).COD_ARMADOR}) ;
                    this.setState({selectArmadorDesc:res.ListaEmpresas.find(p=>p.COD_ARMADOR=perfil.Cod_Armador).RAZON_SOCIAL}) ;
                }
                resolve(true);
                 
             });
        }); 
        
        
     }

    componentDidMount() {
        this.loading = true;
        window.addEventListener("resize", this.handleResize);
        /*postObtenerTemporadas().then(va => {
            console.log(va);
            this.setState({ lstTemporadas: va, Temporada: va.find(e => e.CodTemporada == this.state.selectTemporada) })
        })*/
        let countregistrada = 0;
        let countenproceso = 0;
        let acumregistrada = 0;
        let acumproceso = 0;
        /*
        postObtenerInfoEmpresa(this.state.usuario).then(v => {
            console.log(v);
            let perfili;
            if (v.ListaEmpresas.length>1) {
                let lista= [];
                v.ListaEmpresas.forEach((ttt) => {
                  lista.push({ label: ttt.Razon_social, value: ttt.Cod_Armador })
                });
                perfili=v.ListaEmpresas[0];
                this.setState({ listaTemporada: v.ListaEmpresas, listaTemporadaAr: lista,perfil:perfili,selectArmadorDesc:perfili.Razon_social,selectArmador:perfili.Cod_Armador})  
              }
            
              this.ObtenerRazonSocial(this.state.usuario,perfili)
        });
        */
        
        /*postObtenerListaDescarga(this.state.selectArmador, this.state.selectTemporada ?? '').then(v => {
            console.log(v);
            this.setState({ registradas: v.length, listaFacturas: v });
        }).finally(() => this.loading = false);*/
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    routeChange = ()=> {
        this.loading = true;
        postRegistroArmadorimput(GetArmador(),this.rating.toString(),this.mensaje).then(p=>{
            //setLoading(false);
            //Alert.alert('Exitoso','Se envió la calificación Exitósamente');
            //setCongrat(true);
            this.loading = false;
            this.setState({congrat:true});
            //navigation.goBack();
          });
    }

    ratingChanged = (newRating) => {
        console.log(newRating);
        this.rating=newRating;
      };


    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        if (e.target.value.length > 0) {
            console.log("DISPONIBLE")
            this.validar = true;
            this.mensaje=e.target.value;
        } else {
            console.log("NO DISPONIBLE")
            this.validar = false;
        }
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });
    openModal2 = () => this.setState({ isOpen2: true });
    closeModal2 = () => this.setState({ isOpen2: false });

    enviocorreo1=()=>{
        window.open('mailto:facturas@tasa.com.pe');
    }
    enviocorreo2=()=>{
        window.open('mailto:pagos@tasa.com.pe');
    }
    enviocorreo3=()=>{
        window.open('mailto:consultas@tasa.com.pe');
    }
    enviotel1=()=>{
        window.open('tel:+51981123090');
    }
    enviotel2=()=>{
        window.open('tel:+51998340263');
    }
    enviotel3=()=>{
        window.open('tel:+51994255337');
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
        postObtenerInfoEmpresa(this.state.usuario).then(v => {
            console.log(v);
            if (v.ListaEmpresas.length>1) {
                let lista= [];
                v.ListaEmpresas.forEach((ttt) => {
                  lista.push({ label: ttt.Razon_social, value: ttt.Cod_Armador })
                });
                this.setState({ listaTemporada: v.ListaEmpresas, listaTemporadaAr: lista,perfil:v.ListaEmpresas.find((e)=>e.Cod_Armador==this.state.selectArmador)})  
              }
            

        });
    }

    closeAyuda = () => {
        
        let path = `/`+GetAyuda();
        this.props.history.push(path);
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
                maxWidth: "100%", background: '#708090', 
                bottom: "0",
                top: "0",
            }}>
                <Loader loading={this.loading} />

                <Row style={{ height: "100%" }}>
                     <Col xs={12} md={8} style={{ padding: "60px 100px" }}>
                        <Container style={{ padding: 0,borderRadius:8,background:"white" }}>
                            <Row>
                            <Col xs={12} md={6} style={{
                                padding: "6%",
                                marginTop: -70,
                                height: windowHeight-30,
                                paddingTop: 100
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#184A7D', fontSize: '16px' }}><b><FaChevronLeft style={{cursor:'pointer'}} onClick={()=>this.closeAyuda()} />Ayuda</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#184A7D', fontSize: '16px', fontWeight:'bold' }}>Registro de facturas</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}><b>Lunes a viernes de 8 a.m. a 6 p.m.</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>facturas@tasa.com.pe</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}>Sandra Aguilar, Cel. 981123090</div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:16 }}>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#184A7D', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginRight: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }} onClick={()=>this.enviocorreo1()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Enviar correo <FaEnvelope color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#0076BC', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginLeft: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }} onClick={()=>this.enviotel1()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Llamar <FaPhoneAlt color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                </Row>

                                <div style={{
                                    height: 1, backgroundColor: '#C4C4C4', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>

                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#184A7D', fontSize: '16px', fontWeight:'bold' }}>Pagos o liquidaciones</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}><b>Lunes a viernes de 8 a.m. a 6 p.m.</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>pagos@tasa.com.pe</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}>Mónica García, Cel. 998340263</div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:10 }}>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#184A7D', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginRight: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }}  onClick={()=>this.enviocorreo2()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Enviar correo <FaEnvelope color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#0076BC', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginLeft: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }} onClick={()=>this.enviotel2()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Llamar <FaPhoneAlt color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                </Row>

                            </Col>
                            <Col xs={12} md={6} style={{
                                padding: "6%",
                                marginTop: -70,
                                height: windowHeight-100,
                                paddingTop: 100
                            }}>
                                <Row style={{ marginLeft: 0 ,display:'block'}}>
                                    {/* <div style={{ color: '#0076BC', fontSize: '14px',textAlign: "end",  width: "100%", marginRight: 19}}><b> </b></div> */}
                                    <div style={{textAlign:'end'}} onClick={()=>this.closeAyuda()}>
                                        <IoClose style={{color:'#184A7D', fontSize:'25px'}}/>
                                    </div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:20 }}>
                                    <div style={{ color: '#184A7D', fontSize: '16px', fontWeight:'bold' }}>Otras solicitudes</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}><b>24 horas</b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:24 }}>
                                    <div style={{ color: '#576774', fontSize: '14px' }}>consultas@tasa.com.pe</div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}>Percy Rojas, Cel. 947337180</div>
                                    
                                </Row> 
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}>Richard Duran, Cel. 994255337 </div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:10 }}>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#184A7D', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginRight: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }}  onClick={()=>this.enviocorreo3()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Enviar correo <FaEnvelope color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                    <Col style={{padding: 20, paddingBottom: 0, backgroundColor: '#0076BC', alignItems:'center',
                                    borderWidth: 0,
                                    color: '#FFFFFF',
                                    borderColor: '#7DE24E',
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    marginLeft: 5,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: 100
                                }}  onClick={()=>this.enviotel3()}> 
                                        <div style={{ color: 'white', fontSize: '12px',textAlign: 'center',fontWeight:'bold' }}>Llamar <FaPhoneAlt color={'#184A7D'} style={{ fontSize: 16, marginLeft: 0, padding: 3, backgroundColor: 'white', borderRadius: 100 }} /></div>
                                                          
                                    </Col>
                                </Row>

                                <div style={{
                                    height: 1, backgroundColor: '#C4C4C4', borderRadius: 0, marginTop: 20, marginLeft: 0, marginRight: 0, marginBottom: 20
                                }}></div>

                            </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={12} md={4} style={{ paddingLeft: "3%", paddingRight: "3%", background: "linear-gradient(172.42deg, #0EA8E2 3.01%, #0072C5 96.36%)" }}>
                        
                        
                    <Col xs={12} md={12} style={{
                                padding: "6%",
                                marginTop: -70,
                                height: windowHeight-100,
                                paddingTop: 100
                            }}>
                                <Row style={{ marginLeft: 0 }}>
                                    <div style={{ color: '#576774', fontSize: '12px' }}><b></b></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:48 }}>
                                    <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight:'bold' }}>Cuéntanos tu experiencia</div>
                                </Row>
                                <div style={{
                                     display: this.state.congrat ? 'none' : 'block'
                                }}>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#FFFFFF', fontSize: '14px',fontWeight:'400' }}>¿Cómo calificarías el app?</div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:16 }}>
                                    <div style={{ color: '#FFFFFF', fontSize: '14px' }}>
                                    <ReactStars
                                        count={5}
                                        onChange={this.ratingChanged}
                                        size={24}
                                        activeColor="rgb(221 216 48)"
                                    />
                                    </div>
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:16 }}>
                                    <div style={{ color: '#FFFFFF', fontSize: '14px',fontWeight:'400'}}>¿Tienes alguna sugerencia?</div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:8 }}>
                                    <div style={{ color: '#576774', fontSize: '12px',width: "100%" }}><textarea onChange={this.handleChange.bind(this, "password")} style={{width: "100%", minHeight: 90,  borderRadius: 5}} placeholder={"Escribe tus comentarios aquí"}></textarea></div>
                                    
                                </Row>
                                <Row style={{ marginLeft: 0,marginTop:10 }}>
                                    <button type="submit" style={{
                                        background: this.validar ? '#4CBCE7' : '#1A94D5',
                                        borderColor: this.validar ? '#4CBCE7' : '#1A94D5',
                                        width: "100%",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        height: "52px"
                                    }} class="btn btn-primary"
                                        disabled={!this.validar}
                                        onClick={()=>this.routeChange()}
                                    >ENVIAR CALIFICACIÓN</button>
                                </Row>
                                </div>

                                <div style={{
                                    flex: 1  , display: this.state.congrat ? 'block' : 'none'
                                    }}>
                                    <Row style={{ flex: 1, flexDirection: 'row', padding: 20, paddingBottom: 10 }}>
                                        <Row
                                        style={{borderRadius: 16,
                                            height: 45,
                                            padding: 10,
                                            elevation: 2,backgroundColor: "#8DBF4F", flex: 2,backgroundColor: '#E0F2CA',flexDirection:'row',height:100,padding:24}} >

                                            <Col style={{flex: .1,alignItems: 'center',paddingLeft:0}}>
                                                <div>
                                                <FaCheck color={'white'} style={{ fontSize: 25, padding: 4, backgroundColor: '#69BC36', borderRadius: 100 }} />
                                                </div>
                                            </Col>
                                            <Col style={{flex: 1}}>
                                                <p allowFontScaling={false} style={{ margin: 0,fontSize:14,color:'#576774',fontWeight:'bold' }}>¡Muchas gracias!</p>
                                                <p allowFontScaling={false} style={{ margin: 0,fontSize:14,color:'#576774' }}>Tu opinión es muy importante para seguir mejorando.</p>
                                            </Col>
                                        </Row>
                                    </Row>
                                </div>


                            </Col>
                           
                        

                    </Col>
                   
                </Row>
            </Container>
            </>
        );
    }

}
export default Ayuda