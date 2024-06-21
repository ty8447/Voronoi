//Voronoi Generator written by Frederico Lenson, Cole Rabe, Kevin Zhou

//Variables that should NOT be changed
var pointX = 0;
var pColorHL = 0, pColorHU = 360, pColorSL = 29, pColorSU = 100, pColorBL = 100, pColorBU = 100;
var colorHL = 0, colorHU = 360, colorSL = 30, colorSU = 100, colorBL = 100, colorBU = 100;
var modeText = ["Cosine", "Sine", "Line", "Exponential", "Polynomial", "Random Points"]
var pixelHue = [];
var pixelSat = [];
var pixelBright = [];
var pointY = 0;
var button = 0;
var checkFailed = false;
var uColorH = [];
var colorH = [];
var tColorH = 0;
var uColorS = [];
var hover = [true, true, true, true];
var generated = false;
var updateBoPo = false;
var checkX = [215, 215, 215, 215];
var checkY = [197, 137, 167, 227];
var colorS = [];
var uColorB = [];
var boxChange = false;
var colorB = [];
var closePInd = 0;
var pX = [];
var pY = [];
var pR = [];
var distP = [pX.length];
var uPX = [];
var uPY = [];
var uPR = [];
var numPoints = 0;
var tries = 0;
var bet = 0;

//Variables that can be changed
var screen = 0;
var val = [500, 500, 5, 90, 30, 50, 70, 2, 1, 50, false, false, false, false]; //canX,canY,mode,eqRandThresh,pCountLowLim,pCountUpLim,maxNumPoints,eqPow,pRLow,pRHigh,Random Size,Equal Spread,Show Points,Show Border

//Store Previous Value
var pVal = [val[0], val[1], val[2], val[3], val[4], val[5], val[6], val[7], val[8], val[9]];

//Start the generating
function setup() {
    frameRate(30);
  colorMode(HSB);
    generate = createButton("Generate").position(val[0] / 2 - 35, val[1] / 2 + 200).size(70, 30).hide();
    back = createButton("Back").position(val[0] / 2 - 25, val[1] / 2 + 200).size(50, 30).hide();
    cButton = createButton("Edit Color Ranges").position(val[0] / 2 + 50, val[1] / 2 + 195).size(100, 40).hide();
    sliderW = createSlider(60, 1000, val[0], 10).position(210, 43);
    sliderH = createSlider(60, 1000, val[1], 10).position(210, 73);
    sliderM = createSlider(0, 5, val[2], 1).position(210, 103);
    sliderMP = createSlider(1, 150, val[6], 1).position(210, 253).hide();
    sliderET = createSlider(0, 100, val[3], 1).position(210, 283).hide();
    sliderP = createSlider(1, 10, val[7], 1).position(210, 313).hide();
    sliderLPL = createSlider(1, 100, val[4], 1).position(210, 223).hide();
    sliderUPL = createSlider(1, 100, val[5], 1).position(210, 253).hide();
    sliderLRL = createSlider(1, 80, val[8], 1).position(210, 283).hide();
    sliderURL = createSlider(1, 80, val[9], 1).position(210, 313).hide();
    sliderMiS = createSlider(0, 100, colorSL, 1).position(210, 43).hide();
    sliderMaS = createSlider(0, 100, colorSU, 1).position(210, 73).hide();
    sliderMiB = createSlider(0, 100, colorBL, 1).position(210, 103).hide();
    sliderMaB = createSlider(0, 100, colorBU, 1).position(210, 133).hide();
    generate.mousePressed(() => mButtons(3));
    back.mousePressed(() => mButtons(1));
    cButton.mousePressed(() => mButtons(0));

}

