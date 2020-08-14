class Nodo {
    info;
    edad;
    bal;
    izq;
    der;

    constructor(n, edad) {
        this.info = n;
        this.edad = edad
        this.bal = 0;
        this.izq = this.der = null;
    }
}
class AVL {
    raiz;
    fila;
    list;

    constructor() {
        this.raiz = null;
        this.list = new List();
    }
    rDerecha(p, q) {
        p.bal = 0;
        q.bal = 0;
        p.izq = q.der;
        q.der = p;
    }
    rIzquierda(p, q) {
        p.bal = 0;
        q.bal = 0;
        p.der = q.izq;
        q.izq = p;
    }
    drDerecha(p, q) {
        var r;
        r = q.der;
        q.der = r.izq;
        r.izq = q;
        p.izq = r.der;
        r.der = p;

        //p.der = r.izq;
        //r.izq = p;

        switch (r.bal) {
            case -1:
                q.bal = 1;
                p.bal = 0;
                break;
            case 0:
                q.bal = p.bal = 0;
                break;
            case 1:
                q.bal = 0;
                p.bal = -1;
                break;
        }
        r.bal = 0;
        return r;
    }

    drIzquierda(p, q) {
        var r;
        r = q.izq;
        q.izq = r.der;
        r.der = q;
        p.der = r.izq;
        r.izq = p;

        switch (r.bal) {
            case -1:
                q.bal = 0;
                p.bal = 1;
                break;
            case 1:
                q.bal = -1;
                p.bal = 0;
                break;
            case 0:
                q.bal = p.bal = 0;
                break;
        }
        r.bal = 0;
        return r;
    }

    insAVL(n, edad) {
        var nuevo, p, q, s, pivote, pp, llave, altura;

        nuevo = new Nodo(n, edad);
        if (this.raiz == null) {
            this.raiz = nuevo;
            return (1); // el arbol tiene un solo nodo
        }
        pp = q = null;
        pivote = p = this.raiz;
        llave = nuevo.info;
        while (p != null) {
            if (p.bal != 0) {
                pp = q;
                pivote = p;
            }

            if (llave == p.info) {
                alert("El nombre ingresado ya se encuentra, por favor ingrese otro");
                return (2); /* ya existe */
            }

            else {
                q = p;
                if (llave < p.info)
                    p = p.izq;
                else p = p.der;
            }
        }
        if (llave < q.info)
            q.izq = nuevo;
        else q.der = nuevo;
        if (llave < pivote.info) {
            s = pivote.izq;
            altura = 1;
        }
        else {
            s = pivote.der;
            altura = -1;
        }
        p = s;
        while (p != nuevo) {
            if (llave < p.info) {
                p.bal = 1;
                p = p.izq;
            }
            else {
                p.bal = -1;
                p = p.der;
            }
        }
        if (pivote.bal == 0)
            pivote.bal = altura;
        else if (pivote.bal + altura == 0)
            pivote.bal = 0;
        else {
            if (altura == 1) {
                if (s.bal == 1)
                    this.rDerecha(pivote, s);
                else s = this.drDerecha(pivote, s);
            }
            else {
                if (s.bal == -1)
                    this.rIzquierda(pivote, s);
                else s = this.drIzquierda(pivote, s);
            }
            if (pp == null)
                this.raiz = s;
            else if (pp.izq == pivote)
                pp.izq = s;
            else pp.der = s;
        }
        return 1;
    }

    raizArbol() { return this.raiz; }

    initFila() { this.fila = 0; }

    inorden(p, lienzo) {

        if (p != null) {
            inorden(p.izq, lienzo);
            lienzo.drawString("" + p.info + " " + p.bal, 50, ++this.fila * 15);
            inorden(p.der, lienzo);
        }
    }

    preorden(p, lienzo) {
        if (p != null) {
            lienzo.drawString("" + p.info + " " + p.bal, 90, ++this.fila * 15);
            preorden(p.izq, lienzo);
            preorden(p.der, lienzo);
        }
    }

    posorden(p, lienzo) {
        if (p != null) {
            posorden(p.izq, lienzo);
            posorden(p.der, lienzo);
            lienzo.drawString("" + p.info + " " + p.bal, 130, ++this.fila * 15);
        }
    }

