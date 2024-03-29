//Grap a reference to the canvas and get a context
var canvas = document.getElementById("viewport")
canvas.style.border = "black 1px solid"

//Set the width and height
canvas.width = 600
canvas.height = 600

var ctx = canvas.getContext("2d")

var MOUSE_IS_PRESSED = false
var pMousePos = [0, 0]


var colors = {
    node: "green",
    edge: "blue"
}

var NODE_SIZE = 3
var PIXELS_PER_UNIT = 100



//Some functions to make things easier
function circle(x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
}

function line(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}


//Now let's define some classes
class Node {

    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    draw() {

        ctx.fillStyle = colors.node
        circle(this.x * PIXELS_PER_UNIT, this.y * PIXELS_PER_UNIT, NODE_SIZE)

    }

}

class Edge {

    constructor(node1, node2) {
        this.node1 = node1
        this.node2 = node2
    }

    draw() {

        ctx.strokeStyle = colors.edge
        line(this.node1.x * PIXELS_PER_UNIT, this.node1.y * PIXELS_PER_UNIT, this.node2.x * PIXELS_PER_UNIT, this.node2.y * PIXELS_PER_UNIT)

    }

}

class Mesh {
    
    constructor(nodes, edges) {
        this.nodes = nodes
        this.edges = edges
    }

    draw() {

        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].draw()
        }

        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw()
        }

    }

    rotateY(theta) {

        for (var i = 0; i < this.nodes.length; i++) {

            var x2 = this.nodes[i].x * Math.cos(theta) - this.nodes[i].z * Math.sin(theta)
            var z2 = this.nodes[i].z * Math.cos(theta) + this.nodes[i].x * Math.sin(theta)

            this.nodes[i].x = x2;
            this.nodes[i].z = z2;
        }

    }

    rotateX(theta) {

        for (var i = 0; i < this.nodes.length; i++) {

            var z2 = this.nodes[i].z * Math.cos(theta) - this.nodes[i].y * Math.sin(theta)
            var y2 = this.nodes[i].y * Math.cos(theta) + this.nodes[i].z * Math.sin(theta)

            this.nodes[i].z = z2;
            this.nodes[i].y = y2;
        }

    }

}





//Now let's make a cube
var nodes = [
        new Node(-1, -1, -1), //Top-Back-Left
        new Node(1, -1, -1), //Top-Back-Right
        new Node(1, -1, 1), //Top-Front-Right
        new Node(-1, -1, 1), //Top-Front-Left
        new Node(-1, 1, -1), //Bottom-Back-Left
        new Node(1, 1, -1), //Bottom-Back-Right
        new Node(1, 1, 1), //Bottom-Front-Right
        new Node(-1, 1, 1) //Bottom-Front-Left
]

var edges = [
        new Edge(nodes[0], nodes[1]),
        new Edge(nodes[0], nodes[4]),
        new Edge(nodes[0], nodes[3]),
        new Edge(nodes[1], nodes[5]),
        new Edge(nodes[1], nodes[2]),
        new Edge(nodes[3], nodes[2]),
        new Edge(nodes[3], nodes[7]),
        new Edge(nodes[2], nodes[6]),
        new Edge(nodes[4], nodes[5]),
        new Edge(nodes[5], nodes[6]),
        new Edge(nodes[6], nodes[7]),
        new Edge(nodes[7], nodes[4])
]


ctx.translate(canvas.width/2, canvas.width/2)


var cube3D = new Mesh(nodes, edges)


cube3D.rotateY(Math.PI / 4)
cube3D.rotateX(Math.PI / 4)

cube3D.draw()



//Add event Listeners
canvas.addEventListener("mousedown", () => {
    MOUSE_IS_PRESSED = true
})
canvas.addEventListener("mouseup", () => {
    MOUSE_IS_PRESSED = false
})

canvas.addEventListener("mousemove", (event) => {
    var mousePos = [event.clientX, event.clientY]

    var diffX = mousePos[0] - pMousePos[0]
    var diffY = mousePos[1] - pMousePos[1]
    if (MOUSE_IS_PRESSED) {
        cube3D.rotateY( diffX * ( Math.PI / 180 ) )
        cube3D.rotateX( diffY * ( Math.PI / 180 ) )
        
        ctx.clearRect(-canvas.width/2, -canvas.width/2, canvas.width, canvas.height)
        cube3D.draw()
    }

    pMousePos = mousePos
})