//Screen Updater + Check Reset
function draw() {
    if (screen == 0) {
        checkboxes();
        strokeWeight(0.1)
        updateParams();
        for (let i = 0; i < val.length; i++) {
            if ((val[i] != pVal[i] || boxChange == true)) {
                pVal[i] = val[i];
                updateScreen(screen);
                check = false;
                checkFailed = false;
            }
        }
    } else if (screen == 2) {
        updateParams();
        if (pColorSL != colorSL || pColorSU != colorSU || pColorBL != colorBL || pColorBU != colorBU) {
            pColorSL = colorSL;
            pColorSU = colorSU;
            pColorBL = colorBL;
            pColorBU = colorBU;
            updateScreen(screen);
            check = false;
            checkFailed = false;
        }
    }
}
//Update Screen Setup
function updateScreenSetup(){
  clear();
  background(80);
  sState();
}
//Update Screen
function updateScreen() {
    switch (screen) {
    case 0:
        updateScreenSetup();
        paramModes();
        boxChange = true;
        translate(-width/2,-height/2)
        checkboxes();
        boxChange = false;
        hover[0] = true;
        hover[1] = true;
        hover[2] = true;
        hover[3] = true;
        break;
    case 1:
        updateScreenSetup();
        break;
    case 2:
        updateScreenSetup();
        colorPreview();
        break;
    case 3:
        break;
    }
}

//Smallest Distance Check
function inOfSmol() {
    for (let i = 0; i < distP.length; i++) {
        if (distP[i] == min(distP)) {
            closePInd = i;
            closePX = pX[i];
            closePY = pY[i];
        }
    }
}


//Buttons
function mButtons(button){
  switch (button){
    case 0: //Color Editor Button
    screen = 2;
    sState(screen);
      break;
    case 1: //Back Button
          screen = 0;
    sState(screen);
    updateScreen(screen);
      break;
    case 2: //Generate the Image
    numPoints = 0;
    screen = 1;
    generated = false;
    sState(screen);
      break;
    case 3: //Generating "Limbo" to Check Parameters
    textAlign(CENTER)
    updateBoPo = false;
    fill(0, 100, 100);
    noStroke();
    if (screen == 0 && check == false && checkFailed == false) {
        text("Checking Parameters...", 500 / 2, 500 - 80);
        setTimeout(checkLimits, 1000);
    }
    if (screen == 0 && check == false && checkFailed == true) {
      text("A min is higher than the max...", 500 / 2, 500 - 80);
    }
    if (screen == 0 && check == true) {
        text("Generating Image...", 500 / 2, 500 - 80);
        setTimeout(() => {
    let button = 2;
    clear();
    mButtons(button);
  }, 1000);

    } else if (screen != 0) {
        stroke(0)
        strokeWeight(val[1] / 100);
        textSize(val[1] / 10);
        text("Generating Image...", val[0] / 2, val[1] - val[1] / 4);
        setTimeout(() => {
    let button = 2;
    clear();
    mButtons(button);
  }, 1000);

    }
      break;
      
  }
}

//Show Color Editor Previews
function colorPreview() {
    fill(0, sliderMiS.value(), 100)
    circle(-width / 2 + 400, -height / 2 + 53, 20)
    fill(0, sliderMaS.value(), 100)
    circle(-width / 2 + 400, -height / 2 + 83, 20)
    fill(0, 0, sliderMiB.value())
    circle(-width / 2 + 400, -height / 2 + 113, 20)
    fill(0, 0, sliderMaB.value())
    circle(-width / 2 + 400, -height / 2 + 143, 20)
}

//Check Boundaries
function checkLimits() {
    if (val[4] <= val[5] && val[8] <= val[9] && colorSL <= colorSU && colorBL <= colorBU && checkFailed != true) {
        check = true;
        updateScreen(screen);
        setTimeout(mButtons(3), 1000);
      
    } else {
        checkFailed = true;
        updateScreen(screen);
        setTimeout(mButtons(3), 5000);
    }
}
//Generate Random Colors for Markers
function randColor(ind) {
    //Completely Random Colors
    tColorH = random(colorHL, colorHU);
    if (abs(tColorH - colorH[ind - 1]) < 10) {
        tColorH = random(colorHL, colorHU);
    } else
        uColorH[ind] = tColorH;
    colorH = uColorH.filter(function (x) {
        return x !== undefined;
    });
    uColorS[ind] = random(colorSL, colorSU);
    colorS = uColorS.filter(function (x) {
        return x !== undefined;
    });
    uColorB[ind] = random(colorBL, colorBU);
    colorB = uColorB.filter(function (x) {
        return x !== undefined;
    });
}

