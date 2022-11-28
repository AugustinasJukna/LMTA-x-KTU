class Circle {
    constructor(x, y, oscNode, gainNode, audioCtx) {
        this.x_center = x
        this.y_center = y
        this.read = false;


        this.x = 0
        this.y = 0
        this.angle = 0
        this.speed = 0
        this.frequency = 0

        this.oscNode = oscNode
        this.gainNode = gainNode
        this.audioCtx = audioCtx
    }

    draw(ctx, speed, radius) {

        const center = new Path2D();
        center.arc(this.x_center, this.y_center, 15, 0, 2 * Math.PI);

        ctx.stroke(center);
        ctx.fillStyle = "white";
        ctx.fill(center);

        var newX  = radius * Math.cos(this.angle * (Math.PI/180));
        var newY = radius * Math.sin(this.angle * (Math.PI/180));

        this.x = newX + this.x_center;
        this.y = newY + this.y_center;

        const circle = new Path2D();
        circle.arc(this.x, this.y, 15, 0, 2 * Math.PI);
    
        ctx.stroke(circle);
        ctx.fillStyle = "white";
        ctx.fill(circle);

        this.angle += speed;
        return Math.sqrt((this.x - (canvasWidth/2))**2 + (this.y - (canvasHeight/2))**2);

    }
}



function movement(circles) {
    
// grab the canvas and context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// inital coordinates of the black square
var x = 0;
var y = 0;

canvasWidth = canvas.width
canvasHeight = canvas.height

// the center of the circle
var circleCenterX = canvasWidth/2;
var circleCenterY = canvasHeight/2;

// the radius and angle of the circle, we start at angle 0
var angle = 0.0;
var circle = new Circle(circleCenterX, circleCenterY)
function animate() {

/*     var speed = parseFloat(document.getElementById("speed").value)
    var radius = parseFloat((document.getElementById("frequency").value))**(1/(Math.log(5500,10) / Math.log(canvasHeight/2,10))); */

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // const center = new Path2D();
    // center.arc(circleCenterX, circleCenterY, 15, 0, 2 * Math.PI);

    // ctx.stroke(center);
    // ctx.fillStyle = "white";
    // ctx.fill(center);
    

/*     let distance = circle.draw(ctx, speed, radius);
    let frequency = distance**(Math.log(5500,10) / Math.log(canvasHeight/2,10))
    console.log(frequency) */

    var freq_controls = document.getElementsByName("frequency")
    var speed_controls = document.getElementsByName("speed")
    var speed_a_controls = document.getElementsByName("speed_a")
    var frequency_a_controls = document.getElementsByName("frequency_a")
    
    for (let i = 0; i < freq_controls.length; i++) {
        let circle_speed = parseFloat(speed_controls[i].value)
        console.log(circle_speed)
        let circle_radius = parseFloat((freq_controls[i].value))**(1/(Math.log(5500,10) / Math.log(canvasHeight/2,10)));
        let circle_distance = circles[i].draw(ctx, circle_speed, circle_radius)
        let circle_frequency = circle_distance**(Math.log(5500,10) / Math.log(canvasHeight/2,10))
        if (circle_frequency == 0)
            circles[i].oscNode.frequency.value = 0;
        else
            setTimeout(() => circles[i].oscNode.frequency.exponentialRampToValueAtTime(parseFloat(circle_frequency), circles[i].audioCtx.currentTime + 0,2))
        if (circle_speed == 0) 
            circles[i].gainNode.gain.value = 0;
        else
            setTimeout(() => circles[i].gainNode.gain.exponentialRampToValueAtTime(parseFloat(circle_speed) / 50, circles[i].audioCtx.currentTime + 0,1))
        speed_controls[i].value = parseFloat(speed_controls[i].value) + parseFloat(speed_a_controls[i].value);
        freq_controls[i].value = parseFloat(freq_controls[i].value) + parseFloat(frequency_a_controls[i].value);
        }

    
    setTimeout(animate, 33);
}
animate();
}

function createCircle(canvas_width, canvas_height, circles) {
    const audioCtx = new AudioContext()
    const oscNode = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0,
    });

    const gainNode = new GainNode(audioCtx, {
        gain: 0.5,
    });

    circles.push(new Circle(canvas_width/2, canvas_height/2,oscNode,gainNode, audioCtx))

}


function playFrequency(circles) { 
    for (let i = 0; i < circles.length; i++) {
        circles[i].audioCtx.resume();
        if (circles[i].read) continue;
        circles[i].oscNode.connect(circles[i].gainNode).connect(circles[i].audioCtx.destination);
        circles[i].oscNode.start();
        circles[i].read = true
    }
}
function stopFrequency(circles) {
    var frequency_a_controls = document.getElementsByName("frequency_a")
    var speed_a_controls = document.getElementsByName("speed_a")
    for (let i = 0; i < circles.length; i++) {
        //circles[i].oscNode.stop();
        //if (!circles[i].read) continue;
        //circles[i].oscNode.disconnect(circles[i].gainNode).disconnect(circles[i].audioCtx.destination)
       // circles[i].read = false
       circles[i].audioCtx.suspend();
       speed_a_controls[i].value = 0
       frequency_a_controls[i].value=0
    }

}