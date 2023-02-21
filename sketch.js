// P_3_2_3_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * fontgenerator with dynamic elements. letter ouline consist of linked agents.
 *
 * MOUSE
 * press + position x  : letter distortion
 *
 * KEYS
 * a-z                 : text input (keyboard)
 * alt                 : freeze current state
 * del, backspace      : clear screen
 * ctrl                : save png
 */

const grammarJSON = {
  "origin": ["#question# #identity# #action#?"],
  "question": ["Who", "What", "Why", "How"],
  "identity": ["are you", "am I", "are they", "is he", "is she"],
  "action": ["typing", "thinking", "writing", "saying"]
  };

let grammar;

var typedKey = 'a';
var fontPath;

var spacing = 20;
var spaceWidth = 80; // width of letter ' '
var fontSize = 100;
var lineSpacing = fontSize * 1.2;
var textW = 0;
var letterX = 50 + spacing;
var letterY = lineSpacing;

var stepSize = 2;
var danceFactor = 1;

var font;
var pnts;

var freeze = false;

var grammarTimer = 0;
var currentSentence;

class Sentence{
  constructor(words, x, y, version){
    this.words = words;
    this.x = x;
    this.y = y;
    this.version = version;
  }

  drawSentence(){
    for(let j = 0; j < this.words.length; j++){
      let pnts = this.getPoints(this.words[j], j * 75);
      if (pnts.length > 0) {
        pnts = this.movePoints(pnts);
        
        strokeWeight(0.08);
    
        beginShape();
        // start controlpoint
        curveVertex(pnts[pnts.length-1].x, pnts[pnts.length-1].y);
        // only these points are drawn
        for (var i = 0; i < pnts.length; i++) {
          curveVertex(pnts[i].x, pnts[i].y);
        }
        curveVertex(pnts[0].x, pnts[0].y);
        // end controlpoint
        curveVertex(pnts[1].x, pnts[1].y);
        endShape();
        
      }
    }
  }

  getPoints(letter, offset){
    fontPath = font.getPath(letter, this.x + offset, this.y, 100);
    var path = new g.Path(fontPath.commands);
    path = g.resampleByLength(path, 25);
    textW = path.bounds().width;
    // remove all commands without a coordinate
    for (var i = path.commands.length - 1; i >= 0 ; i--) {
      if (path.commands[i].x == undefined) {
        path.commands.splice(i, 1);
      }
    }
    return path.commands;
  }

  movePoints(pnts){
    switch(this.version){
      case 0:
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += noise(frameCount * 50 / mouseX) * 100;
          pnts[i].y += noise(frameCount * 50 / mouseY) * 100;
        }
        return pnts;
      case 1:
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += noise(frameCount * 50) * 100;
          pnts[i].y += noise(frameCount * 50) * 100;
        }
        return pnts;
      case 2:
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += noise(frameCount / 50) * 100;
          pnts[i].y += noise(frameCount / 50) * 100;
        }
        return pnts;
      case 3:
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += noise(frameCount * (i * 5)) * 100;
          pnts[i].y += noise(frameCount * (i * 5)) * 100;
        }
        return pnts;
      case 4:
        for (let i = 0; i < pnts.length; i++) {
          pnts[i].x += noise(frameCount * 20) * 50;
        }
        return pnts;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  grammar = tracery.createGrammar(grammarJSON);

  opentype.load('data/FreeSansNoPunch.otf', function(err, f) {
    if (err) {
      console.log("BRUH");
      print(err);
    } else {
      font = f;
    }
  });
}

function draw() {
  if (!font) return;
  
  push();
  noFill();
  grammarTimer += deltaTime;
  if (grammarTimer > 2000){
    background(255);
    let output = grammar.flatten("#origin#");
    currentSentence = new Sentence(output, 300, windowHeight / 2, Math.floor(random(0, 5)));
    grammarTimer = 0;
  }
  if(currentSentence){
    currentSentence.drawSentence();
  }
  pop();
}
