class Node {
    name;
    age;
    balance;
    left;
    right;

    constructor(n, age) {
        this.name = n;
        this.age = age
        this.balance = 0;
        this.left = this.right = null;
    }
}

class AVL {
    root;
    list;

    constructor() {
        this.root = null;
        this.list = new List();
    }

    rollRight(p, q) {
        p.balance = 0;
        q.balance = 0;
        p.left = q.right;
        q.right = p;
    }

    rollLeft(p, q) {
        p.balance = 0;
        q.balance = 0;
        p.right = q.left;
        q.left = p;
    }

    doubleRollRight(p, q) {
        var r;
        r = q.right;
        q.right = r.left;
        r.left = q;
        p.left = r.right;
        r.right = p;

        switch (r.balance) {
            case -1:
                q.balance = 1;
                p.balance = 0;
                break;
            case 0:
                q.balance = p.balance = 0;
                break;
            case 1:
                q.balance = 0;
                p.balance = -1;
                break;
        }
        r.balance = 0;
        return r;
    }

    doubleRollLeft(p, q) {
        var r;
        r = q.left;
        q.left = r.right;
        r.right = q;
        p.right = r.left;
        r.left = p;

        switch (r.balance) {
            case -1:
                q.balance = 0;
                p.balance = 1;
                break;
            case 0:
                q.balance = p.balance = 0;
                break;
            case 1:
                q.balance = -1;
                p.balance = 0;
                break;
        }
        r.balance = 0;
        return r;
    }

    insert(n, age) {
        var nuevo, p, q, s, pivote, pp, llave, altura;

        nuevo = new Node(n, age);
        if (this.root == null) {
            this.root = nuevo;
            return (1); // el arbol tiene un solo Node
        }
        pp = q = null;
        pivote = p = this.root;
        llave = nuevo.name;
        while (p != null) {
            if (p.balance != 0) {
                pp = q;
                pivote = p;
            }

            if (llave == p.name) {
                alert("El nombre ingresado ya se encuentra, por favor ingrese otro");
                return (2); /* ya existe */
            }

            else {
                q = p;
                if (llave < p.name)
                    p = p.left;
                else p = p.right;
            }
        }
        if (llave < q.name)
            q.left = nuevo;
        else q.right = nuevo;
        if (llave < pivote.name) {
            s = pivote.left;
            altura = 1;
        }
        else {
            s = pivote.right;
            altura = -1;
        }
        p = s;
        while (p != nuevo) {
            if (llave < p.name) {
                p.balance = 1;
                p = p.left;
            }
            else {
                p.balance = -1;
                p = p.right;
            }
        }
        if (pivote.balance == 0)
            pivote.balance = altura;
        else if (pivote.balance + altura == 0)
            pivote.balance = 0;
        else {
            if (altura == 1) {
                if (s.balance == 1)
                    this.rollRight(pivote, s);
                else s = this.doubleRollRight(pivote, s);
            }
            else {
                if (s.balance == -1)
                    this.rollLeft(pivote, s);
                else s = this.doubleRollLeft(pivote, s);
            }
            if (pp == null)
                this.root = s;
            else if (pp.left == pivote)
                pp.left = s;
            else pp.right = s;
        }
        return 1;
    }

    balanceRight(q, terminar) {
        var t = null;
        switch (q.balance) {
            case 1:
                q.balance = 0;
                break;
            case -1:
                t = q.right;
                switch (t.balance) {
                    case 1:
                        t = this.doubleRollLeft(q, t);
                        break;
                    case -1:
                        this.rollLeft(q, t);
                        break;
                    case 0:
                        q.right = t.left;
                        t.left = q;
                        t.balance = 1;
                        terminar[0] = 1;
                        break;
                }
                break;
            case 0:
                q.balance = -1;
                terminar[0] = 1;
                break;
        }
        return t;
    }

    balanceLeft(q, terminar) {
        var t = null;
        switch (q.balance) {
            case -1:
                q.balance = 0;
                break;
            case 1:
                t = q.left;
                switch (t.balance) {
                    case 1:
                        this.rollRight(q, t);
                        break;
                    case -1:
                        t = this.doubleRollRight(q, t);
                        break;
                    case 0:
                        q.left = t.right;
                        t.right = q;
                        t.balance = -1;
                        terminar[0] = 1;
                        break;
                }
                break;
            case 0:
                q.balance = 1;
                terminar[0] = 1;
                break;
        }
        return t;
    }