//Save Function
function keyPressed() {
    if (key == 's')
        save('Image.png');
    if (key == 'g') {
        updateBoPo = false;
        mButtons(3);
    }
    if (key == 'p' && generated == true) {
        pX = [];
        pY = [];
        pR = [];
        pixelHue = [];
        pixelSat = [];
        pixelBright = [];
        colorH = [];
        colorS = [];
        colorB = [];
        uColorH = [];
        uColorS = [];
        uColorB = [];
        uPX = [];
        uPY = [];
        uPR = [];
        distP = [];
        screen = 0;
        updateScreen(screen);
        generated = false;
    }
    if (key == 'b') {
        generated = false;
        val[13] = !val[13];
        boxChange = true;
        updateBoPo = true;
        updateScreen(screen);
    }
    if (key == 'o') {
        generated = false;
        val[12] = !val[12];
        boxChange = true;
        updateBoPo = true;
        updateScreen(screen);
    }
}

//Show Points
function showPointsF() {
    for (let i = 0; i < pX.length; i++) {
        noStroke(0);
        fill(0);
        if (val[10] == true) {
            ellipse(pX[i], pY[i], pR[i], pR[i]);
        } else {
            ellipse(pX[i], pY[i], 5, 5);
        }
    }
}

//Show Border
function showBorderF() {
    strokeWeight(4 * (width / 400) * (height / 400));
    line(-width / 2, -height / 2, width / 2, -height / 2);
    line(-width / 2, height / 2, width / 2, height / 2);
    line(-width / 2, -height / 2, -width / 2, height / 2);
    line(width / 2, -height / 2, width / 2, height / 2);
}

//Check if Points are Overlapping
function overlapCheck() {
    for (let i = 0; i < pX.length; i++) {
        for (let j = 0; j < pX.length; j++) {
            if (i != j && dist(pX[j], pY[j], pX[i], pY[i]) < pR[i] / 2 + pR[j] / 2 && tries < 100 && val[2] == 5) {
                pX[i] = random(-width / 2, width / 2);
                pY[i] = random(-height / 2, height / 2);
                tries++;
                overlapCheck();
                if (tries >= 100) {
                    pX.pop();
                    pY.pop();
                    tries = 0;
                }
            }
        }
    }
}

//Better Show Hide
function bsh (bet) {
  if (bet == 0) {
    sliderLPL.hide();
    sliderUPL.hide(); 
  }
  if (bet == 1) {
      sliderLRL.hide();
      sliderURL.hide();
  }
}

// Show/Hide Parameters 
function paramModes() {
    if (val[2] != 5) {
        textAlign(RIGHT);
        text("Max Points:", -width / 2 + 200, -height / 2 + 270);
        sliderMP.show();
        text("Equation Threshold:", -width / 2 + 200, -height / 2 + 300);
        sliderET.show();
        bsh (0);
        if (val[10] == false) {
            bsh (1);
        }
        textAlign(LEFT);
        text(val[6], -width / 2 + 350, -height / 2 + 270);
        text(val[3], -width / 2 + 350, -height / 2 + 300);
        if (val[2] != 4) {
            sliderP.hide();
        }
        if (val[10] == true && val[2] != 4) {
            textAlign(RIGHT);
            text("Lower Radii Limit:", -width / 2 + 200, -height / 2 + 330);
            sliderLRL.position(210, 313).show();
            text("Upper Radii Limit:", -width / 2 + 200, -height / 2 + 360);
            textAlign(LEFT);
            text(val[8], -width / 2 + 350, -height / 2 + 330);
            text(val[9], -width / 2 + 350, -height / 2 + 360);
            sliderURL.position(210, 343).show();
        } else {
            bsh (1);
        }
        textAlign(RIGHT);
        text("Equal Spread:", -width / 2 + 200, -height / 2 + 240);
    }
    if (val[2] == 4) {
        textAlign(RIGHT);
        text("Power:", -width / 2 + 200, -height / 2 + 330);
        textAlign(LEFT);
        text(val[7], -width / 2 + 350, -height / 2 + 330)
        if (val[10] == true) {
            textAlign(RIGHT);
            text("Lower Radii Limit:", -width / 2 + 200, -height / 2 + 360);
            sliderLRL.position(210, 343).show();
            text("Upper Radii Limit:", -width / 2 + 200, -height / 2 + 390);
            textAlign(LEFT);
            text(val[8], -width / 2 + 350, -height / 2 + 360);
            text(val[9], -width / 2 + 350, -height / 2 + 390);
            sliderURL.position(210, 373).show();
        }
        sliderP.show();
        bsh (0);

    } else if (val[2] == 5) {
        textAlign(RIGHT);
        text("Lower Point Limit:", -width / 2 + 200, -height / 2 + 240);
        sliderLPL.show();
        text("Upper Point Limit:", -width / 2 + 200, -height / 2 + 270);
        sliderUPL.show();
        textAlign(LEFT);
        text(val[4], -width / 2 + 350, -height / 2 + 240);
        text(val[5], -width / 2 + 350, -height / 2 + 270);
        if (val[10] == true) {
            textAlign(RIGHT);
            text("Lower Radii Limit:", -width / 2 + 200, -height / 2 + 300);
            sliderLRL.position(210, 283).show();
            text("Upper Radii Limit:", -width / 2 + 200, -height / 2 + 330);
            textAlign(LEFT);
            text(val[8], -width / 2 + 350, -height / 2 + 300);
            text(val[9], -width / 2 + 350, -height / 2 + 330);
            sliderURL.position(210, 313).show();
        } else {
            bsh (1);
        }
        sliderET.hide();
        sliderMP.hide();
        sliderP.hide();
    }

}

