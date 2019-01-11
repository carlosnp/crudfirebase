// seleccionamos la etiqueta respectiva para crear una lista de elementos
const cafeList = document.querySelector('#cafe-list');
// Seleccionamos la etiqueta para el formulario respectivo para crear un nuevo cafe
const cafeForm = document.querySelector('#add-cafe-form');
// Seleccionamos el boton que crea nuevo cafe
var cafeNew = document.querySelector('#btn-cafe');

// Creamos una funcion para mostrar una lista de los elementos de la lista
function renderCafe(doc){
    // Creamos elementos HTML
    let li    = document.createElement('li');
    let name  = document.createElement('span');
    let city  = document.createElement('span');
    let cross = document.createElement('button');
    let edit  = document.createElement('button');
    let saves = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';
    edit.textContent = 'Edit';
    saves.setAttribute('id', 'btn-cafe-update')
    saves.textContent = 'Guardar Cambios';
    saves.style.display = 'none';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    li.appendChild(edit);
    li.appendChild(saves);

    cafeList.appendChild(li);

    // Eliminar elemiento
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafe').doc(id).delete();
    });
    // Editar
    edit.addEventListener('click', (e) => {
        e.stopPropagation();
        cafeNew.style.display = 'none';
        saves.style.display = 'inline';
        edit.style.display = 'none';
        cafeForm.name.value = doc.data().name;
        cafeForm.city.value = doc.data().city;
    })
    // Actualizar
    saves.addEventListener('click', (e) => {
        e.stopPropagation();
        cafeNew.style.display = 'inline';
        saves.style.display = 'none';
        edit.style.display = 'inline';
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafe').doc(id).set({
            name: cafeForm.name.value,
            city: cafeForm.city.value,
        });
        cafeForm.name.value = '';
        cafeForm.city.value = '';
    });
}

// //////////////////////////////////////////////
// Obtener la data Filtrada por ciudad
// db.collection('cafe').where('city', '==', 'Merida').get().then(snapshot => {

// Filtra la data alfabeticamente 
// db.collection('cafe').where('city', '>', 'F').get().then(snapshot => {
// db.collection('cafe').where('city', '<', 'W').get().then(snapshot => {

// obtener y ordenar la data por nombre
// db.collection('cafe').orderBy('name').get().then(snapshot => {

// obtener y ordenar la data por ciudad
// db.collection('cafe').orderBy('city').get().then(snapshot => {
// obtener y ordenar la data por ciudad, mas filtrado
// db.collection('cafe').where('city', '==', 'Merida').orderBy('name').get().then(snapshot => {
// obtener toda la data
// db.collection('cafe').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// ///////////////////////////////////////////
// Obtener datos en tiempo real
db.collection('cafe').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    // console.log(changes);
    changes.forEach(change => {
        console.log(change.doc.data());
        console.log(change.type);
        if (change.type == 'added') {
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        } else if (change.type == 'modified') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
            renderCafe(change.doc);
        }
    });
})

// Funcion para crear nuevo cafe
cafeForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    db.collection('cafe').add({
        name: cafeForm.name.value,
        city: cafeForm.city.value,
    });
    cafeForm.name.value = '';
    cafeForm.city.value = '';
})

// obteniendo datos de la base de datos en firebase
// para mostrarlos en la consola
// db.collection('cafe').get().then((snapshot) => {
//     console.log('Lista de todos los elementos del array')
//     console.log(snapshot.docs);
//     console.log('Detalles de cada elemento del array')
//     snapshot.docs.forEach(doc => {
//         console.log(doc);
//     });
//     console.log('informacion de cada elemento del array')
//     snapshot.docs.forEach(doc => {
//         console.log(doc.data());
//     });
// });

