//grupo 9 
var $data = require('./data');
//const HashMap = require('./HashMap');

function Iterator(arr){
  if(!(arr instanceof Array)){
    throw new Error('se necesita un arreglo!');
  }
  this.arr = arr;
  this.index = 0;
  this.length = arr.length;
}

Iterator.prototype.current = function() {
    let res = this.index-1;
  return this.arr[res];
}

Iterator.prototype.next = function(){
  this.index += 1;
  if(this.index > this.length || this.arr[this.index-1] === null){
    return false;
  }
  else{
    return true;
  }
}

function Evaluate(dato) {
  if(!(dato instanceof Array)){
    throw new Error('se necesita un arreglo!');
  }
  this._data = dato;
  this._train = new Array();
  this._test = new Array();
  this.sampling();
}

Evaluate.prototype.sampling = function(){
  var iter = new Iterator(this._data), i = 1;
  
  while(iter.next()){
    iter.current().push(i)
    iter.current().push(0);
    i++;
  }

  while(i !== 2){

    var rand_length = Math.ceil(Math.random() * 100);
    var rand_arr = new Array();
    
    for(var j = 0; j < rand_length; j++){
      var rand_index = Math.floor(Math.random() * 100);
      rand_arr.push(rand_index);
    }
    
    for(; j > 0; j--){
      var t = this._data[rand_arr[j-1]];
      t[t.length-1]++;
      this._data.splice[rand_arr[j], 1, t];
    }

    i--;
  }
}

Evaluate.prototype.result = function() {
  this._train = this._data.filter(function(arr){
    return arr[arr.length-1] > 44;
  });

  this._test = this._data.filter(function(arr){
    return arr[arr.length-1] <= 44;
  });
  
  this._train.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  
  this._test.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  
  return {
    train: this._train,
    test: this._test,
    trainLen: this._train.length,
    testLen: this._test.length
  }
}

Evaluate.prototype.getMatrix = function(model, testData) {
  var _data = testData.slice(0);
  if(typeof model !== 'object'){
    throw new Error('se necesita un modelo');
  };
  var _matrix = [[0,0],[0,0]];
  var iter = new Iterator(_data);
  while(iter.next()){
    var test = iter.current();
    var true_res = test.splice(test.length-1, 1)[0];
    var pred_res = model.predictClass(test);
    if(pred_res === 'YES' && true_res === 'YES'){
        _matrix[0][0]++;
    }else if(pred_res === 'YES' && true_res === 'NO'){
        _matrix[1][0]++;
    }else if(pred_res === 'NO' && true_res === 'YES'){
        _matrix[0][1]++;
    }else if(pred_res === 'NO' && true_res === 'NO'){
        _matrix[1][1]++;
    };
    test.push(true_res);
  }
  return _matrix;
}

Evaluate.prototype.calcRate = function(matrix){
  var tpr = matrix[0][0] / (matrix[0][0] + matrix[0][1]);
  var fpr = matrix[1][0] / (matrix[1][0] + matrix[1][1]);
  return [fpr.toFixed(2), tpr.toFixed(2)];
}

/* BAYES */
function Bayes($data){
  this._DATA = $data;
}

/**
   * Clasifica los datos de entrenamiento en categor??as
   * @return HashMap <categor??a, datos de entrenamiento de la categor??a correspondiente>
*/

Bayes.prototype.dataOfClass = function(){
    var map = new HashMap();
    var t = [], c = '';
    var datas = this._DATA;

    if(!(datas instanceof Array)){
        return;
    }

    for(var i = 0; i < datas.length; i++){
      t = datas[i];
      c = t[t.length - 1];
      if(map.hasKey(c)){
        var ot = map.get(c);
        ot.push(t);
        map.put(c, ot);
      }
      else {
        var nt = [];
        nt.push(t);
        map.put(c, nt);
      }
    }
    return map;
}

/**
    * Predecir la categor??a de datos de prueba
    * @param Array testT datos de prueba
    * @return String Categor??a correspondiente de datos de prueba
*/

Bayes.prototype.predictClass = function(testT){
    var doc = dataOfClass();
    var maxP = 0, maxPIndex = -1;
    var classes = doc.keys();
    
    for(var i = 0; i < classes.length; i++){
        var c = classes[i];
        var d = doc.get(c);
        var pOfC = d.length / this._DATA.length;
        
        for(var j = 0; j < testT.length; j++){
            var pv = this.pOfV(d, testT[j], j);
            pOfC = pOfC * pv;
        }

        if(pOfC > maxP){
            maxP = pOfC;
            maxPIndex = i;
        }
    }

    if(maxPIndex === -1 || maxPIndex > doc.length){
        return 'No se puede clasificar';
    }

    return classes[maxPIndex];
}

Bayes.prototype.pOfV = function(d, value, index){
    var p = 0, count = 0, total = d.length, t = [];
    for(var i = 0; i < total; i++){
      if(d[i][index] === value)
        count++;
    }
    p = count / total;
    return p;
} 

/******* NODO DEL ARBOL DE DECISIONES ******/

function Nodo_Arbol(nodoNombre, nodoTipo){
    this.nombre = nodoNombre || null;  
    this.tipo = nodoTipo || null;
    this.valor = new Array();
}
  
Nodo_Arbol.prototype = {
    getNombre: function() {
        return this.nombre;
    },
    setNombre: function(nodeNombre) {
        this.nombre = nodeNombre;
    },
    getTipo: function() {
        return this.tipo;
    },
    setTipo: function(nodeTipo) {
        this.tipo = nodeTipo;
    },
    getValor: function(){
        return this.valor;
    },
    setValor: function(valor) {
        this.valor = valor;
    },
  }

