led.enable(false);
radio.setGroup(1)

/*
A1  P12: Digital IO => Start / Stop
A2  P8 : Digital IO => Skift polaritet
A3  P8 : Digital IO => Skift polaritet

A4  P16: Digital IO => Skiftespor
B1  P3 : Digital IO => Skiftespor
B2  P4 : Digital IO => Skiftespor

B3  P7 : Digital IO => Blok A
B4  P10: Digital IO => Blok B

P0: endStop
P1: endstopRight
P2: endstopLeft

*/

let on : number = 0
let off : number = 1

let endStop0Flagged : boolean = false;
let endStop0Ack: boolean = false;
let endStop0Time: number = 0;

let endStop1Flagged: boolean = false;
let endStop1Ack: boolean = false;
let endStop1Time: number = 0;

let endStop2Flagged: boolean = false;
let endStop2Ack: boolean = false;
let endStop2Time: number = 0;

let direction : number = 0
let stopped : boolean = true;

stop();

function GoReverse() {
    switch (direction) {
        case 1:
            GoWest;
            break;
        case -1:
            GoEast;
            break;
    }
}

function GoWest() {
    stop() // Sluk strøm
    pins.digitalWritePin(DigitalPin.P8, 1)  // Byt polaritet
    pins.digitalWritePin(DigitalPin.P16, 0) // Byt polaritet
    basic.pause(300)
    start() // Tænd strøm
    direction = -1;
}

function GoEast() {
    stop() // Sluk strøm
    pins.digitalWritePin(DigitalPin.P8, 0)  // Byt polaritet
    pins.digitalWritePin(DigitalPin.P16, 1) // Byt polaritet
    basic.pause(300)
    start() // Tænd strøm
    direction = 1;
}

function a4(enable: number) {
    pins.digitalWritePin(DigitalPin.P16, enable)
}

function b1(enable: number) {
    pins.digitalWritePin(DigitalPin.P3, enable)
}

function b2(enable: number) {
    pins.digitalWritePin(DigitalPin.P4, enable)
}

function b3(enable: number) {
    pins.digitalWritePin(DigitalPin.P7, enable)
}

function b4(enable: number) {
    pins.digitalWritePin(DigitalPin.P10, enable)
}

function stop() {
    pins.digitalWritePin(DigitalPin.P12, 0) // Sluk strøm
    stopped = true
}

function start() {
    pins.digitalWritePin(DigitalPin.P12, 1) // Tænd strøm
    stopped = true
}

basic.forever(function () {

    if (pins.digitalReadPin(DigitalPin.P0) && !endStop0Ack && control.millis() > endStop0Time + 50) {
    endStop0Flagged = true 
    endStop0Time = control.millis()
    radio.sendNumber(0)
    } else {
        endStop0Flagged = false
        endStop0Ack = false
        endStop0Time = 0
    }

    if (pins.digitalReadPin(DigitalPin.P1) && !endStop1Ack && control.millis() > endStop1Time + 50) {
        endStop1Flagged = true
        endStop1Time = control.millis()
        radio.sendNumber(1)
    } else {
        endStop1Flagged = false
        endStop1Ack = false
        endStop1Time = 0
    }

    if (pins.digitalReadPin(DigitalPin.P2) && !endStop2Ack && control.millis() > endStop1Time + 50) {
        endStop2Flagged = true
        endStop1Time = control.millis()
        radio.sendNumber(2)
    }
    else {
        endStop1Flagged = false
        endStop1Ack = false
        endStop1Time = 0
    }

})   

radio.onReceivedString(function(receivedString: string) {
    switch(receivedString){
        case "start":
            start()
            break;
        case "stop":
            stop()
            break;
        case "a4off":
            a4(off)
            break;
        case "a4on":
            a4(on)
            break;
        case "b1off":
            b1(off)
            break;
        case "b1on":
            b1(on)
            break;
        case "b2off":
            b2(off)
            break;
        case "b2on":
            b2(on)
            break;
        case "b3off":
            b3(off)
            break;
        case "b3on":
            b3(on)
            break;
        case "b4off":
            b4(off)
            break;
        case "b4on":
            b4(on)
            break;

        case "ack0":
            endStop0Ack = true
            break;
        case "ack1":
            endStop1Ack = true
            break;
        case "ack2":
            endStop2Ack = true
            break;
    }
})


//     a1(on)
//     basic.pause(500)
//     a23(on)
//     basic.pause(500)
//     a4(on)
//     basic.pause(500)

//     b1(on)
//     basic.pause(500)
//     b2(on)
//     basic.pause(500)
//     b3(on)
//     basic.pause(500)
//     b4(on)
//     basic.pause(500)

//     a1(off)
//     basic.pause(500)
//     a23(off)
//     basic.pause(500)
//     a4(off)
//     basic.pause(500)

//     b1(off)
//     basic.pause(500)
//     b2(off)
//     basic.pause(500)
//     b3(off)
//     basic.pause(500)
//     b4(off)
//     basic.pause(500)



// //    HandleEvent();
// })



input.onButtonPressed(Button.A, function() {
    GoEast()
})

input.onButtonPressed(Button.B, function () {
    GoWest()
})

input.onButtonPressed(Button.AB, function () {
    stop()

    a4(on)
    basic.pause(500)

    b1(on)
    basic.pause(500)
    b2(on)
    basic.pause(500)
    b3(on)
    basic.pause(500)
    b4(on)
    basic.pause(500)

    a4(off)
    basic.pause(500)
    b1(off)
    basic.pause(500)
    b2(off)
    basic.pause(500)
    b3(off)
    basic.pause(500)
    b4(off)
    basic.pause(500)


})
