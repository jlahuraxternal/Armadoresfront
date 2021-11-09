import Swal from 'sweetalert2';

export function loading(titulo){
    let timerInterval
    Swal.fire({
    title: 'Auto close alert!',
    timer: 2000,
    didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
        }, 100)
    },
    willClose: () => {
        clearInterval(timerInterval)
    }
    }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
    }
    })
}

export function alertController(titulo, mensaje, tipomensaje){
    switch(tipomensaje){
        case 1: // Informacion
            return new Promise(async(resolve) =>{
                Swal.fire({
                    title: titulo,
                    text: mensaje,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                }).then((result) =>{
                    resolve(true);
                });
                
            });
        case 2: // Advertencia
            return new Promise(async(resolve) =>{
                Swal.fire({
                    title: titulo,
                    text: mensaje,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                  })
            });
        
        case 3: //Error
            return new Promise(async(resolve) =>{
                Swal.fire({
                    title: titulo,
                    text: mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
                resolve(true);
            });
        
        case 4: //Interrogante
            return new Promise(async(resolve) =>{
                Swal.fire(
                    titulo,
                    mensaje,
                    'question'
                )
                resolve(true);
            });
    };
    
}