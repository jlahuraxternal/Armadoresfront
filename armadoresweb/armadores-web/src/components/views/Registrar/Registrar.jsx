import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { postObtenerCodigoAutogenerado } from '../../../services/apiservices';
import { SetCodver, SetCorreo } from '../../../services/storage';
var imageName = require('../../../images/Frame.png')


class Registrar extends React.Component {
    constructor() {
        super();
        this.routeChange = this.routeChange.bind(this);

        this.state = {
            fields: {
                valido:false,
                invalido:false,

            },
            errors: {}
        }
        this.validar = false;
        this.valido = false;
        this.invalido=false;
        this.correo="";
    }

    routeChange() {
        if (this.validar) {
            //IMPLEMENTAR EL SERVICIO DE VALIDACION DE CORREO Y CODIGO DE VERIFICACION
            postObtenerCodigoAutogenerado(this.correo).then(p=>{
                if (p.id_mensaje=="0") {
                    this.setState({valido:true});
                    setTimeout(()=>{
                        let path = `/Registrar2`;
                        this.props.history.push(path);
                        SetCorreo(p.correo);
                        SetCodver(p.codigo_aut);
                    },2000)
                    
                }else{
                    this.setState({invalido:true});
                    //this.invalido=true
                }

            });

        
        }
        
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    
    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
        this.setState({valido:false,invalido:false});

        if (this.validateEmail(e.target.value)) {
            console.log("DISPONIBLE")
            this.validar = true;
            this.correo=e.target.value;
            
        } else {
            console.log("NO DISPONIBLE")
            this.validar = false;
        }
    }

    render() {
        const css_div_uno = {
            display: 'flex',
            width: '50%'
        };




        return (
            <Container style={{
                maxWidth: "100%", background: 'linear-gradient(162.5deg, #0E76B1 12.09%, #184A7D 92.14%)', position: "absolute",
                bottom: "0",
                top: "0",
            }}>
                <Row style={{height:"100%"}}>
                    <Col xs={0} md={3} style={{padding:0}}>
                        <img src={imageName.default} style={{width:"100%",bottom: 0, position: "absolute"}}></img>
                    </Col>
                    <Col xs={12} md={9} style={{ background: '#ffffff', position: 'absolute', top: '0', bottom: '0', right: '0' }}>
                        <Container>
                            <Col xs={12} md={6} style={{ paddingTop: "10%", paddingLeft: "10%" }}>
                                <Row style={{}}>
                                    <div style={{ color: '#5CBDEB', fontSize: '24px', fontWeight: 'bold' }}>Paso 1 de 4</div>
                                </Row>
                                <Row style={{ marginTop: 90 }}>
                                    <div style={{ color: '#9CA5CA', fontSize: '32px', fontWeight: 'bold' }}>REGISTRO</div>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <div style={{ color: '#576774', fontSize: '16px' }}>Para registrarte ingresa el correo electrónico proporcionado a TASA.</div>
                                </Row>
                                <Row style={{ marginTop: 32 }}>
                                    <div className="form-group" style={{ width: "100%" }}>
                                        <label htmlFor="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Usuario</label>
                                        <input type="email" className="form-control" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["correo"]} style={{ height: 56, marginTop: 6, fontSize: 20 }} id="email" aria-describedby="emailHelp" placeholder="Escribe el correo" />
                                        <small id="emailHelp" style={{ display: "none" }} className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    <button type="submit" style={{
                                        background: this.validar ? '#8DBF4F' : '#DDECCA',
                                        borderColor: this.validar ? '#8DBF4F' : '#DDECCA',
                                        width: "100%",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        height: "52px"
                                    }} className="btn btn-primary"
                                        disabled={!this.validar}
                                        onClick={this.routeChange}
                                    >INGRESAR</button>
                                </Row>
                                <Row style={{ marginTop: 22, display: this.state.valido ? 'block' : 'none' }}>
                                    <div style={{ color: '#69BC36', fontSize: '16px', fontWeight: 'bold' }}>✓ Correo registrado en Tasa</div>
                                </Row>
                                <Row style={{ marginTop: 22, display: this.state.invalido ? 'block' : 'none' }}>
                                    <div style={{ color: '#fe420f', fontSize: '16px', fontWeight: 'bold' }}>X Correo no registrado</div>
                                </Row>
                            </Col>
                            <Col xs={0} md={6}></Col>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    }

}
export default Registrar