/********** ARBOL DE DECISIONES **********/
const HashMap = require('./HashMap');
const InfoGanancia = require('./InfoGain');

function Iterator(arr){
    if(!(arr instanceof Array)){
        throw new Error('iterator necesita un parmatro del tipo arreglo!');
    }
    this.arreglo = arr;
    this.tamanio = arr.length;
    this.indice = 0;
}

Iterator.prototype.current = function() {
    return this.arreglo[this.indice-1];
}

Iterator.prototype.next = function(){
    this.indice += 1;
    if(this.indice > this.tamanio || this.arreglo[this.indice-1] === null)
        return false;
    return true;
}

function ArbolDecisiones(datos, atributos) {
    if(!(datos instanceof Array) || !(atributos instanceof Array)){
        throw new Error('Los parametros deben ser del tipo arreglo!');
    }
    this._datos = datos;
    this._atributos = atributos;
    this._nodo = this.crearArbolDecision(this._datos,this._atributos);
}

ArbolDecisiones.prototype.crearArbolDecision = function(datos, listaAtributos) {
    var nodo = new Nodo_Arbol();
    var mapaResultados = this.isPuro(this.getClasificacion(datos));
  
    if(mapaResultados.size() === 1){
        nodo.setTipo('result');
        nodo.setNombre(mapaResultados.keys()[0]);
        nodo.setValor(mapaResultados.keys()[0]);
        // console.log('Arbol con un solo hijo???' + nodo.getVals());
        return nodo;
    }
    if(listaAtributos.length === 0){
        var max = this.getMaxVal(mapaResultados);
        nodo.setTipo('result');
        nodo.setNombre(max)
        nodo.setValor(max);
        // console.log('Valor mayor???'+ max);
        return nodo;
    }

    var indiceAtributo = this.getMaximaGanancia(datos, listaAtributos).indiceAtributo
    // console.log('La ganancia M??xima es???'+ listaAtributos[indiceAtributo);
    // console.log('Nodo creado???'+ listaAtributos[indiceAtributo])
    nodo.setNombre(listaAtributos[indiceAtributo]);
    nodo.setTipo('atributo');

    var atributoAux = new Array();
    atributoAux = listaAtributos;
    // atributoAux.splice(indiceAtributo, 1);

    var mapaValorAtributo = gain.getAttrValue(indiceAtributo); //valor del Map mejor clasificado
    var posibleValores = mapaValorAtributo.keys();
    
    nodo_valores = posibleValores.map(function(v) {
        // console.log('crear rama???'+v);
        var nuevosDatos = datos.filter(function(x) {
            return x[indiceAtributo] === v;
        });

        var nodo_hijo = new Nodo_Arbol(v, 'valores caracteristicos');
        var nodo_hoja = self.crearArbolDecision(nuevosDatos, atributoAux);
        nodo_hijo.setValor(nodo_hoja);
        return nodo_hijo;
    })
    
    nodo.setValor(nodo_valores);

    this._nodo = nodo;
    return nodo;
}

/**
 * Determinar si la clasificaci??n de pureza de los datos 
 * de entrenamiento es una clasificaci??n o no es 
 * una clasificaci??n.
 **/
ArbolDecisiones.prototype.getClasificacion = function(datos){
    var lista = new Array();
    var iteracion = new Iterator(datos);
    while(iteracion.next()){
        var indice = iteracion.current().length - 1;
        var valor = iteracion.current()[indice];
        lista.push(valor);
    }
    return lista;
}

/**
* Obtener un conjunto de resultados de la clasificaci??n y juzgar la pureza
**/
ArbolDecisiones.prototype.isPuro = function(lista) {
    var mapa = new HashMap(), contador = 1;
    lista.forEach(function(item) {
        if(map.get(item)){
            contador++;
        }
        map.put(item, contador);
    });
    return map;
}

/**
* Obtener la m??xima ganancia
**/
ArbolDecisiones.prototype.getMaximaGancia = function(datos, listaAtributos) {
    var ganancia = new InfoGanancia(datos, listaAtributos);
    var maximaGanacia = 0;
    var indiceAtributo = -1;
    for(var i = 0; i < listaAtributos.length; i++){
        var temp = ganancia.getRadioGanancia(i);
        if(maxGain < temp){
            maximaGanacia = temp;
            indiceAtributo = i;
        }
    }
    return {indiceAtributo: indiceAtributo, maximaGanacia: maximaGanacia};
}
/**
 * Obtener la clave con el mayor valor en resultMap
 */
ArbolDecisiones.prototype.getMaxVal = function(map){
    var obj = map.obj, temp = 0, okey = '';
    for(var key in obj){
        if(temp < obj[key] && typeof obj[key] === 'numero'){
            temp = obj[key];
            okey = key;
        };
    }
    return okey;
}
/**
 * Atributos 
 */
DecisionTree.prototype.predictClass = function(ejemplo){
    var raiz = this._nodo;
    var map = new HashMap();
    var listaAtributos = this._atributos;
    for(var i = 0; i < listaAtributos.length; i++){
        map.put(listaAtributos[i], ejemplo[i]);
    }

    while(raiz.tipo !== 'resultado'){
        if(raiz.nombre === undefined){
            return raiz = 'No se puede clasificar';
        }
        var atributo = raiz.nombre;
        var ejemplo = map.get(atributo);
        var nodoHijo = raiz.valor.filter(function(nodo) {
            return nodo.nombre === ejemplo;
        });
        if(nodoHijo.length === 0){
        return raiz = 'No se puede clasificar';
        }
        raiz = nodoHijo[0].valor; // ?????????attribute??????
    }
    return raiz.vals;
}