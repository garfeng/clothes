var renderer = PIXI.autoDetectRenderer(32, 192, { transparent:true });
var renderer2 = PIXI.autoDetectRenderer(96,192,{ transparent:true });

$("#hh").append(renderer.view);
$("#hh2").append(renderer2.view);
// create the root of the scene graph
var stage = new PIXI.Container();
var stage2 = new PIXI.Container();


// create a texture from an image path
var background = PIXI.Sprite.fromImage("static/img/1.png");
var background2 =  PIXI.Sprite.fromImage("static/img/1.png");

var bunny = PIXI.Sprite.fromImage('static/img/background.png');
var bunny2 = PIXI.Sprite.fromImage('static/img/background.png');




// center the sprite's anchor point
bunny.anchor.x = 0;
bunny.anchor.y = 0;

// move the sprite to the center of the screen
bunny.position.x = 0;
bunny.position.y = 0;

//renderTexture.render(bunny);
stage.addChild(background);
bunny.blendMode = PIXI.BLEND_MODES.MULTIPLY;
stage.addChild(bunny);

stage2.addChild(background2);
bunny2.blendMode = PIXI.BLEND_MODES.MULTIPLY;
stage2.addChild(bunny2);



var render2 = new PIXI.RenderTexture(renderer2,96,192);
//render2.render(bunny);

var newsp = 

// start animating


animate();



var index = 0;
var bh = 1;
var frame = 0;
function animate() {
requestAnimationFrame(animate);
 renderer.render(stage);
 renderer2.render(stage2)
 render2.render(stage2)
 
    // just for fun, let's rotate mr rabbit a little
    // bunny.rotation += 0.1;

    // render the container
    if (frame < 20) {
        frame++;
    } else {
    
        
   
        
        index += bh;

        if (index == 2) {
            bh = -1;
        }
        if (index == 0) {
            bh = 1;
        }
        background.position.x = - index * 32;
        bunny.position.x = - index * 32;
        
        frame = 0;
    }
}


function download(){
   fileData = render2.getBase64();
   $("#file").attr("href",fileData);
   $("#file")[0].click();
    
}