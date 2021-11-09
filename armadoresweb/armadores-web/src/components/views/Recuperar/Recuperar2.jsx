import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GetCodver, GetCorreo, SetCodver } from '../../../services/storage';
import { postObtenerCodigoAutogenerado } from '../../../services/apiservices';
import { alertController } from '../../../services/AlertMessage';
var imageName = require('../../../images/Frame.png')


class Recuperar2 extends React.Component {
    constructor() {
        super();
        this.routeChange = this.routeChange.bind(this);

        this.state = {
            fields: {
                

            },
            errors: {},
            enviar:true,
        }
        this.validar = false;

        this.cod1="";
        this.cod2="";
        this.cod3="";
        this.cod4="";
        this.codigocompleto="";

        
    }

    routeChange() {
        if (this.validar ) {
            if (GetCodver()==this.codigocompleto) {
                let path = `/Recuperar3`;
                this.props.history.push(path);
            }else{
                alertController('Error',"Codigo no Válido",3);
            }
        }
    }

    volverenviar=()=>{
        this.setState({enviar:false});
        alertController('Información',"En breve te llegará un código al correo, no podrá volver a enviar codigo en 1 minuto",1);
        //alert("En breve te llegará un Codigo con el correo, no podrá volver a enviar codigo en 1 minuto");
        postObtenerCodigoAutogenerado(GetCorreo()).then(p=>{
            console.log(p)
            if (p.id_mensaje=="0") {
                SetCodver(p.codigo_aut);   
            }

        });
        
        setTimeout(()=>{
            this.setState({enviar:true});
        },60000)
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        if (field=="cod1") {
            this.cod1=e.target.value
        }
        if (field=="cod2") {
            this.cod2=e.target.value
        }
        if (field=="cod3") {
            this.cod3=e.target.value
        }
        if (field=="cod4") {
            this.cod4=e.target.value
        }

        if (this.cod1!=""&&this.cod2!=""&&this.cod3!=""&&this.cod4!="") {
            //VALIDACION CON EL RESPONSE DEL SERVICIO
            this.validar =true;
            this.codigocompleto=this.cod1+this.cod2+this.cod3+this.cod4;

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
                                    <div style={{ color: '#5CBDEB', fontSize: '24px', fontWeight: 'bold' }}>Paso 2 de 3</div>
                                </Row>
                                <Row style={{ marginTop: 90 }}>
                                    <div style={{ color: '#9CA5CA', fontSize: '32px', fontWeight: 'bold' }}>CÓDIGO DE VERIFICACIÓN</div>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <div style={{ color: '#576774', fontSize: '16px' }}>Por seguridad hemos enviado un código de ingreso al correo electrónico ingresado</div>
                                </Row>
                                <Row style={{ marginTop: 32 }}>
                                    <div class="form-group" style={{ width: "100%" }}>
                                        <label for="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Código de ingreso</label>
                                        <Row style={{}}>
                                            <Col md={3}>
                                                <input type="text" class="form-control" maxLength="1" onChange={this.handleChange.bind(this, "cod1")} style={{ height: 56, marginTop: 6, fontSize: 24,textAlign: "center" }} id="email" aria-describedby="emailHelp" />
                                            </Col>
                                            <Col md={3}>
                                                <input type="text" class="form-control" maxLength="1" onChange={this.handleChange.bind(this, "cod2")} style={{ height: 56, marginTop: 6, fontSize: 24,textAlign: "center" }} id="email" aria-describedby="emailHelp" />
                                            </Col>
                                            <Col md={3}>
                                                <input type="text" class="form-control" maxLength="1" onChange={this.handleChange.bind(this, "cod3")} style={{ height: 56, marginTop: 6, fontSize: 24,textAlign: "center" }} id="email" aria-describedby="emailHelp" />
                                            </Col>
                                            <Col md={3}>
                                                <input type="text" class="form-control" maxLength="1" onChange={this.handleChange.bind(this, "cod4")} style={{ height: 56, marginTop: 6, fontSize: 24,textAlign: "center" }} id="email" aria-describedby="emailHelp" />
                                            </Col>
                                        </Row>

                                        <small id="emailHelp" style={{ display: "none" }} class="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    <button type="submit" style={{
                                        background: this.validar ? '#8DBF4F' : '#DDECCA',
                                        borderColor: this.validar ? '#8DBF4F' : '#DDECCA',
                                        width: "100%",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        height: "52px"
                                    }} class="btn btn-primary"
                                    disabled={!this.validar}
                                    onClick={this.routeChange}
                                    >INGRESAR</button>
                                </Row>
                                <Row style={{ marginTop: 22 }}>
                                    <a href='#' onClick={this.volverenviar} disabled={!this.state.enviar} style={{ color: '#0076BC', fontSize: '14px', fontWeight: '700' }}>Volver a enviar código</a>
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
export default Recuperar2