    bal_der(q, terminar) {
        var t = null;
        switch (q.bal) {
            case 1:
                q.bal = 0;
                break;
            case -1:
                t = q.der;
                switch (t.bal) {
                    case 1:
                        t = this.drIzquierda(q, t);
                        break;
                    case -1:
                        this.rIzquierda(q, t);
                        break;
                    case 0:
                        q.der = t.izq;
                        t.izq = q;
                        t.bal = 1;
                        terminar[0] = 1;
                        break;
                }
                break;
            case 0:
                q.bal = -1;
                terminar[0] = 1;
                break;
        }
        return t;
    }

    bal_izq(q, terminar) {
        var t = null;
        switch (q.bal) {
            case -1:
                q.bal = 0;
                break;
            case 1:
                t = q.izq;
                switch (t.bal) {
                    case 1:
                        this.rDerecha(q, t);
                        break;
                    case -1:
                        t = this.drDerecha(q, t);
                        break;
                    case 0:
                        q.izq = t.der;
                        t.der = q;
                        t.bal = -1;
                        terminar[0] = 1;
                        break;
                }
                break;
            case 0:
                q.bal = 1;
                terminar[0] = 1;
                break;
        }
        return t;
    }

    retirarAVL(n) {
        var pila = new Stack();
        var p, q, t, r;
        var llave, accion;

        // Para trabajar terminar por referencia 
        //int []terminar = new int[1];
        var terminar = [];

        var encontro = false;

        if (this.raiz == null) {
            return (1);
        }

        terminar[0] = 0;
        p = this.raiz;
        while (!encontro && p != null) {
            pila.push(p);
            if (n < p.info)
                p = p.izq;
            else if (n > p.info)
                p = p.der;
            else encontro = true;
        }
        if (!encontro) {
            return (2);
        }
        t = null;
        p = pila.pop();
        llave = p.info;
        if (p.izq == null && p.der == null)
            accion = 0;
        else if (p.der == null)
            accion = 1;
        else if (p.izq == null)
            accion = 2;
        else accion = 3;
        if (accion == 0 || accion == 1 || accion == 2) {
            if (!pila.empty()) {
                q = pila.pop();
                if (llave < q.info) {
                    switch (accion) {
                        case 0:
                        case 1:
                            q.izq = p.izq;
                            t = this.bal_der(q, terminar);
                            break;
                        case 2:
                            q.izq = p.der;
                            t = this.bal_der(q, terminar);
                            break;
                    }
                }
                else {
                    switch (accion) {
                        case 0:
                        case 2:
                            q.der = p.der;
                            t = this.bal_izq(q, terminar);
                            break;
                        case 1:
                            q.der = p.izq;
                            t = this.bal_izq(q, terminar);
                            break;
                    }
                }
            }
            else {
                switch (accion) {
                    case 0:
                        this.raiz = null;
                        terminar[0] = 1;
                        break;
                    case 1:
                        this.raiz = p.izq;
                        break;
                    case 2:
                        this.raiz = p.der;
                        break;
                }
            }
        }
        else {
            pila.push(p);
            r = p;
            p = r.der;
            q = null;
            while (p.izq != null) {
                pila.push(p);
                q = p;
                p = p.izq;
            }
            llave = r.info = p.info;
            if (q != null) {
                q.izq = p.der;
                t = this.bal_der(q, terminar);
            }
            else {
                r.der = p.der;
                t = this.bal_izq(r, terminar);
            }
            q = pila.pop();
        }
        while (!pila.empty() && terminar[0] == 0) {
            q = pila.pop();
            if (llave < q.info) {
                if (t != null) {
                    q.izq = t;
                    t = null;
                }
                t = this.bal_der(q, terminar);
            }
            else {
                if (t != null) {
                    q.der = t;
                    t = null;
                }
                t = this.bal_izq(q, terminar);
            }
        }
        if (t != null) {
            if (pila.empty() == true) this.raiz = t;
            else {
                q = pila.pop();
                if (llave < q.info)
                    q.izq = t;
                else q.der = t;
            }
        }
        return 0;
    }

