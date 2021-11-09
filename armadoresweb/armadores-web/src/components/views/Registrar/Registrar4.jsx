import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { postActualizarUsuarioReg } from '../../../services/apiservices';
import { GetCorreo, GetPass, SetCodver, SetCorreo, SetPass } from '../../../services/storage';
var imageName = require('../../../images/Frame.png')

class Registrar4 extends React.Component {
    constructor() {
        super();
        this.routeChange = this.routeChange.bind(this);

        this.state = {
            fields: {},
            errors: {}
        }
        this.validar = false;
        this.username="";
    }

    routeChange() {
        if (this.validar) {
            postActualizarUsuarioReg(GetCorreo(),GetPass(),this.username).then(p=>{
                if (p.id_mensaje=="0") {
                    alert("Se Registro Correctamente! Ahora puede Iniciar Sesión");
                    let path = `/Login`;
                    SetCodver("");
                    SetCorreo("");
                    SetPass("");
                    this.props.history.push(path);
                }
            });
            
        }
        
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        if (e.target.value.length > 0) {
            console.log("DISPONIBLE")
            this.validar = true;
            this.username=e.target.value;
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
                                    <div style={{ color: '#5CBDEB', fontSize: '24px', fontWeight: 'bold' }}>Paso 4 de 4</div>
                                </Row>
                                <Row style={{ marginTop: 90 }}>
                                    <div style={{ color: '#5CBDEB', fontSize: '32px', fontWeight: 'bold' }}>Proceso completado</div>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <div style={{ color: '#576774', fontSize: '16px' }}>¿Cómo te gusta que te llamen? Puede ser tu primer nombre o un apodo.</div>
                                </Row>
                                <Row style={{ marginTop: 32 }}>
                                    <div class="form-group" style={{ width: "100%" }}>
                                        <label for="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Nombre</label>
                                        <input type="text" class="form-control" maxLength={50} style={{ height: 56, marginTop: 6, fontSize: 24 }} onChange={this.handleChange.bind(this, "usuario")} id="email" aria-describedby="emailHelp" placeholder="Escribe tu nombre" />
                                        <small id="emailHelp" style={{ display: "none" }} class="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    <button type="submit" style={{
                                        background: this.validar ? '#5CBDEB' : '#CEEBF9',
                                        borderColor: this.validar ? '#5CBDEB' : '#CEEBF9',
                                        width: "100%",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        height: "52px"
                                    }} class="btn btn-primary"
                                        disabled={!this.validar}
                                        onClick={this.routeChange}
                                    >INGRESAR</button>
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
export default Registrar4