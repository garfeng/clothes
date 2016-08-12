

var renderer = PIXI.autoDetectRenderer(32, 192, { transparent: true });
var renderer2 = PIXI.autoDetectRenderer(96, 192, { transparent: true });
var render3 = PIXI.autoDetectRenderer(96, 192, { transparent: true });


$("#hh").append(renderer.view);
$("#hh2").append(renderer2.view);
$("#hh2").append(render3.view);

// create the root of the scene graph
var stage = new PIXI.Container();
var stage2 = new PIXI.Container();


// create a texture from an image path

var img1 = new Image();
img1.src = "static/img/1.png";
var img2 = new Image();
img2.src = "static/img/background.png";

img1.onload = function () {
    var base1 = new PIXI.BaseTexture(this);
    var t1 = new PIXI.Texture(base1);
    var s1 = new PIXI.Sprite(t1);
    var s2 = new PIXI.Sprite(t1);
    var s3 = new PIXI.Sprite();
    var s4 = new PIXI.Sprite(t1);
    var s5 = new PIXI.Sprite();

    s2.blendMode = PIXI.BLEND_MODES.ADD;
    s2.position.x = -8;

    s3.addChild(s1);
    s3.addChild(s2);
    render3.render(s3)
    var render2 = new PIXI.RenderTexture(render3, 96, 192);
    render2.render(s3);
    var img2 = render2.getImage();
    var base2 = new PIXI.BaseTexture(img2);

    var t2 = new PIXI.Texture(base2)
    var s6 = new PIXI.Sprite(t2);
    s6.position.y = 16;
    s6.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    s5.addChild(s4);
    s5.addChild(s6);

    stage.addChild(s5);
    renderer2.render(s5);
    console.log("hhhh")
var index = 0;
var bh = 1;
var frame = 0;
    function animate(){
    requestAnimationFrame(animate);
            if (frame < 20) {
        frame++;
    } else {



//renderer2.render(s5);
        index += bh;

        if (index == 2) {
            bh = -1;
        }
        if (index == 0) {
            bh = 1;
        }
        s4.position.x = - index * 32;
       // s6.position.x = - index * 32;

        frame = 0;
    }
    }

    animate();

}
/*
var background = PIXI.Sprite.fromImage("");
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



var texture1 = stage.generateTexture(renderer);
var texture2 = stage2.generateTexture(renderer2);

var sprite11 = new PIXI.Sprite(texture1);
sprite11.blendMode = PIXI.BLEND_MODES.ADD;
var sprite12 = new PIXI.Sprite(texture2);

var stage3 = new PIXI.Container();






var render2 = new PIXI.RenderTexture(renderer2,96,192);
//render2.render(bunny);



// start animating



*/


var index = 0;
var bh = 1;
var frame = 0;
//animate();

function animate() {
    requestAnimationFrame(animate);

   // renderer.render(stage);
    //renderer2.render(stage2)
    //render2.render(stage2)

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


function download() {
    fileData = render2.getBase64();
    $("#file").attr("href", fileData);
    $("#file")[0].click();

}