//A Bunch of Different Screens
function sState() {
    switch (screen) {
    case 0: //Start Parameter Screen
        createCanvas(500, 500);
        colorMode(HSB);
        background(80);
        noStroke();
        tries = 0;
        translate(width / 2, height / 2);
        generate.show();
        back.hide();
        cButton.show();
        sliderW.show();
        sliderH.show();
        sliderM.show();
        sliderMiS.hide();
        sliderMaS.hide();
        sliderMiB.hide();
        sliderMaB.hide();
        fill(0);
        textSize(30);
        textAlign(CENTER);
        text("Edit Parameters", 0, -height / 2 + 30);
        textSize(20);
        textAlign(RIGHT);
        text("Random Radii:", -width / 2 + 200, -height / 2 + 210);
        text("Canvas Width:", -width / 2 + 200, -height / 2 + 60);
        text("Canvas Height:", -width / 2 + 200, -height / 2 + 90);
        text("Mode:", -width / 2 + 200, -height / 2 + 120);
        text("Show Points:", -width / 2 + 200, -height / 2 + 150);
        text("Show Border:", -width / 2 + 200, -height / 2 + 180);
        textAlign(LEFT);
        text(val[0], -width / 2 + 350, -height / 2 + 60);
        text(val[1], -width / 2 + 350, -height / 2 + 90);
        text(modeText[val[2]], -width / 2 + 350, -height / 2 + 120);
        break;
    case 1: //Generated Material
        //Setup Canvas
        createCanvas(val[0], val[1]);
        background(200);
        colorMode(HSB);
        translate(width / 2, height / 2);
        if (updateBoPo == false) {
            generate.hide();
            back.hide();
            cButton.hide();
            sliderW.hide();
            sliderH.hide();
            sliderM.hide();
            sliderET.hide();
            sliderMP.hide();
            sliderP.hide();
            sliderLPL.hide();
            sliderUPL.hide();
            sliderLRL.hide();
            sliderURL.hide();
            sliderMiS.hide();
            sliderMaS.hide();
            sliderMiB.hide();
            sliderMaB.hide();
            noStroke();
            //Chooses if completely random or uses an equation
            dModes();
            //Clean up unfiltered arrays
            if (val[2] != 5) {
                pX = uPX.filter(function (x) {
                    return x !== undefined;
                });
                pY = uPY.filter(function (x) {
                    return x !== undefined;
                });
                pR = uPR.filter(function (x) {
                    return x !== undefined;
                });
            }
            for (let i = 0; i < pX.length+1; i++) {
                //Give Random Color
                randColor(i);
            }
            //Scan every point in the canvas
            for (let j = -height / 2; j < height / 2; j++) {
                pixelHue[j] = [];
                pixelSat[j] = [];
                pixelBright[j] = [];
                for (let i = -width / 2; i < width / 2; i++) {
                    pointX = i;
                    pointY = j;
                    //Get the distance of the current point to all markers
                    if (val[10] == true) {
                        for (let i = 0; i < pX.length; i++) {
                            distP[i] = dist(pointX, pointY, pX[i], pY[i]) - pR[i];
                        }
                    } else if (val[10] == false) {
                        for (let i = 0; i < pX.length; i++) {
                            distP[i] = dist(pointX, pointY, pX[i], pY[i]);
                        }
                    }
                    //Figure out which marker is closest to the current point
                    inOfSmol();
                    //Set the current point to the color of the marker
                    stroke(colorH[closePInd], colorS[closePInd], colorB[closePInd]);
                    pixelHue[j][i] = colorH[closePInd];
                    pixelSat[j][i] = colorS[closePInd];
                    pixelBright[j][i] = colorB[closePInd];
                    point(pointX, pointY);
                }
            }
            generated = true;
        } else {
            for (let j = -height / 2; j < height / 2; j++) {
                for (let i = -width / 2; i < width / 2; i++) {
                    stroke(pixelHue[j][i], pixelSat[j][i], pixelBright[j][i]);

                    point(i, j);
                }
            }
        }
        //Show Points Flag
        if (val[12] == true) {
            showPointsF();
            generated = true;
        }
        //Border Flag
        if (val[13] == true) {
            stroke(0);
            showBorderF();
            generated = true;
        } else {
            noStroke();
            generated = true;
        }
        break;
    case 2:
        createCanvas(500, 500);
        colorMode(HSB);
        background(80);
        noStroke();
        translate(width / 2, height / 2);
        fill(0);
        sliderW.hide();
        sliderH.hide();
        sliderM.hide();
        sliderET.hide();
        sliderMP.hide();
        sliderP.hide();
        sliderLPL.hide();
        sliderUPL.hide();
        sliderLRL.hide();
        sliderURL.hide();
        sliderMiS.show();
        sliderMaS.show();
        sliderMiB.show();
        sliderMaB.show();
        generate.hide();
        cButton.hide();
        back.show();
        textSize(30);
        textAlign(CENTER);
        text("Edit Color Ranges", 0, -height / 2 + 30);
        textSize(20);
        textAlign(RIGHT);
        text("Min Saturation:", -width / 2 + 200, -height / 2 + 60);
        text("Max Saturation:", -width / 2 + 200, -height / 2 + 90);
        text("Min Brightness:", -width / 2 + 200, -height / 2 + 120);
        text("Max Brightness:", -width / 2 + 200, -height / 2 + 150);
        textAlign(LEFT);
        text(colorSL, -width / 2 + 350, -height / 2 + 60);
        text(colorSU, -width / 2 + 350, -height / 2 + 90);
        text(colorBL, -width / 2 + 350, -height / 2 + 120);
        text(colorBU, -width / 2 + 350, -height / 2 + 150);
        break;
    }
}

