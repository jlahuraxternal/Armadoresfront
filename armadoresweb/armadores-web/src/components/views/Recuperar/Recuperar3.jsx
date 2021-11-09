import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GetCorreo, GetPass, SetCodver, SetCorreo, SetPass } from '../../../services/storage';
import { postActualizarUsuarioReg, postActualizarContraseña } from '../../../services/apiservices';
import { alertController } from '../../../services/AlertMessage';
var imageName = require('../../../images/Frame.png')

class Recuperar3 extends React.Component {
    constructor() {
        super();
        this.routeChange = this.routeChange.bind(this);

        this.state = {
            fields: {},
            errors: {}
        }
        this.validar = false;
        this.passsss="";
    }

    routeChange() {
        console.log(this.passsss);
        if (this.validar) {
            postActualizarContraseña(GetCorreo(), this.passsss).then(async(p)=>{
                console.log('Actualizar contraseña',p)
                if (p.id_mensaje=="0") {
                    await alertController('Información', p.mensaje +  ". Ahora puede Iniciar Sesión",1).then()
                    //alert("Se Registro Correctamente! Ahora puede Iniciar Sesión");
                    let path = `/Login`;
                    SetCodver("");
                    SetCorreo("");
                    SetPass("");
                    this.props.history.push(path);
                }else{
                    alertController('Error', p.mensaje ,3)
                }
            });
        } 
        
    }

    CheckPassword(inputtxt) 
    { 
        const decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,25}$/;
        return decimal.test(inputtxt);
    } 

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        if (this.CheckPassword(e.target.value)) {

            console.log("DISPONIBLE")
            this.validar = true;
            this.passsss=e.target.value;

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
                                    <div style={{ color: '#5CBDEB', fontSize: '24px', fontWeight: 'bold' }}>Paso 3 de 3</div>
                                </Row>
                                <Row style={{ marginTop: 90 }}>
                                    <div style={{ color: '#9CA5CA', fontSize: '32px', fontWeight: 'bold' }}>CONTRASEÑA</div>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <div style={{ color: '#576774', fontSize: '16px' }}>Para continuar ingresa una contraseña que sea fácil de recordar y que cumpla con los requisitos</div>
                                </Row>
                                <Row style={{ marginTop: 32 }}>
                                    <div class="form-group" style={{ width: "100%" }}>
                                        <label for="email" style={{ color: '#020B2B', fontSize: '16px', fontWeight: 'bold' }}>Usuario</label>
                                        <input type="password" class="form-control" maxLength={25} style={{ height: 56, marginTop: 6, fontSize: 24 }} onChange={this.handleChange.bind(this, "password")} id="email" aria-describedby="emailHelp" placeholder="Escribe la contraseña" />
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
                                <Row style={{ marginTop: 42 }}>
                                    <div style={{ color: this.validar ? '#69BC36' : '#AAAAAA', fontSize: '16px', fontWeight: 'bold' }}>✓ Mínimo 6 caracteres</div>
                                </Row>
                                <Row style={{ marginTop: 2 }}>
                                    <div style={{ color: this.validar ? '#69BC36' : '#AAAAAA', fontSize: '16px', fontWeight: 'bold' }}>✓ Debe contener letras y números </div>
                                </Row>
                                <Row style={{ marginTop: 2 }}>
                                    <div style={{ color: this.validar ? '#69BC36' : '#AAAAAA', fontSize: '16px', fontWeight: 'bold' }}>✓ Al menos un símbolo</div>
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
export default Recuperar3