class Circle {
    constructor(id,x, y, oscNode, gainNode, audioCtx) {
        this.id = id
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

        this.overtones = new Array();
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
        circle.arc(this.x, this.y, 14, 0, 2 * Math.PI);
    
        ctx.stroke(circle);
        ctx.fillStyle = "white";
        ctx.fill(circle);

        this.angle += speed;
        return Math.sqrt((this.x - (canvasWidth/2))**2 + (this.y - (canvasHeight/2))**2);

    }
}

class Overtone {
    constructor(oscNode, gainNode, audioCtx, parentNode) {
        this.x = 0
        this.y = 0
        this.parentNode = parentNode
        this.speed = 0
        this.frequency = 0
        this.angle = 0
        this.oscNode = oscNode
        this.gainNode = gainNode
        this.audioCtx = audioCtx
        this.read=false
    }

    draw(ctx, speed, radius) {
        radius+=10
        var newX  = radius * Math.cos(this.angle * (Math.PI/180));
        var newY = radius * Math.sin(this.angle * (Math.PI/180));

        
        this.x = newX + this.parentNode.x;
        this.y = newY + this.parentNode.y;

        const circle = new Path2D();
        circle.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    
        ctx.stroke(circle);
        ctx.fillStyle = "red";
        ctx.fill(circle);

        this.angle += speed * 100;
        return

    }
}


class TimelineItem {
    constructor(name,child_id,seconds,freq,speed,speed_a,freq_a,freq_overtone,speed_overtone) {
        this.name = name
        this.child_id = child_id
        this.seconds = seconds
        this.frequency = freq
        this.speed = speed
        this.frequency_a = freq_a
        this.speed_a = speed_a
        this.freq_overtone=freq_overtone
        this.speed_overtone=speed_overtone
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
        var speed_overtone_controls=document.getElementsByName("speed_overtone"+circles[i].id)
        var frequency_overtone_controls=document.getElementsByName("frequency_overtone"+circles[i].id)
        circles[i].speed  = parseFloat(speed_controls[i].value)
        let circle_radius = parseFloat((freq_controls[i].value))**(1/(Math.log(5500,10) / Math.log(canvasHeight/2,10)));
        let circle_distance = circles[i].draw(ctx, circles[i].speed, circle_radius)
        circles[i].frequency= circle_distance**(Math.log(5500,10) / Math.log(canvasHeight/2,10))

        if (circles[i].frequency == 0)
            circles[i].oscNode.frequency.value = 0;
        else
            setTimeout(() => circles[i].oscNode.frequency.exponentialRampToValueAtTime(parseFloat(circles[i].frequency), circles[i].audioCtx.currentTime + 0,2))
        if (circles[i].speed == 0) 
            circles[i].gainNode.gain.value = 0;
        else
            setTimeout(() => circles[i].gainNode.gain.exponentialRampToValueAtTime(parseFloat(circles[i].speed ) / 50, circles[i].audioCtx.currentTime + 0,1))

            for (let j = 0; j < circles[i].overtones.length;j++) {

                circles[i].overtones[j].draw(ctx,parseFloat(speed_overtone_controls[j].value)/100,parseFloat(frequency_overtone_controls[j].value)*4)
                circles[i].overtones[j].frequency=circles[i].frequency*parseFloat(frequency_overtone_controls[j].value)
                circles[i].overtones[j].speed  = circles[i].speed*parseFloat(speed_overtone_controls[j].value)/100
                if (circles[i].overtones[j].frequency == 0)
                    circles[i].overtones[j].oscNode.frequency.value = 0;
                else
                    setTimeout(() => circles[i].overtones[j].oscNode.frequency.exponentialRampToValueAtTime(parseFloat(circles[i].overtones[j].frequency), circles[i].overtones[j].audioCtx.currentTime + 0,2))
                if (circles[i].overtones[j].speed == 0) 
                    circles[i].overtones[j].gainNode.gain.value = 0;
                else
                    setTimeout(() => circles[i].overtones[j].gainNode.gain.exponentialRampToValueAtTime(parseFloat(circles[i].overtones[j].speed ) / 50, circles[i].overtones[j].audioCtx.currentTime + 0,1))
            }
        speed_controls[i].value = parseFloat(speed_controls[i].value) + parseFloat(speed_a_controls[i].value);
        freq_controls[i].value = parseFloat(freq_controls[i].value) + parseFloat(frequency_a_controls[i].value);
        }

    
    setTimeout(animate, 33);
}
animate();
}

function createCircle(id,canvas_width, canvas_height, circles) {
    const audioCtx = new AudioContext()
    const oscNode = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0,
    });

    const gainNode = new GainNode(audioCtx, {
        gain: 0.5,
    });

    circles.push(new Circle(id,canvas_width/2, canvas_height/2,oscNode,gainNode, audioCtx))

}

function createOvertone(parentNode, overtones) {
    const audioCtx = new AudioContext()
    const oscNode = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 0,
    });

    const gainNode = new GainNode(audioCtx, {
        gain: 0.5,
    });

    overtones.push(new Overtone(oscNode,gainNode, audioCtx,parentNode))

}


function playFrequency(circles) { 
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles[i].overtones.length;j++) {
            circles[i].overtones[j].audioCtx.resume();
            if (circles[i].overtones[j].read) continue;
            circles[i].overtones[j].oscNode.connect(circles[i].overtones[j].gainNode).connect(circles[i].overtones[j].audioCtx.destination);
            circles[i].overtones[j].oscNode.start();
            circles[i].overtones[j].read = true
        }
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
       circles[i].audioCtx.suspend();
       speed_a_controls[i].value = 0
       frequency_a_controls[i].value=0
       for (let j = 0; i < circles[i].overtones.length;j++) {
        circles[i].overtones[j].audioCtx.suspend();
       }
    }

}

function addTimeline(timelineItems, name, child_id, seconds, freq, speed, speed_a, freq_a,freq_overtone,speed_overtone) {
    timelineItems.push(new TimelineItem(name, child_id,seconds,freq,speed,speed_a,freq_a,freq_overtone,speed_overtone))
}

function setValues(timelineItem,circles) {
    setTimeout(function() {
        var freq_controls = document.getElementById("frequency"+timelineItem.name)
        var speed_controls = document.getElementById("speed"+timelineItem.name)
        var speed_a_controls = document.getElementById("speed_a"+timelineItem.name)
        var frequency_a_controls = document.getElementById("frequency_a"+timelineItem.name)
    if (timelineItem.child_id >= 0) {
            var freq_overtone_controls =document.getElementsByName("frequency_overtone"+timelineItem.name)[timelineItem.child_id]
            var speed_overtone_controls=document.getElementsByName("speed_overtone"+timelineItem.name)[timelineItem.child_id]
    
            freq_overtone_controls.value = timelineItem.frequency
            speed_overtone_controls.value = timelineItem.speed
    }
    else {
    freq_controls.value = timelineItem.frequency
    speed_controls.value = timelineItem.speed
    speed_a_controls.value=timelineItem.speed_a
    frequency_a_controls.value=timelineItem.frequency_a
            
}

    }, parseFloat(timelineItem.seconds) * 1000)

}

function findCircle(id,circles) {
    for (let i = 0; i < circles.length; i++) {
      if (parseInt(id) === parseInt(circles[i].id)) {
        return circles[i];
      }
    }
  }

function launchTimeline(timelineItems) {
    for (let i = 0; i < timelineItems.length; i++) {
        setValues(timelineItems[i])
    }
}