//Update the variables with the sliders
function updateParams() {
    val[0] = sliderW.value();
    val[1] = sliderH.value();
    val[2] = sliderM.value();
    val[3] = sliderET.value();
    val[4] = sliderLPL.value();
    val[5] = sliderUPL.value();
    val[6] = sliderMP.value();
    val[7] = sliderP.value();
    val[8] = sliderLRL.value();
    val[9] = sliderURL.value();
    colorSL = sliderMiS.value();
    colorSU = sliderMaS.value();
    colorBL = sliderMiB.value();
    colorBU = sliderMaB.value();
}

//All of the different modes when generating
function dModes() {
    switch (val[2]) {
    case 0:
        for (let i = 0; i < 360; i++) {
            if (i % 10 == 0 && val[11] == true) {
                //Cosine Function
                angleMode(DEGREES);
                uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                uPY[i] = cos(i) * 20;
            } else if (val[11] == false && numPoints < val[6]) {
                if (random(0, 100) >= val[3]) {
                    angleMode(DEGREES);
                    uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                    uPY[i] = cos(i) * 20;
                    numPoints++;
                }
            }
            if (val[10] == true) {
                uPR[i] = random(val[8], val[9]);
            }
        }
        break;
    case 1:
        for (let i = 0; i < 360; i++) {
            if (i % 10 == 0 && val[11] == true) {
                //Sine Function
                angleMode(DEGREES);
                uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                uPY[i] = sin(i) * 20;
            } else if (val[11] == false && numPoints < val[6]) {
                if (random(0, 100) >= val[3]) {
                    angleMode(DEGREES);
                    uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                    uPY[i] = sin(i) * 20;
                    numPoints++;
                }
            }
            if (val[10] == true) {
                uPR[i] = random(val[8], val[9]);
            }
        }
        break;
    case 2:
        //Line Function
        for (let i = 0; i < 360; i++) {
            if (i % 10 == 0 && val[11] == true) {
                uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                uPY[i] = uPX[i];
            } else if (val[11] == false && numPoints < val[6]) {
                if (random(0, 100) >= val[3]) {
                    uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                    uPY[i] = uPX[i];
                    numPoints++;
                }
            }
            if (val[10] == true) {
                uPR[i] = random(val[8], val[9]);
            }
        }
        break;
    case 3:
        //Exponential Function
        for (let i = 0; i < 360; i++) {
            if (i % 10 == 0 && val[11] == true) {
                uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                uPY[i] = map(pow(i - 30, 2) + width / 2, 0, pow(360, 2), height / 2, -height / 2);
            } else if (val[11] == false && numPoints < val[6]) {
                if (random(0, 100) >= val[3]) {
                    uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                    uPY[i] = map(pow(i - 30, 2) + width / 2, 0, pow(360, 2), height / 2, -height / 2);
                    numPoints++;
                }
            }
            if (val[10] == true) {
                uPR[i] = random(val[8], val[9]);
            }
        }
        break;
    case 4:
        //Polynomial Function
        for (let i = 0; i < 360; i++) {
            if (i % 10 == 0 && val[11] == true) {
                uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                uPY[i] = map(pow(uPX[i], val[7]), -pow(width / 2, val[7]), pow(width / 2, val[7]), -500, 500);
            } else if (val[11] == false && numPoints < val[6]) {
                if (random(0, 100) >= val[3]) {
                    val[7] = 5;
                    uPX[i] = map(i, 0, 360, -width / 2, width / 2);
                    uPY[i] = map(pow(uPX[i], val[7]), -pow(width / 2, val[7]), pow(width / 2, val[7]), -500, 500);
                    numPoints++;
                }
            }
            if (val[10] == true) {
                uPR[i] = random(val[8], val[9]);
            }
        }
        break;
    case 5:
        //Completely Random Points
        for (let i = 0; i < random(val[4], val[5]); i++) {
            pX[i] = random(-width / 2, width / 2);
            pY[i] = random(-height / 2, height / 2);
            if (val[10] == true) {
                pR[i] = random(val[8], val[9]);
            }
            //Give Random Color
            randColor(i);
        }
        overlapCheck();
        break;
    }
}

