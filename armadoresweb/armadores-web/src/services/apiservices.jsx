import env from "react-dotenv";


  export function LoginIngreso(us, pass) {
    const response = fetch(env.SERVER_API  + 'Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({ 'user': us, 'password': pass })
    }).then((response) => response.json()); 
    return response;
  }


  export function postObtenerCodigoAutogenerado(correo) {
    const response = fetch(env.SERVER_API  + 'ObtenerCodigoAutogenerado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({ 'correo': correo })
    }).then((response) => response.json()); 
    return response;
  }

  export function postActualizarUsuarioReg(correo,pass,nickname) {
    const response = fetch(env.SERVER_API  + 'ActualizarUsuarioReg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({ 'correo': correo,'pass':pass,'nickname':nickname })
    }).then((response) => response.json()); 
    return response;
  }
  
  export function postActualizarContraseña(correo,pass) {
    const response = fetch(env.SERVER_API  + 'ActualizarContrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({ 'correoUS': correo,'password':pass})
    }).then((response) => response.json()); 
    return response;
  }

  export function postObtenerTemporadas() {
    const response = fetch(window.env.SERVER_API + "ObtenerTemporadas", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      
    }).then((response) => response.json());
    return response;
  }

    export function postObtenerPlantas() {
    const response = fetch(env.SERVER_API + "ObtenerPlantas", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      
    }).then((response) => response.json());
    return response;
  }

  export function postObtenerRazonSocial(usuario) {
    const response = fetch(env.SERVER_API + "ObtenerRazonSocial", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "correo": usuario
        //"correo": (usuario.includes('xternalvpn')?"nanequiroz@msn.com":usuario),
      })
    }).then((response) => response.json());
    return response;
  }
  
  export function postInformacionUsuario(us,armador,temporada,tipoSel) {
    let datainput={
      "correo": (us.includes('xternalvpn')?"nanequiroz@msn.com":us),
      "anio": "2021",
      "mes": "08",
      "Temporada" : temporada,
      "CodArmador" : armador,
      "TipoSeleccion": tipoSel                                                                                                                                                                                                                                                    
    };
    console.log(datainput)
    const response = fetch(env.SERVER_API + "InformacionUsuario", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  


  export function postObtenerCobrosFact(fechaini,fechafin,anio,mes,armador,temporada,estado, tipoSel) {
    const response = fetch(env.SERVER_API + "ObtenerCobrosFact", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "FechaIni": fechaini,
        "FechaFin": fechafin,
        "anio": anio,
        "mes": mes,
        "Cod_armador" : armador,
        "Temporada" : temporada,
        "Estado":estado,
        "TipoSeleccion": tipoSel
    })
    }).then((response) => response.json() );
    return response;
  }

  export function postDetalleFacturaUsu(factura,armador,temporada) {
    const response = fetch(env.SERVER_API + "DetalleFacturaUsu", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Factura":factura,
        "Cod_armador" : armador,
        "Temporada" : temporada
    })
    }).then((response) => response.json());
    return response;
  }


  export function postObtenerListaLiquidaciones(armador,temporada,estado,tipoSel) {
    const response = fetch(env.SERVER_API + "ObtenerListaLiquidaciones", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" : armador,
        "Temporada" : temporada,
        "Estado":estado,
        "TipoSeleccion":tipoSel
    })
    }).then((response) => response.json());
    return response;
  }

  export function postDetalleLiquidacionUsu(armador,Nro_Liquidacion) {
    const response = fetch(env.SERVER_API + "DetalleLiquidacionUsu ", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" : armador,
        "Nro_Liquidacion" : Nro_Liquidacion
    })
    }).then((response) => response.json() );
    return response;
  }
  
  export function postObtenerDatosDescarga(armador,temporada, tipoSel) {
    const response = fetch(env.SERVER_API + "ObtenerDatosDescarga", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "CodArmador" : armador,
        "Temporada" : temporada,
        "TipoSeleccion": tipoSel
    })
    }).then((response) => response.json());
    return response;
  }
  export function postObtenerListaDescarga(armador,temporada,planta,fechaini,fechafin,tipoSel) {
    const response = fetch(env.SERVER_API + "ObtenerListaDescarga", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" : armador,
        "Temporada" : temporada,
        "CodPlanta":planta,
        "FechaIniDesc1":fechaini,
        "FechaIniDesc2":fechafin,
        "TipoSeleccion":tipoSel
    })
    }).then((response) => response.json() );
    return response;
  }

  export function postObtenerListaPlanta(armador,temporada,matricula,planta,fechaini,fechafin) {
    const response = fetch(env.SERVER_API + "ObtenerListaPlanta", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" : armador,
        "Temporada" : temporada,
        "Matricula":matricula,
        "CodPlanta":planta,
        "FechaIniDesc1":fechaini,
        "FechaIniDesc2":fechafin,
    })
    }).then((response) => response.json() );
    return response;
  }

  export function postObtenerDescargasXEmb(armador,temporada,matricula,planta,fechaini,fechafin) {
    const response = fetch(env.SERVER_API + "ObtenerDescargasXEmb", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" : armador,
        "Temporada" : temporada,
        "Matricula":matricula,
        "CodPlanta":planta,
        "FechaIniDesc1":fechaini,
        "FechaIniDesc2":fechafin,
    })
    }).then((response) => response.json() );
    return response;
  }

  export function postDetalleDescargaXEmb(armador,Temporada,Matricula,Cod_Planta,Fecha_Desc,NroOperacion) {
    const response = fetch(env.SERVER_API + "DetalleDescargaXEmb ", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "Cod_armador" :armador,
        "Temporada" : Temporada,
        "Matricula" : Matricula,
        "Cod_Planta" : Cod_Planta,
        "Fecha_Desc" : Fecha_Desc,
        "NroOperacion" : NroOperacion
    })
    }).then((response) => response.json() );
    return response;
  }

  export function postObtenerInfoEmpresa(usuario) {
    const response = fetch(env.SERVER_API + "ObtenerInfoEmpresa ", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify({
        "correo" :(usuario.includes('xternalvpn')?"nanequiroz@msn.com":usuario)
    })
    }).then((response) => response.json());
    return response;
  }

  export function postRegistroArmadorimput(armador,rate,descripcion) {
    console.log(armador)
    console.log(rate)
    console.log(descripcion)
    const response = fetch(env.SERVER_DESCARGA_API + "RegistroArmador", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_DESCARGA_API },
      body: JSON.stringify({
        "cod_armador":armador,
        "rate":rate,
        "descripcion":descripcion
    })
    }).then((response) => response.json());
    return response;
  }

  export function postConsultaArchivo(armador,liqui) {
    console.log(armador)
    console.log(liqui)
    const response = fetch(env.SERVER_DESCARGA_API + "ConsultaArchivo", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_DESCARGA_API },
      body: JSON.stringify({
        "cod_armador":armador,
        "cod_liquidacion":liqui
    })
    }).then((response) => response.json());
    return response;
  }

  export function postObtenerListaUsuario() {
    let datainput={
      "idGrupo" : 0,
      "idActivo": 0                                                                                                                                                                                                                                                    
    };
    const response = fetch(env.SERVER_API + "ObtenerListaUsuario", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postRegistroUsuario(codArm, correo, usuario, codArm2) {
    let datainput={
      "CodArmador" : codArm,
      "Correo": correo,
      "UsuarioRegistro": usuario,
      "CodArmador2": codArm2                                                                                                                                                                                                                             
    };
    console.log(datainput)
    const response = fetch(env.SERVER_API + "RegistroUsuario", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postActualizarEstadoUsuario(codArm, correo, usuarioMod, activo) {
    let datainput={
      "CodArmador" : codArm,
      "Correo": correo,
      "Activo": activo,
      "UsuarioModifica": usuarioMod                                                                                                                                                                                                                                                    
    };
    console.log(datainput)
    const response = fetch(env.SERVER_API + "ActualizaEstadoUsuario", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postObtenerListaGrupo() {
    let datainput={
      "idGrupo" : 0,
      "idActivo": 0                                                                                                                                                                                                                                                    
    };
    const response = fetch(env.SERVER_API + "ObtenerListaGrupo", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postObtenerListaParticipantes(nroParti, idGrupo) {
    let datainput={
      "NroParticipantes" : nroParti,
      "IdGrupo": idGrupo                                                                                                                                                                                                                                                    
    };
    console.log("Json Lista Par",datainput);
    const response = fetch(env.SERVER_API + "ObtenerListaParticipantes", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postRegistroGrupo(idGrupo, nombreGrupo, usuario, listaParti) {
    let datainput={
      "Idgrupo":idGrupo,
      "NombreGrupo":nombreGrupo,
      "UsuarioRegistro":usuario,
      "listaParticipantes": listaParti
                                                                                                                                                                                                                                               
    };
    console.log(datainput);
    const response = fetch(env.SERVER_API + "RegistroGrupo", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }

  export function postEliminarGrupoParticipantes(idGrupo, activo, usuario) {
    let datainput={
      "Idgrupo": idGrupo, 
      "Activo": activo, 
      "UsuarioRegistro": usuario                                                                                                                                                                                                                                        
    };
    console.log(datainput);
    const response = fetch(env.SERVER_API + "EliminaGrupoParticipantes", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-functions-key': env.KEY_API },
      body: JSON.stringify(datainput)
    }).then((response) => response.json());
    return response;
  }
  