    delete(n) {
        var pila = new Stack();
        var p, q, t, r;
        var llave, accion;

        // Para trabajar terminar por referencia 
        //int []terminar = new int[1];
        var terminar = [];

        var encontro = false;

        if (this.root == null) {
            return (1);
        }

        terminar[0] = 0;
        p = this.root;
        while (!encontro && p != null) {
            pila.push(p);
            if (n < p.name)
                p = p.left;
            else if (n > p.name)
                p = p.right;
            else encontro = true;
        }
        if (!encontro) {
            return (2);
        }
        t = null;
        p = pila.pop();
        llave = p.name;
        if (p.left == null && p.right == null)
            accion = 0;
        else if (p.right == null)
            accion = 1;
        else if (p.left == null)
            accion = 2;
        else accion = 3;
        if (accion == 0 || accion == 1 || accion == 2) {
            if (!pila.empty()) {
                q = pila.pop();
                if (llave < q.name) {
                    switch (accion) {
                        case 0:
                        case 1:
                            q.left = p.left;
                            t = this.balanceRight(q, terminar);
                            break;
                        case 2:
                            q.left = p.right;
                            t = this.balanceRight(q, terminar);
                            break;
                    }
                }
                else {
                    switch (accion) {
                        case 0:
                        case 2:
                            q.right = p.right;
                            t = this.balanceLeft(q, terminar);
                            break;
                        case 1:
                            q.right = p.left;
                            t = this.balanceLeft(q, terminar);
                            break;
                    }
                }
            }
            else {
                switch (accion) {
                    case 0:
                        this.root = null;
                        terminar[0] = 1;
                        break;
                    case 1:
                        this.root = p.left;
                        break;
                    case 2:
                        this.root = p.right;
                        break;
                }
            }
        }
        else {
            pila.push(p);
            r = p;
            p = r.right;
            q = null;
            while (p.left != null) {
                pila.push(p);
                q = p;
                p = p.left;
            }
            llave = r.name = p.name;
            if (q != null) {
                q.left = p.right;
                t = this.balanceRight(q, terminar);
            }
            else {
                r.right = p.right;
                t = this.balanceLeft(r, terminar);
            }
            q = pila.pop();
        }
        while (!pila.empty() && terminar[0] == 0) {
            q = pila.pop();
            if (llave < q.name) {
                if (t != null) {
                    q.left = t;
                    t = null;
                }
                t = this.balanceRight(q, terminar);
            }
            else {
                if (t != null) {
                    q.right = t;
                    t = null;
                }
                t = this.balanceLeft(q, terminar);
            }
        }
        if (t != null) {
            if (pila.empty() == true) this.root = t;
            else {
                q = pila.pop();
                if (llave < q.name)
                    q.left = t;
                else q.right = t;
            }
        }
        return 0;
    }

    toHTML(head) {
        var html = "";

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            var htmlLeft = this.toHTML(head.left);
            var htmlRight = this.toHTML(head.right);

            var color;

            if (head.balance == -1) {
                color = "badge-primary";
            } else if (head.balance == 0) {
                color = "badge-dark";
            } else {
                color = "badge-danger";
            }

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1 ' + color + '" onclick="deleteNode(\'' + head.name + '\')">' +
                head.name + "<br><small>" + head.age +
                '</small></div>';

            if (!(head.left === null && head.right === null)) {

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

    find(root, value) {
        if (root !== null) {
            if ((value) === (root.name)) {
                return root;
            } else if ((value) > (root.name)) {
                return this.find(root.right, value);
            } else if ((value) < (root.name)) {
                return this.find(root.left, value);
            }
        }
    }

    getAge(value) {
        return this.find(this.root, value).age;
    }

    setList(head) {

        if (head != null) {
            this.list.insert(head.name, head.age);
            this.setList(head.left);
            this.setList(head.right);
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
            var newNode = new Node(data);
            newNode.right = this.head;
            this.head = newNode;
        } else {
            var newNode = new Node(data);
            this.head = newNode;
        }

        //print();
        return true;
    }

    pop() {

        var removed = this.head;
        var next = this.head.right;

        this.head = next;
        return removed.name;
    }

    empty() {
        return this.head == null;
    }
}

class List {
    head;

    constructor() {
        this.head = null;
    }

    insert(name, age) {

        var newNode = new Node(name, age);

        if (this.head !== null) {//si la cabeza esta nula
            var temp = this.head;
            if (parseFloat(newNode.age) > parseFloat(temp.age)) {
                while (temp.right !== null) {//mientras encuentre mas menores
                    if (parseFloat(newNode.age) > parseFloat(temp.right.age)) {
                        temp = temp.right;
                    } else {
                        break;
                    }
                }

                if (newNode.right !== null && newNode.right.age > temp.age) {
                    newNode.right = null;
                    temp.right = newNode;
                } else {//si esta en medio del primero y el ultimo
                    newNode.right = temp.right;
                    temp.right = newNode;
                }
            } else {//si va antes del primero
                var tempo = this.head;
                this.head = newNode;
                this.head.right = tempo;
            }
        } else {//si aun no existe lista
            this.head = newNode;
        }

        console.log(this.head);
    }

    toHTML(head) {
        var html = "";

        if (head !== null) {

            html = "<li>" + head.age + " " + head.name + "</li>" + this.toHTML(head.left) + this.toHTML(head.right);
        }

        return html;
    }
}

var tree = new AVL();
printTree();

function printTree() {
    
    if (tree.root === null) {
        $('#treeUl').html("");
    } else {
        $('#treeUl').html(tree.toHTML(tree.root));
    }

    tree.list.head = null;
    tree.setList(tree.root);

    $('#listUl').html(tree.list.toHTML(tree.list.head));
}

function insertNode() {
    if ($('#nameTxt').val() !== "" && $('#ageTxt').val() !== "") {
        tree.insert($('#nameTxt').val(), $('#ageTxt').val());
        printTree();
        $("#nameTxt").val("");
        $("#ageTxt").val("");
    } else {
        alert("Ingrese un dato valido");
    }
    $("#nameTxt").focus();
}

function getAge() {
    if ($('#nameToAgeTxt').val() !== "") {
        var age = tree.getAge($('#nameToAgeTxt').val());
        alert("La edad de " + $('#nameToAgeTxt').val() + " es " + age);
        printTree();
        $("#nameToAgeTxt").val("");
    } else {
        alert("Ingrese un dato valido");
    }
    $("#nameToAgeTxt").focus();
}

function deleteNode(value) {
    var r = confirm("Desea eliminar el nodo " + value + "?");
    if (r === true) {
        tree.delete(value);
        printTree();
    }
}