//Mouse Action for Checkbox Clicks
function mouseReleased() {
  translate(width/2,height/2);
    if (dist(mouseX, mouseY, checkX[0]+ 7, checkY[0] + 7) <= 8 && boxChange == false) {
        val[10] = !val[10];
        boxChange = true;
    }
    if (dist(mouseX, mouseY, checkX[1]+ 7, checkY[1] + 7) <= 8 && boxChange == false) {
        val[12] = !val[12];
        boxChange = true;
    }
    if (dist(mouseX, mouseY, checkX[2]+ 7, checkY[2] + 7) <= 8 && boxChange == false) {
        val[13] = !val[13];
        boxChange = true;
    }
    if (dist(mouseX, mouseY, checkX[3]+ 7, checkY[3] + 7) <= 8 && boxChange == false) {
        val[11] = !val[11];
        boxChange = true;
    }
}

//Draw the checkboxes (This actually makes them look good and not like poop)
function checkboxes() {
    //Show Points Box
    if (val[12] == false && dist(mouseX, mouseY, checkX[1] + 7, checkY[1] + 7) <= 8 && (hover[1] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[1], checkY[1], 15, 15, 3);
        hover[1] = true;
    } else if (val[12] == false && dist(mouseX, mouseY, checkX[1] + 7, checkY[1] + 7) > 8 && hover[1] == true) {
        fill(0, 0, 100);
        rect(checkX[1], checkY[1], 15, 15, 3);
        hover[1] = false;
    } else if (val[12] == true && dist(mouseX, mouseY, checkX[1] + 7, checkY[1] + 7) <= 8 && (hover[1] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[1], checkY[1], 15, 15, 3);
        hover[1] = true;
    } else if (val[12] == true && dist(mouseX, mouseY, checkX[1] + 7, checkY[1] + 7) > 8 && hover[1] == true) {
        fill(212, 100, 90);
        rect(checkX[1], checkY[1], 15, 15, 3);
        hover[1] = false;
    }
    //Border Box
    if (val[13] == false && dist(mouseX, mouseY, checkX[2] + 7, checkY[2] + 7) <= 8 && (hover[2] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[2], checkY[2], 15, 15, 3);
        hover[2] = true;
    } else if (val[13] == false && dist(mouseX, mouseY, checkX[2] + 7, checkY[2] + 7) > 8 && hover[2] == true) {
        fill(0, 0, 100);
        rect(checkX[2], checkY[2], 15, 15, 3);
        hover[2] = false;
    } else if (val[13] == true && dist(mouseX, mouseY, checkX[2] + 7, checkY[2] + 7) <= 8 && (hover[2] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[2], checkY[2], 15, 15, 3);
        hover[2] = true;
    } else if (val[13] == true && dist(mouseX, mouseY, checkX[2] + 7, checkY[2] + 7) > 8 && hover[2] == true) {
        fill(212, 100, 90);
        rect(checkX[2], checkY[2], 15, 15, 3);
        hover[2] = false;
    }
    //Random Radii Box
    if (val[10] == false && dist(mouseX, mouseY, checkX[0] + 7, checkY[0] + 7) <= 8 && (hover[0] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[0], checkY[0], 15, 15, 3);
        hover[0] = true;
    } else if (val[10] == false && dist(mouseX, mouseY, checkX[0] + 7, checkY[0] + 7) > 8 && hover[0] == true) {
        fill(0, 0, 100);
        rect(checkX[0], checkY[0], 15, 15, 3);
        hover[0] = false;
    } else if (val[10] == true && dist(mouseX, mouseY, checkX[0] + 7, checkY[0] + 7) <= 8 && (hover[0] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[0], checkY[0], 15, 15, 3);
        hover[0] = true;
    } else if (val[10] == true && dist(mouseX, mouseY, checkX[0] + 7, checkY[0] + 7) > 8 && hover[0] == true) {
        fill(212, 100, 90);
        rect(checkX[0], checkY[0], 15, 15, 3);
        hover[0] = false;
    }
    //Equal Spread Box
    if (val[2] != 5 && val[11] == false && dist(mouseX, mouseY, checkX[3] + 7, checkY[3] + 7) <= 8 && (hover[3] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[3], checkY[3], 15, 15, 3);
        hover[3] = true;
    } else if (val[2] != 5 && val[11] == false && dist(mouseX, mouseY, checkX[3] + 7, checkY[3] + 7) > 8 && hover[3] == true) {
        fill(0, 0, 100);
        rect(checkX[3], checkY[3], 15, 15, 3);
        hover[3] = false;
    } else if (val[2] != 5 && val[11] == true && dist(mouseX, mouseY, checkX[3] + 7, checkY[3] + 7) <= 8 && (hover[3] == false || boxChange == true)) {
        fill(212, 100, 70);
        rect(checkX[3], checkY[3], 15, 15, 3);
        hover[3] = true;
    } else if (val[2] != 5 && val[11] == true && dist(mouseX, mouseY, checkX[3] + 7, checkY[3] + 7) > 8 && hover[3] == true) {
        fill(212, 100, 90);
        rect(checkX[3], checkY[3], 15, 15, 3);
        hover[3] = false;
    }
}