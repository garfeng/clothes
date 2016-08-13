
class GF_Clothes {
    constructor(model, pattern) {
        this.numX = 3;
        this.numY = 4;
        this.modelId = model;
        this.patternId = pattern;
        this.renders = {};
        this.renderTextures = {};
        this.stages = {};
        this.animations = [];
        this.listMap = ["clothes", "sleeve"];
        this.caches = {};
        this.bounds = null;
        this.frame = 0;
        this.bh = 1;
        this.index = 0;

        this.readGroup(this.modelId, "model");
        this.readGroup(this.patternId, "pattern");
        this.waitForLoad(() => {
            this.setup();
        });
    }


    waitForLoad(callback) {
        var loadAll = true;

        for (var i in this.caches) {
            if (!this.caches[i]["loaded"]) {
                loadAll = false;
                break;
            }
        }


        if (!loadAll) {
            setTimeout(() => {
                this.waitForLoad(callback);
            }, 1000);
        } else {

            callback();
        }
    }


    setup() {
        this.setBlendMode();

        this.paint("clothes")
        this.paint("sleeve")
        this.combine();
        this.show();
    }


    combine() {

        this.result = new PIXI.Sprite();
        this.result.addChild(this["clothes"]);
        this.result.addChild(this["sleeve"]);

    }



    show() {
        this.containerS = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });
        $("#hh").append(this.containerS.view);


        this.containerS.render(this.result);

        this.containerDownload = new PIXI.RenderTexture(this.containerS,this.bounds["width"] , this.bounds["height"]);

        this.containerDownload.render(this.result);


        this.containerActive = PIXI.autoDetectRenderer(this.bounds["width"] / this.numX, this.bounds["height"], { transparent: true });

        $("#hh").append(this.containerActive.view);


        this.containerActive.render(this.result);






    }

    readGroup(id, rootPath = "model") {
        this[rootPath] = {};
        var rootPath2 = `images/${rootPath}`;
        let list = [`${rootPath2}/${id}_1.png`, `${rootPath2}/${id}_2.png`];

        for (var i in list) {
            var tmp = new Image();
            tmp.loaded = false;
            tmp.src = list[i];
            tmp.srcid = i;
            this.caches[list[i]] = tmp
            var p = this;
            tmp.onload = function () {
                this.loaded = true;
                var base = new PIXI.BaseTexture(this);
                var text = new PIXI.Texture(base);
                p[rootPath][p.listMap[this.srcid]] = new PIXI.Sprite(text);
                if (rootPath == "model") {
                    p.bounds = {
                        "width": this.naturalWidth,
                        "height": this.naturalHeight
                    }
                }
            }
        }
    }

    setBlendMode() {
        for (var i in this.pattern) {
            var data = this.pattern[i];
            data.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        }
    }


    paint(name) {

        var renderer = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });

        //var stage = new PIXI.Container();
        var sp = new PIXI.Sprite();


        sp.addChild(this.model[name]);

        var tmpListPattern = [];

        var smX = this.bounds["width"] / this.numX;
        var smY = this.bounds["height"] / this.numY;


        for (var y = 0; y < this.numY; y++) {
            for (var x = 0; x < this.numX; x++) {
                tmpListPattern[y * this.numX + x] = new PIXI.Sprite(this.pattern[name].texture.clone());
                if (y <= 2) {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(0, 0, smX, smY);
                } else {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(smX, 0, smX, smY);
                }
                tmpListPattern[y * this.numX + x].position.x = x * smX;
                tmpListPattern[y * this.numX + x].position.y = y * smY;
                tmpListPattern[y * this.numX + x].blendMode = PIXI.BLEND_MODES.MULTIPLY;
                sp.addChild(tmpListPattern[y * this.numX + x]);
            }
        }

        //console.log(this.pattern[name]);

        // this.pattern[name].texture.frame = new PIXI.Rectangle(0,0,32,48)

        // sp.addChild(this.pattern[name]);

        this.renders[name] = renderer;
        this.stages[name] = sp;

        this.renders[name].render(this.stages[name]);


        var renderTexture = new PIXI.RenderTexture(renderer, this.bounds["width"], this.bounds["height"]);
        this.renderTextures[name] = renderTexture;

        this.renderTextures[name].render(this.stages[name]);

        var tmpImg = renderTexture.getImage();

        var tmpBase = new PIXI.BaseTexture(tmpImg);
        var tmpText = new PIXI.Texture(tmpBase);

        this[name] = new PIXI.Sprite(tmpText);



        //renderer.render(stage);

        this.animations.push(() => {
            //this.renders[name].render(this.stages[name]);
            //this[name] = this.renders[name]
        });
    }


}

//var hher = new GF_Clothes("a", "p");

//animate();

function animate() {
    requestAnimationFrame(animate);
    if (hher.frame < 20) {
        hher.frame++;
    } else {

        //renderer2.render(s5);
        hher.index += hher.bh;

        if (hher.index == 2) {
            hher.bh = -1;
        }
        if (hher.index == 0) {
            hher.bh = 1;
        }
        hher.result.position.x = - hher.index * 32;
        // s6.position.x = - index * 32;
        hher.frame = 0;
    }

    hher.containerActive.render(hher.result);
}


function download() {
    fileData = hher.containerDownload.getBase64();
    $("#file").attr("href", fileData);
    $("#file")[0].click();

}

var bitmap = ImageManager.loadBitmap("images/pattern/","p_1",100);
var sp2 = new Sprite(bitmap);


/*
var base = new PIXI.BaseTexture(bitmap._image);
var text = new PIXI.Texture(base);
var test = new PIXI.Sprite(text);
*/
var renderer = PIXI.autoDetectRenderer(96, 192, { transparent: true });
$("#result_show").append(renderer.view);
//sp2.setFrame(0,0,32,20);
/*
function waitForLoad(){
    console.log(ImageManager.isReady());
    if (ImageManager.isReady()) {
        console.log("dddd")
        renderer.render(sp2);
    } else {
        console.log("check")
        setTimeout(()=>{waitForLoad()},1000);
    }
}
*/
bitmap.addLoadListener(function(){
        renderer.render(sp2);
        bitmap.rotateHue(200);
        sp2.blendMode = Graphics.BLEND_MULTIPLY
        renderer.render(sp2);
        console.log(bitmap.width)

})

//waitForLoad();


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