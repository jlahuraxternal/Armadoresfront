

export function SetUsuario(us){
    localStorage.setItem("username",us);
  }

export function GetUsuario(){
  return localStorage.getItem("username");
}

export function SetTemporada(codigo){
  localStorage.setItem("codTemporada",codigo);
}

export function GetTemporada(){
  return localStorage.getItem("codTemporada");
}

export function SetArmador(codigo){
  localStorage.setItem("codArmador",codigo);
}

export function GetArmador(){
  return localStorage.getItem("codArmador");
}

export function SetTipoSeleccion(codigo){
  localStorage.setItem("tipoSel",codigo);
}

export function GetTipoSeleccion(){
  return localStorage.getItem("tipoSel");
}

export function SetNickname(codigo){
  localStorage.setItem("nickname",codigo);
}
 
export function GetNickname(){
  return localStorage.getItem("nickname");
}
 
//REGISTRAR
export function SetCorreo(codigo){
  localStorage.setItem("codCorreo",codigo);
}
 
export function GetCorreo(){
  return localStorage.getItem("codCorreo");
}
 
export function SetPass(codigo){
  localStorage.setItem("cont",codigo);
}
 
export function GetPass(){
  return localStorage.getItem("cont");
}
 
export function SetCodver(codigo){
  localStorage.setItem("Codver",codigo);
}
 
export function GetCodver(){
  return localStorage.getItem("Codver");
}

export function SetAyuda(codigo){
  localStorage.setItem("Ayuda",codigo);
}

export function GetAyuda(){
  return localStorage.getItem("Ayuda");
}

export function SetGrupo(codigo){
  localStorage.setItem("Grupo",codigo);
}

export function GetGrupo(){
  return localStorage.getItem("Grupo");
}
