//import logo from './logo.svg';
//import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch,Redirect  } from 'react-router-dom';
import Login from './components/views/Login/Login';
import Inicio from './components/views/Inicio/Inicio';
import CuentasCobrar from './components/views/CuentasCobrar/CuentasCobrar';
import Menu from './components/layouts/menu';
import Registrar from './components/views/Registrar/Registrar';
import Descargas from './components/views/Descargas/Descargas';
import Liquidacion from './components/views/Liquidacion/Liquidacion';
import Perfil from './components/views/Perfil/Perfil';
import Registrar2 from './components/views/Registrar/Registrar2';
import Registrar3 from './components/views/Registrar/Registrar3';
import Registrar4 from './components/views/Registrar/Registrar4';
import {alertController} from './services/AlertMessage';

import Recuperar1 from './components/views/Recuperar/Recuperar1';
import Recuperar2 from './components/views/Recuperar/Recuperar2';
import Recuperar3 from './components/views/Recuperar/Recuperar3';
import Ayuda from './components/views/Ayuda/Ayuda';

import Configuracion from './components/views/Configuracion/Configuracion';
import Usuarios from './components/views/Configuracion/Usuarios/Usuarios';
function App() {

  // Cerrar Inicio Session en 15 min = 900000 miliseconds
  const time = setTimeout(async() => {
	await alertController('Advertencia', 'El tiempo de sesión del usuario se ha agotado.', 1).then();
	window.location.assign("/Login");
  }, 1900000);	
  
  return ( 
 			<BrowserRouter>
 			
					<Menu/>
					<Switch>
						<Route path="/" component={Login} exact/>
						<Route path="/Login" component={Login}/>
						<Route path="/Inicio" component={Inicio}/>
						<Route path="/CuentasCobrar" component={CuentasCobrar}/>
						<Route path="/Recuperar1" component={Recuperar1} exac/>
						<Route path="/Recuperar2" component={Recuperar2} exac/>
						<Route path="/Recuperar3" component={Recuperar3} exac/>
						
						<Route path="/Registrar" component={Registrar} exac/>
						<Route path="/Registrar2" component={Registrar2} exac/>
						<Route path="/Registrar3" component={Registrar3} exac/>
						<Route path="/Descargas" component={Descargas} exac/>
						<Route path="/Liquidacion" component={Liquidacion} exac/>
						<Route path="/Perfil" component={Perfil} exac/>
						<Route path="/Configuracion" component={Configuracion} exac/>
						<Route path="/Ayuda" component={Ayuda} exac/>
					</Switch>
			
 			</BrowserRouter>
      
  );
}

export default App;