    toHTML(head) {
        var html = "";

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            var htmlLeft = this.toHTML(head.izq);
            var htmlRight = this.toHTML(head.der);

            var color;

            if(head.bal==-1) {
                color = "badge-primary";
            }else if(head.bal==0) {
                color = "badge-dark";
            }else{
                color = "badge-danger";
            }

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1 '+color+'" onclick="eliminar(\'' + head.info + '\')">' +
                head.info + " " + head.edad +
                '</div>';

            if (!(head.izq === null && head.der === null)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    buscar(raiz, valor) {//BUSCAR UN NODO, SE USA PARA BUSCAR EL SIGUIENTE INORDEN
        if (raiz !== null) {
            if ((valor) === (raiz.info)) {
                return raiz;
            } else if ((valor) > (raiz.info)) {
                return this.buscar(raiz.der, valor);
            } else if ((valor) < (raiz.info)) {
                return this.buscar(raiz.izq, valor);
            }
        }
    }

    getEdad(valor) {
        return this.buscar(this.raiz, valor).edad;
    }

    setLista(head) {

        if (head != null) {
            this.list.insert(head.info, head.edad);
            this.setLista(head.izq);
            this.setLista(head.der);
        }
    }
}


class Stack {

    head;

    constructor() {
        this.head = null;
    }

    push(data) {

        if (this.head != null) {
            var newNode = new Nodo(data);
            newNode.der = this.head;
            this.head = newNode;
        } else {
            var newNode = new Nodo(data);
            this.head = newNode;
        }

        //print();
        return true;
    }

    pop() {

        var removed = this.head;
        var next = this.head.der;

        this.head = next;
        //print();
        return removed.info;
    }

    empty() {
        return this.head == null;
    }

    nextPop() {

        if (this.head != null) {
            return this.head.info;
        } else {
            return "";
        }
    }
    /*
        public void print() {
            NodeString q = head;
    
            if (q != null) {
                do {
                    System.out.print(q.getData() + " ");
                    q = q.getNext();
                } while (q != null);
            }
    
            System.out.println();
        }
        */
}


class List {
    head;

    constructor() {
        this.head = null;
    }

    insert(str, age) {

        var newNode = new Nodo(str, age);

        if (this.head !== null) {//si la cabeza esta nula
            var temp = this.head;
            //alert("Entro"+newNode.edad);
            if (parseFloat(newNode.edad) > parseFloat(temp.edad)) {
                //if (newNode.info.localeCompare(temp.info) > -1) {//si el primero en la lista es menor que el nuevo nodo
                while (temp.der !== null) {//mientras encuentre mas menores
                    if (parseFloat(newNode.edad) > parseFloat(temp.der.edad)) {
                        temp = temp.der;
                    } else {
                        break;
                    }
                }

                if (newNode.der !== null && newNode.der.edad > temp.edad) {
                    //if (newNode.der !== null && newNode.der.getName().localeCompare(temp.getName()) > -1) {//si temp es el ultimo en la cola revisar si es menor (el bucle no diferencia si el ultimo es menor porque es el ultimo, no puede devolver null)
                    newNode.der = null;
                    temp.der = newNode;
                } else {//si esta en medio del primero y el ultimo
                    newNode.der = temp.der;
                    temp.der = newNode;
                }
            } else {//si va antes del primero
                var tempo = this.head;
                this.head = newNode;
                this.head.der = tempo;
            }
        } else {//si aun no existe lista
            this.head = newNode;
        }

        console.log(this.head);
    }

    toHTML(head) {
        var html = "";

        if (head !== null) {

            html = head.edad + " " + head.info + "&nbsp;&nbsp;&nbsp;" + this.toHTML(head.izq) + "&nbsp;&nbsp;&nbsp;" + this.toHTML(head.der);
        }

        return html;
    }
}

var tree = new AVL();












function printTree() {

    //onsole.log(miArbol.getRaiz());
    if (tree.raiz === null) {
        $('#treeUl').html("");
    } else {
        $('#treeUl').html(tree.toHTML(tree.raiz));
    }

    tree.list.head = null;
    
    tree.setLista(tree.raiz);

    
    $('#ageString').html(tree.list.toHTML(tree.list.head));
}

function insert() {
    if ( $('#text1').val() !== "" && $('#text2').val() !== "") {
        tree.insAVL($('#text1').val(), $('#text2').val());
        printTree();
        $("#text1").val("");
        $("#text2").val("");
    } else {
        alert("Ingrese un dato valido");
    }
    $("#text1").focus();
}

function getAge() {
    if ( $('#textAge').val() !== "") {
        var age = tree.getEdad($('#textAge').val());
        alert("La edad de "+$('#textAge').val()+" es "+age);
        printTree();
        $("#textAge").val("");
    } else {
        alert("Ingrese un dato valido");
    }
    $("#textAge").focus();
}

function eliminar(valor) {
    var r = confirm("Desea eliminar el nodo " + valor + "?");
    if (r === true) {
        tree.retirarAVL(valor);
        printTree();
    }
}


tree.insAVL("lunes", 2);
tree.insAVL("martes", 3);
tree.insAVL("miercoles", 4);
tree.insAVL("jueves", 5);
tree.insAVL("viernes", 1);


//console.log(tree.raiz);
printTree();




















