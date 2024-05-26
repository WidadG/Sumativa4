let DB;
//Selectores
const clienteInput = document.querySelector("#cliente"); //modificado
const emailInput = document.querySelector("#email");
const deporteInput = document.querySelector("#deporte"); //modificado
const fechaInput = document.querySelector("#fecha");
const canchaInput = document.querySelector("#cancha"); //modificado

const formulario = document.querySelector('#formulario-reserva')
const formularioInput = document.querySelector('#formulario-reserva input[type="submit"]')

const contenedorReservas = document.querySelector('#reservas')

window.onload = () => {
    eventListeners()
    crearDB()
}

// Eventos
function eventListeners() {
    deporteInput.addEventListener('input', datosReserva)
    clienteInput.addEventListener('input', datosReserva)
    emailInput.addEventListener('input', datosReserva)
    fechaInput.addEventListener('input', datosReserva)
    canchaInput.addEventListener('input', datosReserva)
    formulario.addEventListener('submit', submitReserva)
}

let editando = false

//Objeto de reserva
const reservaObj = {
    id: generarId(),
    cliente: '',
    email: '',
    deporte: '',
    fecha: '',
    cancha: ''
}

class Notificacion {

    constructor({ texto, tipo }) {
        this.texto = texto
        this.tipo = tipo

        this.mostrar()
    }

    mostrar() {
        //Crear notificación
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm')

        // Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.alert')
        alertaPrevia?.remove()


        //si es tipo error, agregar clase

        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')

        //Mensaje de error
        alerta.textContent = this.texto

        //Insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario)

        // Quitar después de 5 segundos
        setTimeout(() => {
            alerta.remove()
        }, 5000);

    }

}

class AdminReservas {
    constructor() {
        this.reservas = []


    }
    agregar(reserva) {
        this.reservas = [...this.reservas, reserva]
        //this.mostrar()

    }

    editar(reservaActualizada) {
        this.reservas = this.reservas.map(reserva => reserva.id === reservaActualizada.id ? reservaActualizada : reserva)
        this.mostrar()
    }

    eliminar(id) {
        this.reservas = this.reservas.filter(reserva => reserva.id !== id)
        this.mostrar()
    }


    mostrar() {

        //Limpiar HTML
        while (contenedorReservas.firstChild) {
            contenedorReservas.removeChild(contenedorReservas.firstChild)
        }

        // Comprobrar si hay reservas de cancha
        if (this.reservas.length === 0) {
            contenedorReservas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Reservas</p>'
            return
        }

        // Generar reservas
        this.reservas.forEach(reservas => {
            const divReserva = document.createElement('DIV')
            divReserva.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10', 'rounded-xl')

            const cliente = document.createElement('p');
            cliente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            cliente.innerHTML = `<span class="font-bold uppercase">Cliente: </span> ${reservas.cliente}`;

            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${reservas.email}`;

            const deporte = document.createElement('P')
            deporte.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            deporte.innerHTML = `<span class="font-bold uppercase">Deporte: </span> ${reservas.deporte} `


            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${reservas.fecha}`;

            const cancha = document.createElement('p');
            cancha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            cancha.innerHTML = `<span class="font-bold uppercase">Requerimientos: </span> ${reservas.cancha}`;
            // Botones Editar - Eliminar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            const clone = structuredClone(reservas)
            btnEditar.onclick = () => cargarEdicion(clone)

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

            btnEliminar.onclick = () => this.eliminar(reservas.id)

            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10')

            contenedorBotones.appendChild(btnEditar)
            contenedorBotones.appendChild(btnEliminar)

            // Ingresar a HTML
            divReserva.appendChild(cliente);
            divReserva.appendChild(email);
            divReserva.appendChild(deporte)
            divReserva.appendChild(fecha);
            divReserva.appendChild(cancha);
            divReserva.appendChild(contenedorBotones)

            contenedorReservas.appendChild(divReserva)
        })
    }
}


function datosReserva(e) {
    reservaObj[e.target.name] = e.target.value

}

const reservas = new AdminReservas()

function submitReserva(e) {
    e.preventDefault()


    if (Object.values(reservaObj).some(valor => valor.trim() === '')) { //some() es un metodo que permite ver que almenos uno cumpla la condición
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return
    }


    if (editando) {
        reservas.editar({ ...reservaObj })
        new Notificacion({
            texto: 'Guardado con éxito',
            tipo: 'exito'
        })
    } else {
        reservas.agregar({ ...reservaObj })
        new Notificacion({
            texto: 'Reserva de cancha con éxito',
            tipo: 'exito'
        })

        //Insertar en BD
        const transaction = DB.transaction(['reservas'], 'readwrite')
        const objectStore = transaction.objectStore('reservas')

        objectStore.add(reservaObj)

        transaction.oncomplete = function () {
            console.log('reserva agregada')
        }
    }


    reservas.mostrar()
    formulario.reset()
    reiniciarObjetoReserva()
    formularioInput.value = 'Registrar Reserva'
    editando = false



}

function reiniciarObjetoReserva() {
    //reiniciar el objeto

    Object.assign(reservaObj, {
        id: generarId(),
        cliente: '',
        email: '',
        deporte: '',
        fecha: '',
        cancha: ''
    })
}


function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}
function cargarEdicion(reserva) {
    Object.assign(reservaObj, reserva)

    clienteInput.value = reserva.cliente
    emailInput.value = reserva.email
    deporteInput.value = reserva.deporte
    fechaInput.value = reserva.fecha
    canchaInput.value = reserva.cancha

    editando = true

    formularioInput.value = 'Guardar Cambios'

}

function crearDB() {
    //Se crea la bd en primera version

    const crearDB = window.indexedDB.open('reservas', 1)

    //Si hay error
    crearDB.onerror = function () {
        console.log("Hubo un error")
    }

    //Si todo sale bien
    crearDB.onsuccess = function () {
        console.log('BD creada')
        DB = crearDB.result
        console.log(DB)
    }

    //Definir esquema

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result

        const objectStore = db.createObjectStore('reservas', {
            keyPath: 'id',
            autoIncrement: true
        })

        //Definir columnas

        objectStore.createIndex('cliente', 'cliente', { unique: false })
        objectStore.createIndex('email', 'email', { unique: false })
        objectStore.createIndex('deporte', 'deporte', { unique: false })
        objectStore.createIndex('fecha', 'fecha', { unique: false })
        objectStore.createIndex('cancha', 'cancha', { unique: false })
        objectStore.createIndex('id', 'id', { unique: true })

        console.log('DB creada y lista')
    }
}

/*<div class="mb-5">
<label for="cancha" class="block text-gray-700 uppercase font-bold text-sm">
    Cancha
</label>
<textarea class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md" id="cancha" name="cancha"
    placeholder="Balón de futbol número 5"></textarea>
</div>
*/ //Se guarda xsiaca
